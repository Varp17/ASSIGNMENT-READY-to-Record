import React, { createContext, useEffect, useState, useCallback } from "react";
import { getProfile } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile if token exists
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await getProfile();

      // Support both response shapes: { user } or { success, user }
      const userData = res.data?.user || res.data;
      setUser(userData);
    } catch (err) {
      console.warn("Failed to fetch profile:", err.response?.data?.message || err.message);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run once on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login → save token + user data
  const login = (userData, token) => {
    if (token) localStorage.setItem("token", token);
    setUser(userData);
  };

  // Logout → remove token + clear state
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refresh: loadUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
