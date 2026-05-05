import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    birthdate: "",
    phone_number: "",
    bio: "", //Bio box does not have same format
    profile_picture_url: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Default avatar for the preview
  const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  // Handles standard text inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ==========================================
  // BLOB LOGIC FOR FILE INPUT
  // ==========================================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create the temporary Blob URL
    const imageUrl = URL.createObjectURL(file);

    // Save the blob URL directly into our form data
    setFormData((prev) => ({
      ...prev,
      profile_picture_url: imageUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) { //There is no input box to enter in a second password for confirmation
      setError("Passwords do not match");
      setSuccess("");
      return;
    }
    // Prepare payload
    try {
      // Remove confirmPassword, keep everything else (including the blob URL)
      const { confirmPassword, ...payload } = formData;
      // Map frontend fields to backend expected fields
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload) // Sends the blob link to the database
      });

      const data = await response.json();
      // Debug response
      if (response.ok) {
        setSuccess("Account created successfully!");
        setError("");
        // redirect to login after short delay
        setTimeout(() => {
          navigate("/");
        }, 1000);

        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          first_name: "",
          last_name: "",
          birthdate: "",
          phone_number: "",
          bio: "",
          profile_picture_url: ""
        });
        // Failed registration
      } else {
        setError(data.message || "Registration failed");
        setSuccess("");
      }
      // Network/server error - front/back not communicating
    } catch (err) {
      setError("Server not reachable");
      setSuccess("");
    }
  };
  // input change
  return (
    <div className="login-container">
      <div className="login-card register-card">

        <h2>Create Account</h2>
        <p>Register to get started</p>

        {error && <p className="error-text" style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
        {success && <p className="success-text" style={{ color: "green", fontWeight: "bold" }}>{success}</p>}

        <form onSubmit={handleSubmit} className="register-form">

          {/* Optional Preview Image */}
          <div style={{ marginBottom: "15px" }}>
            <img
              src={formData.profile_picture_url || DEFAULT_AVATAR}
              alt="Preview"
              style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: "3px solid #667eea" }}
            />
          </div>

          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
          <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
          <input type="text" name="phone_number" placeholder="Phone Number (optional)" value={formData.phone_number} onChange={handleChange} />
          <input type="text" name="bio" placeholder="Short bio (optional)" value={formData.bio} onChange={handleChange} />
          
          {/* THE FIX: We use handleFileChange here!
              Notice we do NOT include name="profile_picture_url" or value={...} 
              so it doesn't accidentally grab the C:\fakepath\ string. 
          */}
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ padding: "10px", marginTop: "10px" }} />

          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />

          <button type="submit">Create Account</button>
        </form>

        <div className="bottom-text" style={{ marginTop: "15px" }}>
          Already have an account? <a href="/">Login</a>
        </div>

      </div>
    </div>
  );
};

export default Register;