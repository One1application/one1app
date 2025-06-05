import React from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-orange-500">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
