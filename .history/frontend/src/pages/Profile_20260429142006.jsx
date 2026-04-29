import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    birthdate: "",
    phoneNumber: "",
    bio: "",
    profilePictureUrl: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================= LOAD PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.username) return;

      try {
        const res = await fetch(
          `http://localhost:8080/api/user/${user.username}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        setFormData({
          username: data.username || "",
          email: data.email || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          birthdate: data.birthdate || "",
          phoneNumber: data.phoneNumber || "",
          bio: data.bio || "",
          profilePictureUrl: data.profilePictureUrl || ""
        });
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchProfile();
  }, [user]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================= HANDLE IMAGE =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setFormData({
      ...formData,
      profilePictureUrl: imageUrl
    });
  };

  // ================= UPDATE PROFILE =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `http://localhost:8080/api/user/update/${user.username}`,
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
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  if (!user) return <p>Please log in to view profile.</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">

        {/* ================= LEFT SIDE ================= */}
        <div className="profile-left">
          <h2>{formData.username}</h2>

          {formData.profilePictureUrl && (
            <img
              src={formData.profilePictureUrl}
              alt="Profile"
              style={{ width: "120px", borderRadius: "50%" }}
            />
          )}

          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>First Name:</strong> {formData.firstName}</p>
          <p><strong>Last Name:</strong> {formData.lastName}</p>
          <p><strong>Birthdate:</strong> {formData.birthdate}</p>
          <p><strong>Phone:</strong> {formData.phoneNumber}</p>
          <p><strong>Bio:</strong> {formData.bio}</p>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="profile-right">
          <h3>Update Profile</h3>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <form onSubmit={handleUpdate}>

            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
            />

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />

            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />

            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />

            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
            />

            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
            />

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <button type="submit">Update Profile</button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;