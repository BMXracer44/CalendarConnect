import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    birthdate: "",
    phone_number: "",
    bio: "",
    profile_picture_url: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🔥 LOAD USER DATA
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setFormData(data);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Server not reachable");
      }
    };

    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  // 🔥 HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 UPDATE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setError("");
      } else {
        setError(data.message || "Update failed");
        setMessage("");
      }
    } catch (err) {
      setError("Server not reachable");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card register-card">

        <h2>Your Profile</h2>
        <p>View and update your information</p>

        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}

        <form onSubmit={handleSubmit} className="register-form">

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />

          <input
            type="date"
            name="birthdate"
            value={formData.birthdate || ""}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number || ""}
            onChange={handleChange}
          />

          <input
            type="text"
            name="bio"
            placeholder="Bio"
            value={formData.bio || ""}
            onChange={handleChange}
          />

          <input
            type="text"
            name="profile_picture_url"
            placeholder="Profile Picture URL"
            value={formData.profile_picture_url || ""}
            onChange={handleChange}
          />

          {/* Preview */}
          {formData.profile_picture_url && (
            <img
              src={formData.profile_picture_url}
              alt="Profile"
              style={{ width: "80px", height: "80px", borderRadius: "50%" }}
            />
          )}

          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;