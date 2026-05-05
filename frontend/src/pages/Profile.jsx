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

  // NEW: State to hold the physical file before uploading
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // The universal blank grey profile avatar
  const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  // LOAD PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.username) return;
      try {
        const res = await fetch(`http://localhost:8080/api/user/${user.username}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        if (!res.ok) return;

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
      } catch (err) { console.error("Error loading profile:", err); }
    };

    fetchProfile();
  }, [user]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= HANDLE IMAGE =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Save the physical file in state to upload when they click "Update"
    setSelectedFile(file);

    // Show a temporary preview to the user using the blob (but we won't save this to the DB!)
    setFormData((prev) => ({
      ...prev,
      profilePictureUrl: URL.createObjectURL(file)
    }));
  };

  //  UPDATE PROFILE
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Map frontend state back to backend fields
    try {
      const res = await fetch(
        `http://localhost:8080/api/user/update/${user.username}`,
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
        // Clear the selected file so they don't upload it twice
        setSelectedFile(null);
      } else {
        const data = await res.json();
        setError(data.message || "Update failed");
      }

    } catch (err) {
      setError("Server error: " + err.message);
    }
  };

  if (!user) return <p>Please log in to view profile.</p>;
  // Render profile 
  return (
    <div className="profile-container">
      <div className="profile-card">

        {/* ================= LEFT SIDE ================= */}
        <div className="profile-left">
          <h2>{formData.username}</h2>

          <div style={{ marginBottom: "20px" }}>
            {/* The image will cleanly fallback to the grey avatar if the URL is empty or broken */}
            <img
              src={formData.profilePictureUrl || DEFAULT_AVATAR}
              onError={(e) => { e.target.src = DEFAULT_AVATAR; }} // Safety net if the image fails to load
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}
            />
          )}

            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>First Name:</strong> {formData.firstName}</p>
            <p><strong>Last Name:</strong> {formData.lastName}</p>
            <p><strong>Birthdate:</strong> {formData.birthdate}</p>
            <p><strong>Phone:</strong> {formData.phoneNumber}</p>
            <p><strong>Bio:</strong> {formData.bio}</p>
          </div>

          {/* RIGHT SIDE */}
          <div className="profile-right">
            <h3>Update Profile</h3>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <form onSubmit={handleUpdate}>
              <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
              <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
              <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
              <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
              <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
              <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
              <input name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} />

              {/* Back to a file input! */}
              <input type="file" accept="image/*" onChange={handleFileChange} />

              <button type="submit">Update Profile</button>
            </form>
          </div>

        </div>
      </div>
      );
};

      export default Profile;
