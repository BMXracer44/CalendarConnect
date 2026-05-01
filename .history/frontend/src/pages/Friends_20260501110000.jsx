import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  // ================= LOAD FRIENDS =================
  const loadFriends = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/friends/${user.id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );

      const data = await res.json();
      setFriends(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setFriends([]);
    }
  };

  useEffect(() => {
    if (user?.id) loadFriends();
  }, [user]);

  // ================= SEARCH USERS =================
  const handleSearch = async () => {
    const res = await fetch(
      `http://localhost:8080/api/user/search?query=${search}&currentUserId=${user.id}`,
      {
        headers: { Authorization: `Bearer ${user.token}` }
      }
    );

    const data = await res.json();
    setResults(Array.isArray(data) ? data : []);
  };

  // ================= ADD FRIEND =================
  const addFriend = async (friendId) => {
    await fetch(
      `http://localhost:8080/api/friends/add?from=${user.id}&to=${friendId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` }
      }
    );

    alert("Friend request sent!");
  };

  // ================= ACCEPT FRIEND =================
  const acceptFriend = async (friendId) => {
    await fetch(
      `http://localhost:8080/api/friends/accept?from=${friendId}&to=${user.id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` }
      }
    );

    alert("Friend request accepted!");
    loadFriends();
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div className="friends-container">

      <h2>Friends</h2>

      <button onClick={() => setShowSearch(!showSearch)}>
        {showSearch ? "Hide Search" : "Find Friends"}
      </button>

      {/* SEARCH */}
      {showSearch && (
        <div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
          />
          <button onClick={handleSearch}>Search</button>

          {results.map((u) => (
            <div key={u.id}>
              <span>{u.username}</span>

              {u.friendshipStatus === "none" && (
                <button onClick={() => addFriend(u.id)}>
                  Add Friend
                </button>
              )}

              {u.friendshipStatus === "pending" && (
                <span>Request Sent</span>
              )}

              {u.friendshipStatus === "accepted" && (
                <span>Friends</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* FRIEND LIST */}
      <h3>Your Friends</h3>

      {friends.map((f) => (
        <div key={f.id}>
          {f.username}
        </div>
      ))}
    </div>
  );
};

export default Friends;