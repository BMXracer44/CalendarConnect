import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        CalendarConnect
      </div>

      <div className="navbar-right">
        {!user ? (
          <>
            <Link to="/" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <>
            {/* USER PROFILE */}
            <Link to="/profile" className="nav-user">
              {user.username}
            </Link>

            {/* CALENDAR */}
            <Link to="/calendar" className="nav-link">
              Calendar
            </Link>

            {/* ⭐ FRIENDS PAGE ADDED HERE */}
            <Link to="/friends" className="nav-link">
              Friends
            </Link>

            {/* LOGOUT */}
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;