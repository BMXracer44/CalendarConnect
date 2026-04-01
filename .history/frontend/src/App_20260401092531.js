import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <nav>Navbar here</nav>
      <Outlet />
    </div>
  );
}

export default App;