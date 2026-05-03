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

  // ================= ADD FRIEND =================
  const addFriend = (toId) => {
    fetch(
      `http://localhost:8080/api/friends/add?from=${user.id}&to=${toId}`,
      { method: "POST" }
    )
      .then(() => {
        searchUsers(); // refresh search results
        loadRequests();
      })
      .catch(() => console.log("Add friend error"));
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

  // ================= REMOVE FRIEND =================
  const removeFriend = (friendId) => {
    fetch(
      `http://localhost:8080/api/friends/remove?userId=${user.id}&friendId=${friendId}`,
      { method: "PUT" }
    )
      .then(() => loadFriends())
      .catch(() => console.log("Remove failed"));
  };

  // ================= CHECK STATUS =================
  const isFriend = (id) =>
    friends.some((f) => f.friendId === id || f.id === id);

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

          {results.map((u) => {
            const alreadyFriends = isFriend(u.id);

            return (
              <div className="friend-item" key={u.id}>
                <span>{u.username}</span>

                {alreadyFriends ? (
                  <span className="friend-label">Friends</span>
                ) : (
                  <button onClick={() => addFriend(u.id)}>
                    Add
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* ================= REQUESTS ================= */}
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

        {/* ================= FRIENDS ================= */}
        <div className="friends-list">
          <h3>Your Friends</h3>

          {friends.length === 0 && <p>No friends yet</p>}

          {friends.map((f) => {
            const friendId = f.requesterId === user.id
              ? f.addresseeId
              : f.requesterId;

            return (
              <div className="friend-item" key={f.id}>
                <span>{f.username}</span>

                <button onClick={() => removeFriend(friendId)}>
                  Remove
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Friends;