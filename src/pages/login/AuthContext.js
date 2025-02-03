import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);

  const login = (userData, userPermissions) => {
    setUser(userData);
    setPermissions(userPermissions);
  };

  const logout = () => {
    setUser(null);
    setPermissions([]);
  };

  return (
    <AuthContext.Provider value={{ user, permissions, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
