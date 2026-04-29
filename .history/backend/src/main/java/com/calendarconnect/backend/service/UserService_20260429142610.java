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
    profile_picture_url: ""
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

        if (!res.ok) {
          console.error("Profile not found");
          return;
        }

        const data = await res.json();

        setFormData({
          username: data.username || "",
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          birthdate: data.birthdate || "",
          phone_number: data.phone_number || "",
          bio: data.bio || "",
          profile_picture_url: data.profile_picture_url || ""
        });

      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [user]);

  // ================= INPUT HANDLER =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================= FILE HANDLER =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({
      ...formData,
      profile_picture_url: URL.createObjectURL(file)
    });
  };

  // ================= UPDATE PROFILE =================
  const handleUpdate = async (e) => {
    e.preventDefault();

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

      if (res.ok) {
        setSuccess("Profile updated!");
      } else {
        setError("Update failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  if (!user) return <p>Please log in.</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">

        {/* ================= LEFT SIDE ================= */}
        <div className="profile-left">
          <h2>{formData.username}</h2>

          {formData.profile_picture_url && (
            <img
              src={formData.profile_picture_url}
              alt="profile"
              style={{ width: 120, borderRadius: "50%" }}
            />
          )}

          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>First Name:</strong> {formData.first_name}</p>
          <p><strong>Last Name:</strong> {formData.last_name}</p>
          <p><strong>Birthdate:</strong> {formData.birthdate}</p>
          <p><strong>Phone:</strong> {formData.phone_number}</p>
          <p><strong>Bio:</strong> {formData.bio}</p>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="profile-right">

          <h3>Edit Profile</h3>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <form onSubmit={handleUpdate}>

            <input name="username" value={formData.username} onChange={handleChange} />
            <input name="email" value={formData.email} onChange={handleChange} />
            <input name="first_name" value={formData.first_name} onChange={handleChange} />
            <input name="last_name" value={formData.last_name} onChange={handleChange} />
            <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
            <input name="phone_number" value={formData.phone_number} onChange={handleChange} />
            <textarea name="bio" value={formData.bio} onChange={handleChange} />

            <input type="file" onChange={handleFileChange} />

            <button type="submit">Update</button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default Profile;