import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");

  // LOAD FRIENDS
  const loadFriends = async () => {
    const res = await fetch(
      `http://localhost:8080/api/friends/${user.id}`,
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
    loadFriends();
  }, []);

  // INVITE FRIEND TO EVENT
  const inviteFriend = async (friendId) => {
    await fetch("http://localhost:8080/api/events/invite", {
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

  return (
    <div className="friends-container">
      <div className="friends-card">

        <h2>Your Friends</h2>

        {/* EVENT SELECT */}
        <input
          placeholder="Enter Event ID to invite to"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        />

        {/* FRIEND LIST */}
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