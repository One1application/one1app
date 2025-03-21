import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const logout = () => {
    localStorage.removeItem("AuthToken");
    setCurrentUserId(null);
    setAuthenticated(false);
  };

  const verifyToken = async () => {
    const token = localStorage.getItem("AuthToken");
    if (!token) {
      setLoading(false);
      return false;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/verify-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setCurrentUserId(response.data.user.id);
        setAuthenticated(true);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
      toast.error("Authentication failed. Please sign in again.");
    }
    
    setLoading(false);
    return false;
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const value = {
    currentUserId,
    authenticated,
    loading,
    logout,
    verifyToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};