import { Squash as Hamburger } from "hamburger-react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isOpen, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* hamburger button */}
      <div className="hamburger-container">
        <Hamburger toggled={isOpen} toggle={setOpen} />
      </div>

      {/* sidebar */}
      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="logo">CalendarConnect</div>

        <Link to="/calendar" className="nav-link">Calendar</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        <Link to="/events" className="nav-link">Events</Link>
        <Link to="/friends" className="nav-link">Friends</Link>
        <Link to="/settings" className="nav-link">Settings</Link>

        {user && (
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </>
  );
};

export default Navbar;