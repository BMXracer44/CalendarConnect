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

  const loadRequests = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/friends/requests/${user.id}`
      );

      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    loadRequests();
    const interval = setInterval(loadRequests, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const acceptFriend = async (fromId) => {
    await fetch(
      `http://localhost:8080/api/friends/accept?from=${fromId}&to=${user.id}`,
      { method: "POST" }
    );

    loadRequests();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">CalendarConnect</div>

      <div className="navbar-right">

        {!user ? (
          <>
            <Link className="nav-link" to="/">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
            <Link className="nav-link" to="/help">Help</Link>
          </>
        ) : (
          <>
            {/* 🔔 NOTIFICATION */}
            <div className="nav-bell">
              <button
                className="bell-button"
                onClick={() => setShowRequests(!showRequests)}
              >
                🔔
                {requests.length > 0 && (
                  <span className="bell-count">{requests.length}</span>
                )}
              </button>

              {showRequests && (
                <div className="dropdown-card">
                  <h4>Friend Requests</h4>

                  {requests.length === 0 ? (
                    <p className="empty-text">No requests</p>
                  ) : (
                    requests.map((r) => (
                      <div className="dropdown-item" key={r.id}>
                        <span>{r.username}</span>

                        <button
                          className="accept-btn"
                          onClick={() => acceptFriend(r.requesterId)}
                        >
                          Accept
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <Link className="nav-user" to="/profile">
              {user.username}
            </Link>

            <Link className="nav-link" to="/calendar">Calendar</Link>
            <Link className="nav-link" to="/friends">Friends</Link>
            <Link className="nav-link" to="/help">Help</Link>

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