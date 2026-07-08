import React, { createContext, useContext, useState, useEffect } from "react";
import { adminApi, getToken, setToken, clearToken } from "@/lib/adminApi";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ email: payload.email, role: payload.role });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await adminApi.login(email, password);
    setToken(data.token);
    setTokenState(data.token);
    return data;
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ token, user, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);