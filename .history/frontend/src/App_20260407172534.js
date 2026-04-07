// App.js
import { Outlet, NavLink } from "react-router-dom";
import "./App.css"; // optional if you want to style with CSS

function App() {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          end
        >
          Login
        </NavLink>
        <NavLink 
          to="/register" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          Register
        </NavLink>
        <NavLink 
          to="/home" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          Home
        </NavLink>
      </nav>

      {/* Render the page content */}
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;