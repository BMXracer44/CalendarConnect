import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    return token && username ? { username, token } : null;
  });

  const login = (data) => {
    console.log("LOGIN RESPONSE:", data);

    const username =
      data.username ||
      data.name ||
      data.email ||
      data.user?.username ||
      data.user?.name;

    const token = data.token;

    if (!username || !token) {
      console.error("Missing username or token:", data);
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("username", username);

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