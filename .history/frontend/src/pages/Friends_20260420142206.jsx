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

  // LOAD FRIENDS
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

      const data = await res.json();
      setFriends(data || []);
    } catch (err) {
      console.error(err);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadFriends();
  }, [user]);

  // SEARCH USERS
  const handleSearch = async () => {
    if (!search.trim()) return;

    const res = await fetch(
      `/api/users/search?query=${search}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    const data = await res.json();
    setResults(data || []);
  };

  // ADD FRIEND
  const addFriend = async (friendId) => {
    await fetch("/api/friends/add", {
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

    alert("Friend request sent!");
  };

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
            {showSearch ? "Hide Search" : "+ Find Friends"}
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
              {results.map((u) => (
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

        {!loading && friends.length === 0 && (
          <p className="no-results">
            You don’t have any friends yet.
          </p>
        )}

        <div className="friends-results">
          {friends.map((f) => (
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