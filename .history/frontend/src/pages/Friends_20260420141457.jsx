import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  // ================= SEARCH =================
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!search.trim()) return;

    const res = await fetch(
      `/api/users/search?query=${search}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    const data = await res.json();
    setResults(data);
  };

  const addFriend = async (friendId) => {
    await fetch("/api/friends/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        userId: user.id,
        friendId
      })
    });

    alert("Friend request sent!");
  };

  // ================= FRIENDS =================
  const [friends, setFriends] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");

  const loadFriends = async () => {
    const res = await fetch(
      `/api/friends/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    const data = await res.json();
    setFriends(data);
  };

  useEffect(() => {
    if (user?.id) {
      loadFriends();
    }
  }, [user]);

  const inviteFriend = async (friendId) => {
    await fetch("/api/events/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        eventId: selectedEventId,
        userId: friendId
      })
    });

    alert("Friend invited to event!");
  };

  if (!user) {
    return <p>Please log in</p>;
  }

  return (
    <div className="friends-container">
      <div className="friends-card">

        {/* ================= SEARCH SECTION ================= */}
        <h2>Find Friends</h2>

        <div className="friends-search">
          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="friends-results">
          {results.map((u) => (
            <div key={u.id} className="friend-item">
              <span>{u.username}</span>

              <button onClick={() => addFriend(u.id)}>
                Add Friend
              </button>
            </div>
          ))}
        </div>

        {/* ================= FRIEND LIST SECTION ================= */}
        <hr style={{ margin: "30px 0" }} />

        <h2>Your Friends</h2>

        {/* EVENT ID INPUT */}
        <input
          placeholder="Enter Event ID to invite friends"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          style={{ marginBottom: "15px" }}
        />

        {friends.map((f) => (
          <div key={f.id} className="friend-item">

            <span>{f.username}</span>

            <button
              onClick={() => inviteFriend(f.id)}
              disabled={!selectedEventId}
            >
              Invite to Event
            </button>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Friends;