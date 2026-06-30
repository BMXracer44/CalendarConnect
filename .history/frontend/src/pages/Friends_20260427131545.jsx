import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  // FRIENDS
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEARCH PANEL TOGGLE
  const [showSearch, setShowSearch] = useState(false);

  // SEARCH
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  // ================= LOAD FRIENDS =================
  const loadFriends = async () => {
    try {
      const res = await fetch(
        `/api/friends/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch friends");
        setFriends([]);
        return;
      }

      const data = await res.json();
      console.log("FRIENDS API RESPONSE:", data);

      // ✅ Handle different backend formats safely
      if (Array.isArray(data)) {
        setFriends(data);
      } else if (Array.isArray(data.friends)) {
        setFriends(data.friends);
      } else if (Array.isArray(data.data)) {
        setFriends(data.data);
      } else {
        setFriends([]);
      }

    } catch (err) {
      console.error("Error loading friends:", err);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadFriends();
  }, [user]);

  // ================= SEARCH USERS =================
  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      const res = await fetch(
        `/api/users/search?query=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (!res.ok) {
        console.error("Search failed");
        setResults([]);
        return;
      }

      const data = await res.json();

      // ✅ Safe handling
      if (Array.isArray(data)) {
        setResults(data);
      } else if (Array.isArray(data.users)) {
        setResults(data.users);
      } else {
        setResults([]);
      }

    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }
  };

  // ================= ADD FRIEND =================
  const addFriend = async (friendId) => {
    try {
      const res = await fetch("/api/friends/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          userId: user.id,
          friendId
        })
      });

      if (!res.ok) {
        alert("Failed to send friend request");
        return;
      }

      alert("Friend request sent!");
    } catch (err) {
      console.error("Add friend error:", err);
    }
  };

  // ================= UI =================
  if (!user) {
    return <p>Please log in</p>;
  }

  return (
    <div className="friends-container">
      <div className="friends-card">

        {/* HEADER */}
        <div className="friends-header">
          <h2>Your Friends</h2>

          <button
            className="open-search-btn"
            onClick={() => setShowSearch(!showSearch)}
          >
            {showSearch ? "Hide Search" : "Find Friends"}
          </button>
        </div>

        {/* ================= SEARCH DROPDOWN ================= */}
        {showSearch && (
          <div className="search-dropdown">

            <div className="friends-search">
              <input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button onClick={handleSearch}>
                Search
              </button>
            </div>

            <div className="friends-results">
              {Array.isArray(results) && results.map((u) => (
                <div key={u.id} className="friend-item">
                  <span>{u.username}</span>

                  <button onClick={() => addFriend(u.id)}>
                    Add Friend
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= FRIENDS LIST ================= */}
        {loading && <p>Loading friends...</p>}

        {!loading && (!Array.isArray(friends) || friends.length === 0) && (
          <p className="no-results">
            You don’t have any friends yet.
          </p>
        )}

        <div className="friends-results">
          {Array.isArray(friends) && friends.map((f) => (
            <div key={f.id} className="friend-item">
              <span>{f.username}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Friends;