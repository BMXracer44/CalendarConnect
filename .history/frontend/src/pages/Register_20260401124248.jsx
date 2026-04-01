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
    <div className="auth-container">
      <h2>Register</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default Register;