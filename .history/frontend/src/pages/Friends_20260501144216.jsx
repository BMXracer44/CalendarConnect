import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  // ================= LOAD FRIENDS =================
  const loadFriends = async () => {
    try {
      const res = await fetch(
        `/api/friends/${user.id}`
      );

      if (!res.ok) throw new Error("Failed friends");

      const data = await res.json();
      setFriends(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setFriends([]);
    }
  };

  // ================= LOAD REQUESTS =================
  const loadRequests = async () => {
    try {
      const res = await fetch(
        `/api/friends/requests/${user.id}`
      );

      if (!res.ok) throw new Error("Failed requests");

      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    }
  };

  // ================= SEARCH USERS =================
  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      const res = await fetch(
        `/api/user/search?query=${search}&currentUserId=${user.id}`
      );

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
  };

  // ================= SEND FRIEND REQUEST =================
  const addFriend = async (toId) => {
    try {
      const res = await fetch(
        `/api/friends/add?from=${user.id}&to=${toId}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Request failed");

      alert("Friend request sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  // ================= ACCEPT REQUEST =================
  const acceptFriend = async (fromId) => {
    try {
      const res = await fetch(
        `/api/friends/accept?from=${fromId}&to=${user.id}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Accept failed");

      alert("Friend request accepted!");

      loadFriends();
      loadRequests();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= INIT LOAD =================
  useEffect(() => {
    if (!user?.id) return;

    loadFriends();
    loadRequests();
    setLoading(false);
  }, [user]);

  if (!user) return <p>Please log in</p>;

  return (
    <div className="friends-container">

      {/* HEADER */}
      <div className="friends-header">
        <h2>Friends</h2>

        <button onClick={() => setShowSearch(!showSearch)}>
          {showSearch ? "Close" : "Find Friends"}
        </button>
      </div>

      {/* ================= FRIEND REQUESTS ================= */}
      <h3>Friend Requests</h3>

      {requests.length === 0 && <p>No requests</p>}

      {requests.map((r) => (
        <div key={r.id} className="friend-item">
          <span>{r.username}</span>

          <button onClick={() => acceptFriend(r.friendId)}>
            Accept
          </button>
        </div>
      ))}

      {/* ================= SEARCH ================= */}
      {showSearch && (
        <div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
          />

          <button onClick={handleSearch}>Search</button>

          {results.map((u) => (
            <div key={u.id} className="friend-item">
              <span>{u.username}</span>

              <button onClick={() => addFriend(u.id)}>
                Add Friend
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= FRIENDS LIST ================= */}
      <h3>Your Friends</h3>

      {loading && <p>Loading...</p>}

      {!loading && friends.length === 0 && (
        <p>No friends yet</p>
      )}

      {friends.map((f) => (
        <div key={f.friendId || f.id} className="friend-item">
          <span>{f.username}</span>
        </div>
      ))}

    </div>
  );
};

export default Friends;