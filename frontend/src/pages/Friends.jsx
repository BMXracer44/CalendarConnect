import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

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
      loadSentRequests(); // only new line
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

  // ================= SEND REQUEST =================
  const addFriend = (toId) => {
    fetch(
      `/api/friends/add?from=${user.id}&to=${toId}`,
      { method: "POST" }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server rejected the friend request.");
        }
        alert("Friend request sent!");
      })
      .catch((err) => {
        console.error("Add friend error:", err);
        alert("Failed to send request. They might already be your friend!");
      });
  };

  // ================= ACCEPT REQUEST =================
  const acceptFriend = (fromId) => {
    fetch(
      `/api/friends/accept?from=${fromId}&to=${user.id}`,
      { method: "POST" }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server rejected the accept request.");
        }
        loadFriends();
        loadRequests();
      })
      .catch((err) => {
        console.error("Accept failed:", err);
        alert("Failed to accept request. Please try again.");
      });
  };
  const loadSentRequests = () => {
  fetch(`/api/friends/requests/sent/${user.id}`)
    .then((res) => res.json())
    .then((data) => {
      setSentRequests(Array.isArray(data) ? data : []);
    })
    .catch(() => {
      console.log("Failed to load sent requests");
      setSentRequests([]);
    });
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

        {/* ================= SENT REQUESTS ================= */}
        <div className="friends-sent-requests">
          <h3>Sent Requests</h3>

          {sentRequests.length === 0 && <p>No sent requests</p>}

          {sentRequests.map((r) => (
            <div className="friend-item" key={r.id}>
              <span>{r.username}</span>
              <button disabled>Pending</button>
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