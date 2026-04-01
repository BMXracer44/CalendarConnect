import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <h1>Home</h1>
        <RouterProvider router={router} />
    </StrictMode>
);