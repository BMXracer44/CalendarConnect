import React, { useContext, useState, useEffect } from "react";
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
    profile_picture: null
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔥 ONLY USE CONTEXT DATA (no backend profile call)
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username || ""
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_picture: e.target.files[0]
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "profile_picture") {
          form.append(key, formData[key]);
        }
      });

      if (formData.profile_picture) {
        form.append("profile_picture", formData.profile_picture);
      }

      const response = await fetch(
        `/api/user/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`
          },
          body: form
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setError("");
      } else {
        setError(data.message || "Update failed");
        setSuccess("");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  if (!user) {
    return <p>Please log in to view profile.</p>;
  }

  return (
    <div className="login-container">
      <div className="login-card register-card">

        <h2>Your Profile</h2>

        <div className="profile-preview">
          <p><strong>Username:</strong> {user.username}</p>
        </div>

        <hr />

        <h3>Update Information</h3>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

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

          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />

          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />

          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
          />

          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />

          <input
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />

          <input type="file" onChange={handleFileChange} />

          <button type="submit">Update Profile</button>
        </form>

      </div>
    </div>
  );
};

export default Profile;