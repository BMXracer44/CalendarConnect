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
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {/* 🔔 */}
            <div className="nav-bell">
              <button onClick={() => setShowRequests(!showRequests)}>
                🔔 {requests.length > 0 && `(${requests.length})`}
              </button>

              {showRequests && (
                <div className="dropdown">
                  <h4>Requests</h4>

                  {requests.map((r) => (
                    <div key={r.id}>
                      <span>{r.username}</span>

                      <button onClick={() => acceptFriend(r.requesterId)}>
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link to="/profile">{user.username}</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/friends">Friends</Link>

            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;