import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // ✅ SAFE USER ID (FIXES YOUR BUG)
  const userId = user?.id ?? user?.userId ?? null;

  // ================= LOAD FRIENDS =================
  const loadFriends = async () => {
    if (!userId) return;

    const res = await fetch(`http://localhost:8080/api/friends/${userId}`);
    const data = await res.json();
    setFriends(data);
  };

  // ================= LOAD REQUESTS =================
  const loadRequests = async () => {
    if (!userId) return;

    const res = await fetch(
      `http://localhost:8080/api/friends/requests/${userId}`
    );
    const data = await res.json();
    setRequests(data);
  };

  // ✅ ONLY RUN WHEN USER IS READY
  useEffect(() => {
    if (userId) {
      loadFriends();
      loadRequests();
    }
  }, [userId]);

  // ================= ADD FRIEND =================
  const addFriend = async (friendId) => {
    if (!userId || !friendId) return;

    await fetch(
      `http://localhost:8080/api/friends/add?from=${userId}&to=${friendId}`,
      { method: "POST" }
    );

    alert("Friend request sent");
  };

  // ================= ACCEPT FRIEND =================
  const acceptFriend = async (friendId) => {
    if (!userId || !friendId) {
      console.error("Missing IDs", { userId, friendId });
      return;
    }

    await fetch(
      `http://localhost:8080/api/friends/accept?from=${friendId}&to=${userId}`,
      { method: "POST" }
    );

    loadFriends();
    loadRequests();
  };

  // ================= REMOVE FRIEND =================
  const removeFriend = async (friendId) => {
    if (!userId || !friendId) return;

    await fetch(
      `http://localhost:8080/api/friends/remove?userId=${userId}&friendId=${friendId}`,
      { method: "DELETE" }
    );

    loadFriends();
  };

  // ================= SEARCH USERS =================
  const searchUsers = async (query) => {
    if (!query || !userId) return;

    const res = await fetch(
      `http://localhost:8080/api/users/search?query=${query}&currentUserId=${userId}`
    );
    const data = await res.json();
    setSearchResults(data);
  };

  return (
    <div>
      <h2>Friends</h2>

      {/* ================= FRIEND LIST ================= */}
      <h3>Your Friends</h3>
      {friends.map((f) => (
        <div key={f.userId}>
          <span>{f.username}</span>

          <button onClick={() => removeFriend(f.userId)}>
            Remove
          </button>
        </div>
      ))}

      {/* ================= FRIEND REQUESTS ================= */}
      <h3>Friend Requests</h3>
      {requests.map((r) => (
        <div key={r.userId}>
          <span>{r.username}</span>

          <button onClick={() => acceptFriend(r.userId)}>
            Accept
          </button>
        </div>
      ))}

      {/* ================= SEARCH USERS ================= */}
      <h3>Search Users</h3>

      <input
        placeholder="Search users..."
        onChange={(e) => searchUsers(e.target.value)}
      />

      {searchResults.map((u) => (
        <div key={u.id}>
          <span>{u.username}</span>

          <button onClick={() => addFriend(u.id)}>
            Add Friend
          </button>
        </div>
      ))}
    </div>
  );
};

export default Friends;