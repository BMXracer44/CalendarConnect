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
          `/api/user/${user.username}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        if (!res.ok) {
          console.error("Profile fetch failed:", res.status);
          return;
        }

        const data = await res.json();

        console.log("PROFILE DATA:", data);

        setFormData({
          username: data.username || "",
          email: data.email || "",
          firstName: data.first_name || data.firstName || "",
          lastName: data.last_name || data.lastName || "",
          birthdate: data.birthdate || "",
          phoneNumber: data.phone_number || data.phoneNumber || "",
          bio: data.bio || "",
          profilePictureUrl: data.profile_picture_url || data.profilePictureUrl || ""
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

    setFormData((prev) => ({
      ...prev,
      profilePictureUrl: imageUrl
    }));
  };

  // ================= UPDATE PROFILE =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `/api/user/update/${user.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            birthdate: formData.birthdate,
            phone_number: formData.phoneNumber,
            bio: formData.bio,
            profile_picture_url: formData.profilePictureUrl
          })
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
            />

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />

            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
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
            />

            <input
              name="bio"
              value={formData.bio}
              onChange={handleChange}
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