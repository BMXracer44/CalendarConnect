import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [friends, setFriends] = useState([]);

  // 🔍 SEARCH USERS
  const handleSearch = async () => {
    if (!search) return;

    const res = await fetch(
      `/api/users/search?query=${search}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    const data = await res.json();
    setResults(data);
  };

  // ➕ ADD FRIEND
  const addFriend = async (friendId) => {
    await fetch("/api/friends/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        userId: user.id,
        friendId: friendId
      })
    });

    alert("Friend added!");
  };

  // 👥 LOAD FRIENDS
  const loadFriends = async () => {
    const res = await fetch(
      `/api/friends/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    const data = await res.json();
    setFriends(data);
  };

  useEffect(() => {
    if (user?.id) {
      loadFriends();
    }
  }, [user]);

  if (!user) {
    return <p>Please log in</p>;
  }

  return (
    <div className="friends-page">

      {/* SEARCH SECTION */}
      <h2>Find Friends</h2>

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      {/* SEARCH RESULTS */}
      <div>
        {results.map((u) => (
          <div key={u.id} style={{ margin: "10px 0" }}>
            <span>{u.username}</span>
            <button onClick={() => addFriend(u.id)}>
              Add Friend
            </button>
          </div>
        ))}
      </div>

      <hr />

      {/* FRIENDS LIST */}
      <h2>Your Friends</h2>

      <div>
        {friends.map((f) => (
          <div key={f.id}>
            {f.username}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Friends;