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
      .then(setFriends);
  };

  // ================= LOAD REQUESTS =================
  const loadRequests = () => {
    fetch(`http://localhost:8080/api/friends/requests/${user.id}`)
      .then((res) => res.json())
      .then(setRequests);
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
      .then(setResults);
  };

  // ================= ADD FRIEND =================
  const addFriend = (toId) => {
    if (!toId) return;

    fetch(
      `http://localhost:8080/api/friends/add?from=${user.id}&to=${toId}`,
      { method: "POST" }
    ).then(loadFriends);
  };

  // ================= REMOVE FRIEND =================
  const removeFriend = (friendId) => {
    fetch(
      `http://localhost:8080/api/friends/remove?userId=${user.id}&friendId=${friendId}`,
      { method: "DELETE" }
    ).then(loadFriends);
  };

  // ================= ACCEPT REQUEST =================
  const acceptFriend = (fromId) => {
    fetch(
      `http://localhost:8080/api/friends/accept?from=${fromId}&to=${user.id}`,
      { method: "POST" }
    ).then(() => {
      loadFriends();
      loadRequests();
    });
  };

  return (
    <div className="friends-container">

      {/* SEARCH */}
      <div>
        <h2>Find Friends</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={searchUsers}>Search</button>

        {results.map((u) => (
          <div key={u.id}>
            <span>{u.username}</span>
            <button onClick={() => addFriend(u.id)}>Add</button>
          </div>
        ))}
      </div>

      {/* REQUESTS */}
      <div>
        <h3>Requests</h3>

        {requests.map((r) => (
          <div key={r.id}>
            <span>{r.username}</span>
            <button onClick={() => acceptFriend(r.friendId)}>
              Accept
            </button>
          </div>
        ))}
      </div>

      {/* FRIENDS */}
      <div>
        <h3>Friends</h3>

        {friends.map((f) => (
          <div key={f.id}>
            <span>{f.username}</span>

            <button onClick={() => removeFriend(f.friendId)}>
              Remove
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Friends;