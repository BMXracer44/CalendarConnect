import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        setSuccess("Login successful!");
        setError("");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);

      } else {
        setError(data.message || "Invalid login");
        setSuccess("");
      }

    } catch (err) {
      setError("Server not reachable");
      setSuccess("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Login</h2>
        <p>Welcome back</p>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <div className="bottom-text">
          Don't have an account? <a href="/register">Sign up</a>
        </div>

      </div>
    </div>
  );
};

export default Login;