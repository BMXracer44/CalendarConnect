import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // ================= LOAD FRIENDS =================
  const loadFriends = async () => {
    const res = await fetch(`/api/friends/${user.id}`);
    const data = await res.json();
    setFriends(Array.isArray(data) ? data : []);
  };

  // ================= LOAD REQUESTS =================
  const loadRequests = async () => {
    const res = await fetch(`/api/friends/requests/${user.id}`);
    const data = await res.json();
    setRequests(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (user?.id) {
      loadFriends();
      loadRequests();
    }
  }, [user]);

  // ================= SEARCH =================
  const searchUsers = async () => {
    const res = await fetch(
      `/api/user/search?query=${search}&currentUserId=${user.id}`
    );
    const data = await res.json();
    setResults(Array.isArray(data) ? data : []);
  };

  // ================= ADD FRIEND =================
  const addFriend = async (id) => {
    await fetch(
      `/api/friends/add?from=${user.id}&to=${id}`,
      { method: "POST" }
    );
    searchUsers();
  };

  // ================= ACCEPT =================
  const accept = async (id) => {
    await fetch(
      `/api/friends/accept?from=${id}&to=${user.id}`,
      { method: "POST" }
    );

    loadRequests();
    loadFriends();
  };

  // ================= DECLINE =================
  const decline = async (id) => {
    await fetch(
      `/api/friends/decline?from=${id}&to=${user.id}`,
      { method: "POST" }
    );

    loadRequests();
  };

  return (
    <div>

      <h2>Friend Requests</h2>

      {requests.map((r) => (
        <div key={r.id}>
          {r.username}
          <button onClick={() => accept(r.id)}>Accept</button>
          <button onClick={() => decline(r.id)}>Decline</button>
        </div>
      ))}

      <h2>Friends</h2>
      {friends.map((f) => (
        <div key={f.id}>{f.username}</div>
      ))}

      <h2>Search</h2>

      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <button onClick={searchUsers}>Search</button>

      {results.map((u) => (
        <div key={u.id}>
          {u.username}
          <button onClick={() => addFriend(u.id)}>Add</button>
        </div>
      ))}

    </div>
  );
};

export default Friends;