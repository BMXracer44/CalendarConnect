import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    return token && username
      ? { username, token }
      : null;
  });

  // ✅ FIXED LOGIN FUNCTION
  const login = (response) => {
    const userData = response.data; // 🔥 IMPORTANT FIX

    localStorage.setItem("token", userData.token);
    localStorage.setItem("username", userData.username);

    setUser({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      token: userData.token
    });
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