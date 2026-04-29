import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    return token && username ? { username, token } : null;
  });

  const login = (data) => {
    // 🔥 DEBUG: shows what backend is sending
    console.log("LOGIN RESPONSE:", data);

    // Try multiple possible backend field names
    const username =
      data.username ||
      data.name ||
      data.email ||
      data.user?.username ||
      data.user?.name;

    const token = data.token;

    // Prevent broken login state
    if (!username || !token) {
      console.error("Missing username or token in login response:", data);
      return;
    }

    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);

    // Update app state
    setUser({ username, token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};