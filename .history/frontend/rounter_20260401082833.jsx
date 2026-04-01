import { createBrowserRouter } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
]);