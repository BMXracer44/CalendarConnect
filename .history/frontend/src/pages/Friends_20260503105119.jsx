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

  // ================= ADD FRIEND =================
  const addFriend = (toId) => {
    fetch(
      `/api/friends/add?from=${user.id}&to=${toId}`,
      { method: "POST" }
    )
      .then(() => {
        searchUsers();
        loadRequests();
      })
      .catch(() => console.log("Add friend error"));
  };

  // ================= ACCEPT =================
  const acceptFriend = (fromId) => {
    fetch(
      `/api/friends/accept?from=${fromId}&to=${user.id}`,
      { method: "POST" }
    )
      .then(() => {
        loadFriends();
        loadRequests();
      });
  };

  // ================= REMOVE FRIEND =================
  const removeFriend = (friendId) => {
    fetch(
      `/api/friends/remove?userId=${user.id}&friendId=${friendId}`,
      { method: "PUT" }
    )
      .then(() => loadFriends());
  };

  // ================= CHECK FRIEND STATUS =================
  const isFriend = (id) =>
    friends.some((f) =>
      f.requesterId === id || f.addresseeId === id
    );

  return (
    <div>
      {/* SEARCH */}
      <div>
        <h2>Find Friends</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={searchUsers}>Search</button>

        {results.map((u) => {
          const alreadyFriends = isFriend(u.id);

          return (
            <div key={u.id}>
              <span>{u.username}</span>

              {alreadyFriends ? (
                <span>Friends</span>
              ) : (
                <button onClick={() => addFriend(u.id)}>
                  Add
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* REQUESTS */}
      <div>
        <h3>Requests</h3>

        {requests.map((r) => (
          <div key={r.id}>
            <span>{r.username}</span>
            <button onClick={() => acceptFriend(r.requesterId)}>
              Accept
            </button>
          </div>
        ))}
      </div>

      {/* FRIENDS */}
      <div>
        <h3>Friends</h3>

        {friends.map((f) => {
          const friendId =
            f.requesterId === user.id
              ? f.addresseeId
              : f.requesterId;

          return (
            <div key={f.id}>
              <span>{f.username}</span>

              <button onClick={() => removeFriend(friendId)}>
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Friends;