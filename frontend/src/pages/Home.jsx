import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Welcome{user ? `, ${user.username}` : ""} 👋</h1>
        <p>This is your dashboard.</p>
      </div>
    </div>
  );
};

export default Home;