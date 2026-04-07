// App.js
import { Outlet, NavLink } from "react-router-dom";
import "./index.css"; // your CSS with navbar styles

function App({ user, logout }) {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <a href="/" className="logo">MyApp</a>

        <div className="right-section">
          {!user ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                Register
              </NavLink>
            </>
          ) : (
            <div className="user-info">
              <img
                src={user.profile_picture_url || "/default-avatar.png"}
                alt="User"
              />
              <span>{user.username}</span>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Render the page content */}
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;