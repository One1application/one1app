import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const AuthenticatedRoutes = () => {
  const [Authenticated, setAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("AuthToken");
    const isAuthenticated = token ? true : false;
    console.log(isAuthenticated);
    setAuthenticated(isAuthenticated);
  }, []);

  return Authenticated ? <Outlet /> : <Navigate to="/signin" />;
};

export default AuthenticatedRoutes;
