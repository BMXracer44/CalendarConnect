import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  // ================= LOAD FRIENDS =================
  const loadFriends = () => {
    fetch(`http://localhost:8080/api/friends/${user.id}`)
      .then((res) => res.json())
      .then((data) => setFriends(data))
      .catch(() => console.log("Failed to load friends"));
  };

  // ================= LOAD REQUESTS =================
  const loadRequests = () => {
    fetch(`http://localhost:8080/api/friends/requests/${user.id}`)
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch(() => console.log("Failed to load requests"));
  };

  useEffect(() => {
    if (user?.id) {
      loadFriends();
      loadRequests();
    }
  }, [user]);

  // ================= SEARCH USERS =================
  const searchUsers = () => {
    fetch(
      `http://localhost:8080/api/user/search?query=${search}&currentUserId=${user.id}`
    )
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch(() => console.log("Search failed"));
  };

  // ================= SEND REQUEST =================
  const addFriend = (toId) => {
    fetch(
      `http://localhost:8080/api/friends/add?from=${user.id}&to=${toId}`,
      { method: "POST" }
    )
      .then(() => alert("Friend request sent"))
      .catch((err) => console.log("Add friend error:", err));
  };

  // ================= ACCEPT REQUEST =================
  const acceptFriend = (fromId) => {
    fetch(
      `http://localhost:8080/api/friends/accept?from=${fromId}&to=${user.id}`,
      { method: "POST" }
    )
      .then(() => {
        loadFriends();
        loadRequests();
      })
      .catch(() => console.log("Accept failed"));
  };

  return (
    <div className="friends-container">
      <div className="friends-card">

        {/* ================= SEARCH (TOP) ================= */}
        <div className="search-dropdown">
          <h2>Find Friends</h2>

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={searchUsers}>Search</button>

          {results.map((u) => (
            <div className="friend-item" key={u.id}>
              <span>{u.username}</span>
              <button onClick={() => addFriend(u.id)}>Add</button>
            </div>
          ))}
        </div>

        {/* ================= FRIEND REQUESTS ================= */}
        <div className="friends-requests">
          <h3>Friend Requests</h3>

          {requests.length === 0 && <p>No new requests</p>}

          {requests.map((r) => (
            <div className="friend-item" key={r.id}>
              <span>{r.username}</span>
              <button onClick={() => acceptFriend(r.id)}>
                Accept
              </button>
            </div>
          ))}
        </div>

        {/* ================= FRIENDS LIST ================= */}
        <div className="friends-list">
          <h3>Your Friends</h3>

          {friends.length === 0 && <p>No friends yet</p>}

          {friends.map((f) => (
            <div className="friend-item" key={f.id}>
              <span>{f.username}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Friends;