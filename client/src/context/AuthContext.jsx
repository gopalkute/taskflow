// src/context/AuthContext.jsx
// Manages authentication state, token storage, and user info

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("tf-token") || null);
  const [loading, setLoading] = useState(true); // Loading while verifying token on mount

  // On app load, verify stored token and fetch user profile
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.get("/auth/profile");
          setUser(res.data.user);
        } catch {
          // Token is invalid or expired — clear it
          logout(false);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  /**
   * Register a new user
   */
  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem("tf-token", newToken);
    setToken(newToken);
    setUser(newUser);
    toast.success("Account created! Welcome 🎉");
    return res.data;
  };

  /**
   * Login existing user
   */
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem("tf-token", newToken);
    setToken(newToken);
    setUser(newUser);
    toast.success(`Welcome back, ${newUser.name}! 👋`);
    return res.data;
  };

  /**
   * Logout — clear token and user state
   */
  const logout = (showToast = true) => {
    localStorage.removeItem("tf-token");
    setToken(null);
    setUser(null);
    if (showToast) toast.success("Logged out successfully.");
  };

  /**
   * Update user in state after profile edit
   */
  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
