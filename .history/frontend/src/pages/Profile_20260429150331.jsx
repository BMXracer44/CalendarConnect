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

        const data = await res.json();

        setFormData({
          username: data.username || "",
          email: data.email || "",
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          birthdate: data.birthdate || "",
          phoneNumber: data.phone_number || "",
          bio: data.bio || "",
          profilePictureUrl: data.profile_picture_url || ""
        });

      } catch (err) {
        console.error(err);
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

  // ================= IMAGE FIX (BASE64) =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profilePictureUrl: reader.result
      }));
    };

    reader.readAsDataURL(file);
  };

  // ================= UPDATE PROFILE =================
  const handleUpdate = async (e) => {
    e.preventDefault();

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

      if (res.ok) {
        setSuccess("Profile updated!");
      } else {
        setError("Update failed");
      }

    } catch (err) {
      setError("Server error");
    }
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div className="profile-container">

      <div className="profile-left">
        <h2>{formData.username}</h2>

        {formData.profilePictureUrl && (
          <img
            src={formData.profilePictureUrl}
            alt="profile"
            style={{ width: "120px", borderRadius: "50%" }}
          />
        )}
      </div>

      <div className="profile-right">
        <h3>Update Profile</h3>

        <form onSubmit={handleUpdate}>

          <input name="username" value={formData.username} onChange={handleChange} />
          <input name="email" value={formData.email} onChange={handleChange} />
          <input name="firstName" value={formData.firstName} onChange={handleChange} />
          <input name="lastName" value={formData.lastName} onChange={handleChange} />

          <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />

          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          <input name="bio" value={formData.bio} onChange={handleChange} />

          <input type="file" accept="image/*" onChange={handleFileChange} />

          <button type="submit">Update</button>

        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </div>

    </div>
  );
};

export default Profile;