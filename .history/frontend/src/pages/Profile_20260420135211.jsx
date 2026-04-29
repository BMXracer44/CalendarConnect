import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || ""
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return <p>Please log in to view profile.</p>;
  }

  // 🔥 handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 update request
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:8080/api/user/update/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess("Profile updated successfully!");
        setError("");

        // 🔥 update context so UI refreshes instantly
        setUser({
          ...user,
          username: formData.username,
          email: formData.email
        });

        localStorage.setItem("username", formData.username);
      } else {
        setError(data.message || "Update failed");
        setSuccess("");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card register-card">

        <h2>Your Profile</h2>

        {/* DISPLAY */}
        <p><strong>ID:</strong> {user.id}</p>

        {/* EDIT FORM */}
        <form onSubmit={handleUpdate} className="register-form">

          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <button type="submit">Update Profile</button>
        </form>

        {/* MESSAGES */}
        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

      </div>
    </div>
  );
};

export default Profile;