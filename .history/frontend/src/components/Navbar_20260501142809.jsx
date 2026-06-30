import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ================= LOAD REQUESTS =================
  const loadRequests = async () => {
    try {
      const res = await fetch(
        `/api/friends/requests/${user.id}`
      );

      if (!res.ok) {
        console.error("Failed to load requests");
        return;
      }

      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Request fetch error:", err);
    }
  };

  // ================= AUTO REFRESH =================
  useEffect(() => {
    if (!user?.id) return;

    loadRequests();

    const interval = setInterval(loadRequests, 5000); // every 5 sec

    return () => clearInterval(interval);
  }, [user]);

  // ================= ACCEPT =================
  const acceptFriend = async (fromId) => {
    try {
      await fetch(
        `/api/friends/accept?from=${fromId}&to=${user.id}`,
        { method: "POST" }
      );

      loadRequests();

    } catch (err) {
      console.error("Accept failed:", err);
    }
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
            {/* 🔔 NOTIFICATION BELL */}
            <div className="nav-bell">
              <button
                className="bell-button"
                onClick={() => setShowRequests(!showRequests)}
              >
                🔔 {requests.length > 0 && `(${requests.length})`}
              </button>

              {showRequests && (
                <div className="requests-dropdown">
                  <h4>Friend Requests</h4>

                  {requests.length === 0 && <p>No requests</p>}

                  {requests.map((r) => (
                    <div key={r.id} className="request-item">
                      <span>User ID: {r.requesterId}</span>

                      <button
                        onClick={() => acceptFriend(r.requesterId)}
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* USER PROFILE */}
            <Link to="/profile" className="nav-user">
              {user.username}
            </Link>

            {/* CALENDAR */}
            <Link to="/calendar" className="nav-link">
              Calendar
            </Link>

            {/* FRIENDS */}
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