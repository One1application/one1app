import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import  toast  from "react-hot-toast";
import { fetchUserDetails } from '../services/auth/api.services';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const logout = () => {
    localStorage.removeItem("AuthToken");
    setCurrentUserId(null);
    setAuthenticated(false);
    setUserRole(null);
    setUserDetails(null);
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
        setUserRole(response.data.user.role);
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

  const [userDetails, setUserDetails] = useState("");
  const [userdetailloading, userdetailsetLoading] = useState(true);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        userdetailsetLoading(true);
        const response = await fetchUserDetails();
        console.log("User Details Response:", response.data);
        setUserDetails(response.data.userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        userdetailsetLoading(false);
      }
    };

    getUserDetails();
  }, []);


  useEffect(() => {
    verifyToken();
  }, []);

  const value = {
    currentUserId,
    authenticated,
    loading,
    logout,
    verifyToken,
    userRole,
    userDetails,
    userdetailloading
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
