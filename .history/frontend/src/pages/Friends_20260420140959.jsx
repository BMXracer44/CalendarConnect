import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  // SEARCH USERS
  const handleSearch = async () => {
    if (!search.trim()) return;

    const res = await fetch(
      `http://localhost:8080/api/users/search?query=${search}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    const data = await res.json();
    setResults(data);
  };

  // ADD FRIEND
  const addFriend = async (friendId) => {
    await fetch("http://localhost:8080/api/friends/add", {
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

    alert("Friend added!");
  };

  if (!user) {
    return <p>Please log in</p>;
  }

  return (
    <div className="friends-container">

      <div className="friends-card">

        {/* HEADER */}
        <h2>Find Friends</h2>

        {/* SEARCH BAR */}
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

        {/* 👇 RESULTS ALWAYS SHOW UNDER SEARCH */}
        <div className="friends-results">

          {results.length === 0 ? (
            <p className="no-results">No users found</p>
          ) : (
            results.map((u) => (
              <div key={u.id} className="friend-item">
                <span>{u.username}</span>

                <button onClick={() => addFriend(u.id)}>
                  Add Friend
                </button>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
};

export default Friends;