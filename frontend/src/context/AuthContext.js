import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    return token && username ? { username, token } : null;
  });

  const login = (data) => {
    const username = data.username || data.user?.username;

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", username);

    setUser({ username, token: data.token });
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