import React, { useState, useEffect, useCallback } from "react";
import { createContext } from "react";
import { getProfile } from "../services/api";

/**
 * AuthProvider
 * - Manages authenticated user session
 * - Loads profile from /auth/me if token exists
 * - Persists login token in localStorage
 * - Exposes login, logout, and refresh utilities
 */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current logged-in user (if token exists)
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await getProfile();
      const userData = res.data?.user || res.data;
      setUser(userData);
    } catch (err) {
      console.warn("Auth load failed:", err.response?.data?.message || err.message);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = (userData, token) => {
    if (token) localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const refresh = () => loadUser();

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refresh,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
