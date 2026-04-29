import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    birthdate: "",
    phone_number: "",
    bio: "",
    profile_picture_url: "",
    profile_picture_file: null
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
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          birthdate: data.birthdate || "",
          phone_number: data.phone_number || "",
          bio: data.bio || "",
          profile_picture_url: data.profile_picture_url || "",
          password: "",
          confirmPassword: "",
          profile_picture_file: null
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

  // ================= HANDLE UPDATE =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      formData.password &&
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("birthdate", formData.birthdate);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("password", formData.password);

      if (formData.profile_picture_file) {
        formDataToSend.append(
          "file",
          formData.profile_picture_file
        );
      }

      const res = await fetch(
        `http://localhost:8080/api/user/update/${user.username}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`
          },
          body: formDataToSend
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

  if (!user) {
    return <p>Please log in to view profile.</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">

        {/* ================= LEFT SIDE ================= */}
        <div className="profile-left">

          <div className="profile-image">
            <img
              src={
                formData.profile_picture_url ||
                "https://via.placeholder.com/150"
              }
              alt="Profile"
            />
          </div>

          <h2>{formData.username}</h2>

          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>First Name:</strong> {formData.first_name}</p>
          <p><strong>Last Name:</strong> {formData.last_name}</p>
          <p><strong>Birthdate:</strong> {formData.birthdate}</p>
          <p><strong>Phone:</strong> {formData.phone_number}</p>
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
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password"
            />

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
            />

            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
            />

            <input
              name="last_name"
              value={formData.last_name}
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
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Phone Number"
            />

            <input
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio"
            />

            {/* FILE UPLOAD FIXED */}
            <input
              type="file"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profile_picture_file: e.target.files[0]
                })
              }
            />

            <button type="submit">Update Profile</button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Profile;