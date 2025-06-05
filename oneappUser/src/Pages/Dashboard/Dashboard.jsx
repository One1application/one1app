import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Profile from "../Profile/Profile";
import { useUserAuth } from "../../Context/AuthenticationContext";
import Webinar from "../../Components/Webinar";
import Payingup from "../../Components/Payingup";
import { getAllTransactions } from "../../Apicalls/productsPurchased.js";
import Transactions from "../../Components/Transactions.jsx";
import Courses from "../../Components/Courses.jsx";

import {
  ChevronRight,
  User,
  LayoutDashboard,
  BookOpen,
  MonitorPlay,
  ShoppingBag,
  FileDigit,
  DollarSign,
  Calendar,
  Hash,
  Eye,
  X,
} from "lucide-react";

const Dashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");
  const [isMobile, setIsMobile] = useState(false);
  const { userDetails } = useUserAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getAllTransactions();
        setTransactions(res?.transactions || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { id: "courses", label: "Courses", icon: <BookOpen size={18} /> },
    { id: "webinars", label: "Webinars", icon: <MonitorPlay size={18} /> },
    { id: "digital", label: "Digital Products", icon: <FileDigit size={18} /> },
  ];

  const totalSpent = transactions.reduce((sum, transaction) => {
    return sum + parseFloat(transaction.pricePaid || 0);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 text-gray-100 p-4 md:p-6"
    >
      {/* Header/Navigation */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your learning journey
            </p>
          </div>
        </div>
        {!isMobile && (
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all backdrop-blur-sm border border-gray-700/50"
          >
            <User size={18} />
            {showProfile ? "Hide Profile" : "Show Profile"}
          </button>
        )}
      </header>

      {/* Mobile Profile Overlay */}
      <AnimatePresence>
        {isMobile && showProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex items-start justify-center p-4"
          >
            <motion.div
              className="w-full max-w-md bg-gray-800/90 rounded-xl shadow-xl border border-gray-700/50 backdrop-blur-sm"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
                <h2 className="text-xl font-semibold text-white">Profile</h2>
                <button
                  onClick={() => setShowProfile(false)}
                  className="p-2 rounded-full hover:bg-gray-700/50"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <Profile />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Content overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-indigo-500/20"
          >
            <h2 className="text-3xl font-bold mb-2">
              Welcome back,{" "}
              <span className="text-indigo-400">{userDetails?.name}</span>!
            </h2>
            <p className="text-gray-300">
              Continue your learning journey with your purchased content.
            </p>
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex overflow-x-auto scrollbar-hide bg-gray-800/50 rounded-xl p-1 backdrop-blur-sm border border-gray-700/50"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gray-800/50 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50"
          >
            {/* Show different components based on active tab */}
            {activeTab === "webinars" ? (
              <Webinar />
            ) : activeTab === "digital" ? (
              <Payingup />
            ) : (
              <Courses />
            )}
          </motion.div>
        </div>

        {/* Right sidebar - Transactions or Profile */}
        <div className="space-y-6 transition-all duration-300 ease-in-out">
          {/* Profile Section (Desktop) */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={`bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50 overflow-hidden transition-all duration-300 ${
                showProfile ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-4">
                <Profile />
              </div>
            </motion.div>
          )}

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 p-4 rounded-xl shadow-lg backdrop-blur-sm border border-green-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Invested</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Transactions Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={`bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50 transition-all duration-300 ${
              showProfile && !isMobile ? "translate-y-6" : "translate-y-0"
            }`}
          >
            <div className="p-4 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold flex items-center gap-1">
                <Hash size={18} className="text-indigo-400" />
                Recent Transactions
              </h3>
            </div>
            <div className="p-4">
              <Transactions transactions={transactions} />
            </div>
            <div className="p-4 border-t border-gray-700/50 text-center">
              <button className="text-sm text-indigo-400 hover:text-indigo-300">
                View All Transactions
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Profile Toggle */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="lg:hidden fixed bottom-6 right-6 z-10"
        >
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full shadow-lg transition-all flex items-center justify-center"
          >
            {showProfile ? <X size={24} /> : <User size={24} />}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
