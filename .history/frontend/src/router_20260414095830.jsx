import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "profile", element: <Profile /> }
    ]
  }
]);