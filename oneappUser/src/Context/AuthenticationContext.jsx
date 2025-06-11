import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getUserDetails as fetchUserDetails } from "../Apicalls/authApis.js";

const AuthenticationContext = createContext();

export const useUserAuth = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userdetailsLoading, setUserdetailsLoading] = useState(true);

  const logoutUser = () => {
    localStorage.removeItem("UserToken");
    setUserDetails(null);
    setAuthenticated(false);
    setUserdetailsLoading(false);
  };

  const getUserDetails = useCallback(async () => {
    try {
      setUserdetailsLoading(true);
      const response = await fetchUserDetails();

      if (response.data?.userDetails) {
        setUserDetails(response.data.userDetails);
        console.log("User Details:", response.data.userDetails);
        return true;
      }
      toast.error("Could not fetch full user details.");
      return false;
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details.");
      return false;
    } finally {
      setUserdetailsLoading(false);
    }
  }, []);

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem("UserToken");
    if (!token) {
      setLoading(false);
      setAuthenticated(false);
      return false;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth/verify-token`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setAuthenticated(true);
        const userDetailsSuccess = await getUserDetails();
        if (!userDetailsSuccess) {
          logoutUser();
        }
        return userDetailsSuccess;
      }
      return false;
    } catch (error) {
      console.error("Token verification failed:", error);
      logoutUser();
      return false;
    } finally {
      setLoading(false);
    }
  }, [getUserDetails, logoutUser]);

  useEffect(() => {
    verifyToken();
  }, []);

  const contextValue = {
    userDetails,
    loading,
    authenticated,
    userdetailsLoading,
    logoutUser,
    getUserDetails,
    verifyToken,
  };

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};
