import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  // ================= LOAD FRIENDS =================
  const loadFriends = async () => {
    try {
      const res = await fetch(
        `/api/friends/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch friends");
        setFriends([]);
        return;
      }

      const data = await res.json();
      setFriends(Array.isArray(data) ? data : []);
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
        `/api/user/search?query=${search}&currentUserId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Search failed");
        setResults([]);
        return;
      }

      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }
  };

  // ================= ADD FRIEND =================
  const addFriend = async (friendId) => {
    try {
      const res = await fetch(
        `/api/friends/add?from=${user.id}&to=${friendId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        console.error("Add friend error:", msg);
        alert("Failed to send friend request");
        return;
      }

      alert("Friend request sent!");
    } catch (err) {
      console.error("Add friend error:", err);
    }
  };

  // ================= UI =================
  if (!user) return <p>Please log in</p>;

  return (
    <div className="friends-container">
      <div className="friends-card">

        {/* HEADER */}
        <div className="friends-header">
          <h2>Friends</h2>

          <button onClick={() => setShowSearch(!showSearch)}>
            {showSearch ? "Hide Search" : "Find Friends"}
          </button>
        </div>

        {/* ================= SEARCH SECTION ================= */}
        {showSearch && (
          <div className="search-section">

            <div className="search-box">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
              />

              <button onClick={handleSearch}>
                Search
              </button>
            </div>

            <div className="search-results">
              {results.map((u) => (
                <div key={u.id} className="friend-item">

                  <div>
                    <strong>{u.username}</strong>
                    <p>{u.firstName} {u.lastName}</p>
                  </div>

                  {/* STATUS LOGIC */}
                  {u.friendshipStatus === "none" && (
                    <button onClick={() => addFriend(u.id)}>
                      Add Friend
                    </button>
                  )}

                  {u.friendshipStatus === "pending" && (
                    <span style={{ color: "orange" }}>
                      Request Sent
                    </span>
                  )}

                  {u.friendshipStatus === "accepted" && (
                    <span style={{ color: "green" }}>
                      Friends
                    </span>
                  )}

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= FRIEND LIST ================= */}
        <div className="friends-list">
          <h3>Your Friends</h3>

          {loading ? (
            <p>Loading...</p>
          ) : friends.length === 0 ? (
            <p>No friends yet</p>
          ) : (
            friends.map((f) => (
              <div key={f.id} className="friend-item">
                <strong>{f.username}</strong>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Friends;