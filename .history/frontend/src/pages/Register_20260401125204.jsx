import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    pronouns: "",
    password: "",
    confirmPassword: ""
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
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
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          pronouns: "",
          password: "",
          confirmPassword: ""
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
        <p>Sign up to get started</p>

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
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="pronouns"
            placeholder="Pronouns"
            value={formData.pronouns}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Create Account</button>
        </form>

        <div className="bottom-text">
          Already have an account? <a href="/login">Login</a>
        </div>

      </div>
    </div>
  );
};

export default Register;