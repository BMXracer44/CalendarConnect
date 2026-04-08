import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", //There is no confirm password input on the register page
    first_name: "",
    last_name: "",
    birthdate: "",
    phone_number: "",
    bio: "",
    profile_picture_url: "", // Need to change to allow for upload of picture
    theme_preference: "light"
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) { //There is no input box to enter in a second password for confirmation
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    try {
      const { confirmPassword, ...payload } = formData;

      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created successfully!");
        setError("");

        setTimeout(() => {
          navigate("/login");
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
          profile_picture_url: "",
          theme_preference: "light"
        });

      } else {
        setError(data.message || "Registration failed");
        setSuccess("");
      }

    } catch (err) {
      setError("Server not reachable");
      setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card register-card">

        <h2>Create Account</h2>
        <p>Register to get started</p>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <form onSubmit={handleSubmit} className="register-form">

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number (optional)"
            value={formData.phone_number}
            onChange={handleChange}
          />

          <textarea
            name="bio"
            placeholder="Short bio (optional)"
            value={formData.bio}
            onChange={handleChange}
          />

          <input
            type="url"
            name="profile_picture_url"
            placeholder="Profile Picture URL (optional)"
            value={formData.profile_picture_url}
            onChange={handleChange}
          />

          {/* Optional preview */}
          {formData.profile_picture_url && (
            <img
              src={formData.profile_picture_url}
              alt="Preview"
              style={{ width: "80px", height: "80px", borderRadius: "50%" }}
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Create Account</button>
        </form>

        <div className="bottom-text">
          Already have an account? <a href="/">Login</a>
        </div>

      </div>
    </div>
  );
};

export default Register;