import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AuthenticatedRoutes = () => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    // Show a loading spinner or skeleton while verifying
    return <div className="flex justify-center items-center h-screen">Verifying your session...</div>;
  }

  return authenticated ? <Outlet /> : <Navigate to="/signin" />;
};

export default AuthenticatedRoutes;
