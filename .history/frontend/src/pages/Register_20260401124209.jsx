import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    pronouns: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

    return passwordRegex.test(password);
  };

  const isAtLeast13 = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 13;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.dateOfBirth ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!isAtLeast13(formData.dateOfBirth)) {
      alert("You must be at least 13 years old.");
      return;
    }

    if (!validatePassword(formData.password)) {
      alert("Password must be 8+ chars, include number + special character.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      alert(data.message);

      console.log("Register response:", data);

    } catch (error) {
      console.error("Register error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Register</h2>
        <p>Create your account</p>

        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" onChange={handleChange} />
          <input name="firstName" placeholder="First Name" onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} />
          <input type="date" name="dateOfBirth" onChange={handleChange} />
          <input name="pronouns" placeholder="Pronouns (optional)" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />

          <button type="submit">Register</button>
        </form>

        <div className="bottom-text">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;