import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const userId = user?.id || user?.userId;

  // ================= LOAD FRIENDS =================
  const loadFriends = async () => {
    if (!userId) return;

    const res = await fetch(`/api/friends/${userId}`);
    const data = await res.json();
    setFriends(data);
  };

  // ================= LOAD REQUESTS =================
  const loadRequests = async () => {
    if (!userId) return;

    const res = await fetch(
      `/api/friends/requests/${userId}`
    );
    const data = await res.json();
    setRequests(data);
  };

  useEffect(() => {
    loadFriends();
    loadRequests();
  }, [userId]);

  // ================= ADD FRIEND =================
  const addFriend = async (friendId) => {
    if (!userId) return;

    await fetch(
      `/api/friends/add?from=${userId}&to=${friendId}`,
      {
        method: "POST",
      }
    );

    alert("Friend request sent");
  };

  // ================= ACCEPT FRIEND =================
  const acceptFriend = async (friendId) => {
    if (!userId) return;

    await fetch(
      `/api/friends/accept?from=${userId}&to=${friendId}`,
      {
        method: "POST",
      }
    );

    loadFriends();
    loadRequests();
  };

  // ================= REMOVE FRIEND =================
  const removeFriend = async (friendId) => {
    if (!userId) return;

    await fetch(
      `/api/friends/remove?userId=${userId}&friendId=${friendId}`,
      {
        method: "DELETE",
      }
    );

    loadFriends();
  };

  // ================= SEARCH FRIENDS (example) =================
  const searchUsers = async (query) => {
    if (!query) return;

    const res = await fetch(
      `/api/users/search?query=${query}`
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
        <div key={f.id}>
          <span>{f.username}</span>

          <button onClick={() => removeFriend(f.requesterId)}>
            Remove
          </button>
        </div>
      ))}

      {/* ================= FRIEND REQUESTS ================= */}
      <h3>Friend Requests</h3>
      {requests.map((r) => (
        <div key={r.id}>
          <span>{r.username}</span>

          <button onClick={() => acceptFriend(r.requesterId)}>
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