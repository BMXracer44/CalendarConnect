return (
  <div className="login-container">
    <div className="login-card">

      <h2>Login</h2>
      <p>Welcome back</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <div className="bottom-text">
        Don't have an account? <a href="/register">Sign up</a>
      </div>

    </div>
  </div>
);