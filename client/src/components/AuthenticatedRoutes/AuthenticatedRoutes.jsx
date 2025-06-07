import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AuthenticatedRoutes = () => {
  const { authenticated, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (authenticated && userRole === "User") {
    toast.error("Please sign up as a creator to access this dashboard pages");
    return <Navigate to="/signup" />;
  }
  return authenticated && userRole === "Creator" ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
};

export default AuthenticatedRoutes;
