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

  // Load user into form
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        birthdate: user.birthdate || "",
        phone_number: user.phone_number || "",
        bio: user.bio || "",
        profile_picture: null
      });
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

      form.append("username", formData.username);
      form.append("email", formData.email);
      form.append("first_name", formData.first_name);
      form.append("last_name", formData.last_name);
      form.append("birthdate", formData.birthdate);
      form.append("phone_number", formData.phone_number);
      form.append("bio", formData.bio);

      if (formData.profile_picture) {
        form.append("profile_picture", formData.profile_picture);
      }

      const response = await fetch(
        `http://localhost:8080/api/user/update/${user.id}`,
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
    return (
      <div className="login-container">
        <div className="login-card">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card register-card">

        {/* ================= TOP: CURRENT INFO ================= */}
        <h2>Your Profile</h2>

        <div className="profile-preview">
          {formData.profile_picture && (
            <img
              src={URL.createObjectURL(formData.profile_picture)}
              alt="Profile Preview"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                marginBottom: "10px"
              }}
            />
          )}

          <p><strong>Username:</strong> {formData.username}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Name:</strong> {formData.first_name} {formData.last_name}</p>
          <p><strong>Birthdate:</strong> {formData.birthdate}</p>
          <p><strong>Phone:</strong> {formData.phone_number}</p>
          <p><strong>Bio:</strong> {formData.bio}</p>
        </div>

        <hr />

        {/* ================= BOTTOM: UPDATE FORM ================= */}
        <h3>Update Information</h3>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <form onSubmit={handleUpdate} className="register-form">

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
            value={formData.birthdate}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
          />

          <input
            type="text"
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
          />

          {/* ================= FILE UPLOAD ================= */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* Preview uploaded image */}
          {formData.profile_picture && (
            <img
              src={URL.createObjectURL(formData.profile_picture)}
              alt="Preview"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                marginTop: "10px"
              }}
            />
          )}

          <button type="submit">Update Profile</button>
        </form>

      </div>
    </div>
  );
};

export default Profile;