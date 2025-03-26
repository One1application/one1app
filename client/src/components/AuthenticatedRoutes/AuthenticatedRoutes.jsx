import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AuthenticatedRoutes = () => {
  const { authenticated, loading ,userRole } = useAuth();

  if (loading) {
    // Show a loading spinner or skeleton while verifying
    return <div className="flex justify-center items-center h-screen">Verifying your session...</div>;
  }

  if (authenticated && userRole === "User") {
    toast.error("Please sign up as a creator to access this page");
    return <Navigate to="/signup" />;
  }
  return authenticated && userRole === "Creator" ? <Outlet /> : <Navigate to="/signin" />;
};

export default AuthenticatedRoutes;
