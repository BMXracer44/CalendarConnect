import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Please log in to view profile.</p>;
  }

  return (
    <div className="login-container">
      <div className="login-card register-card">

        <h2>Your Profile</h2>

        <div className="profile-preview">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>

      </div>
    </div>
  );
};

export default Profile;