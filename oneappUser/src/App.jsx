import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login/Login";
import WelcomePage from "./Pages/Home/WelcomePage";
import NotFoundPage from "./Pages/Notfound/NotFoundPage";
import { Toaster } from "react-hot-toast";
import MainLayout from "./Components/MainLayout";
import { useUserAuth } from "./Context/AuthenticationContext.jsx";
import Explore from "./Pages/Explore/Explore.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";

const App = () => {
  const { authenticated, loading, userDetails } = useUserAuth();

  const isLoading = loading;

  const isAuthenticated = authenticated && userDetails;

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Dashboard />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/explore"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Explore />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
