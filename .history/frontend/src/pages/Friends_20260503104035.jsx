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
    fetch(`/api/friends/${user.id}`)
      .then((res) => res.json())
      .then((data) => setFriends(data))
      .catch(() => console.log("Failed to load friends"));
  };

  // ================= LOAD REQUESTS =================
  const loadRequests = () => {
    fetch(`/api/friends/requests/${user.id}`)
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
      `/api/user/search?query=${search}&currentUserId=${user.id}`
    )
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch(() => console.log("Search failed"));
  };

  // ================= SEND FRIEND REQUEST =================
  const addFriend = (toId) => {
    fetch(
      `/api/friends/add?from=${user.id}&to=${toId}`,
      { method: "POST" }
    )
      .then(() => {
        loadRequests();
        alert("Friend request sent");
      })
      .catch(() => console.log("Add friend error"));
  };

  // ================= ACCEPT REQUEST =================
  const acceptFriend = (fromId) => {
    fetch(
      `/api/friends/accept?from=${fromId}&to=${user.id}`,
      { method: "POST" }
    )
      .then(() => {
        loadFriends();
        loadRequests();
      })
      .catch(() => console.log("Accept failed"));
  };

  // ================= REMOVE FRIEND =================
  const removeFriend = (friendId) => {
    fetch(
      `/api/friends/remove?userId=${user.id}&friendId=${friendId}`,
      { method: "DELETE" }
    )
      .then(() => {
        loadFriends(); // refresh UI
      })
      .catch(() => console.log("Remove failed"));
  };

  // ================= HELPER: CHECK FRIEND STATUS =================
  const isFriend = (id) => {
    return friends.some((f) => f.friendId === id || f.requesterId === id);
  };

  const isRequested = (id) => {
    return requests.some((r) => r.requesterId === id);
  };

  return (
    <div className="friends-container">
      <div className="friends-card">

        {/* ================= SEARCH ================= */}
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

              {/* ================= BUTTON LOGIC ================= */}
              {isFriend(u.id) ? (
                <button disabled>Friends</button>
              ) : isRequested(u.id) ? (
                <button disabled>Requested</button>
              ) : (
                <button onClick={() => addFriend(u.id)}>Add</button>
              )}
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
              <button onClick={() => acceptFriend(r.requesterId)}>
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
            <div className="friend-item" key={f.friendId}>
              <span>{f.username}</span>

              <button onClick={() => removeFriend(f.requesterId)}>
              Remove
            </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Friends;