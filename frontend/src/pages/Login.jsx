import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// login page UI
// navigate to calendar on successful login
const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Attempts login
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      // Debug response
      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);

      if (response.ok) {
        login(data);
        // Debug success
        setSuccess("Login successful!");
        setError("");

        setTimeout(() => {
          navigate("/calendar");
        }, 500);
      } else {
        // Failed login
        setError(data.message || "Invalid username or password");
        setSuccess("");
      }
    } catch (err) {
      setError("Server not reachable");
      setSuccess("");
    }
  };
  // UI
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <p>Welcome back</p>
        {/*Display errors/success messages*/}
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {/* Password input*/}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Submit button*/}
          <button type="submit">Login</button>
        </form>
        {/* Link to registration page */}
        <div className="bottom-text">
          Don't have an account? <a href="/register">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;