import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,   // 👈 use App here
    children: [
      { index: true, element: <Login /> },     // "/" 
      { path: "register", element: <Register /> },
      { path: "home", element: <Home /> }
    ]
  }
]);