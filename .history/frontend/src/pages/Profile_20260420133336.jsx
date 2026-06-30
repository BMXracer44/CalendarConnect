import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  console.log("AUTH USER:", user);

  const safeUser = user?.user || user; // 🔥 handles both structures

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

  useEffect(() => {
    if (safeUser) {
      setFormData({
        username: safeUser.username || "",
        email: safeUser.email || "",
        first_name: safeUser.first_name || "",
        last_name: safeUser.last_name || "",
        birthdate: safeUser.birthdate || "",
        phone_number: safeUser.phone_number || "",
        bio: safeUser.bio || "",
        profile_picture: null
      });
    }
  }, [safeUser]);

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
        `/api/user/update/${safeUser.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${safeUser.token}`
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

  if (!safeUser) {
    return <p>Please log in to view profile.</p>;
  }

  const profileImage =
    formData.profile_picture
      ? URL.createObjectURL(formData.profile_picture)
      : safeUser.profile_picture_url || safeUser.profile_picture || null;

  return (
    <div className="login-container">
      <div className="login-card register-card">

        <h2>Your Profile</h2>

        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "10px"
            }}
          />
        )}

        <div className="profile-preview">
          <p><strong>Username:</strong> {formData.username}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Name:</strong> {formData.first_name} {formData.last_name}</p>
          <p><strong>Birthdate:</strong> {formData.birthdate}</p>
          <p><strong>Phone:</strong> {formData.phone_number}</p>
          <p><strong>Bio:</strong> {formData.bio}</p>
        </div>

        <hr />

        <h3>Update Information</h3>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <form onSubmit={handleUpdate} className="register-form">

          <input name="username" value={formData.username} onChange={handleChange} />
          <input name="email" value={formData.email} onChange={handleChange} />
          <input name="first_name" value={formData.first_name} onChange={handleChange} />
          <input name="last_name" value={formData.last_name} onChange={handleChange} />
          <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
          <input name="phone_number" value={formData.phone_number} onChange={handleChange} />
          <input name="bio" value={formData.bio} onChange={handleChange} />

          <input type="file" accept="image/*" onChange={handleFileChange} />

          <button type="submit">Update Profile</button>
        </form>

      </div>
    </div>
  );
};

export default Profile;