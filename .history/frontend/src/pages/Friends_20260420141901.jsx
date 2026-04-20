import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Friends = () => {
  const { user } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD FRIENDS
  const loadFriends = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/friends/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      const data = await res.json();

      setFriends(data || []);
    } catch (err) {
      console.error("Error loading friends:", err);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadFriends();
    }
  }, [user]);

  if (!user) {
    return <p>Please log in</p>;
  }

  return (
    <div className="friends-container">
      <div className="friends-card">

        <h2>Your Friends</h2>

        {/* LOADING STATE */}
        {loading && <p>Loading friends...</p>}

        {/* EMPTY STATE */}
        {!loading && friends.length === 0 && (
          <p className="no-results">
            You don’t have any friends yet.
          </p>
        )}

        {/* FRIEND LIST */}
        <div className="friends-results">
          {friends.map((f) => (
            <div key={f.id} className="friend-item">
              <span>{f.username}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Friends;