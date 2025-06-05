import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Profile from "../Profile/Profile.jsx";
import {
  fetchUserDetails,
  purchasedCourses,
  purchasedWebinars,
} from "./userDashboardapiCalls.js";

import {
  ChevronRight,
  User,
  LayoutDashboard,
  BookOpen,
  MonitorPlay,
  ShoppingBag,
  FileDigit,
  TrendingUp,
  DollarSign,
  Calendar,
  Hash,
  Eye,
  X,
} from "lucide-react";

const UserDashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchUserDetails();
    purchasedCourses();
    purchasedWebinars();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { id: "all", label: "All Products", icon: <LayoutDashboard size={18} /> },
    { id: "courses", label: "Courses", icon: <BookOpen size={18} /> },
    { id: "webinars", label: "Webinars", icon: <MonitorPlay size={18} /> },
    { id: "digital", label: "Digital Products", icon: <FileDigit size={18} /> },
  ];

  const contentData = {
    courses: [
      {
        title: "Advanced React Patterns",
        progress: 65,
        date: "Started Jun 2023",
        price: "$89",
        category: "courses",
      },
      {
        title: "TypeScript Masterclass",
        progress: 100,
        date: "Completed Apr 2023",
        price: "$129",
        category: "courses",
      },
      {
        title: "Node.js Fundamentals",
        progress: 30,
        date: "Started Jul 2023",
        price: "$79",
        category: "courses",
      },
      {
        title: "Full Stack Web Development",
        progress: 45,
        date: "Started Aug 2023",
        price: "$199",
        category: "courses",
      },
    ],
    webinars: [
      {
        title: "Next.js 13 Deep Dive",
        date: "Attended May 15, 2023",
        price: "$25",
        category: "webinars",
      },
      {
        title: "State Management in 2023",
        date: "Upcoming Aug 10, 2023",
        price: "$35",
        category: "webinars",
      },
      {
        title: "Modern CSS Techniques",
        date: "Attended Jun 20, 2023",
        price: "$30",
        category: "webinars",
      },
      {
        title: "GraphQL Best Practices",
        date: "Upcoming Sep 5, 2023",
        price: "$40",
        category: "webinars",
      },
    ],
    digital: [
      {
        title: "JavaScript Cheat Sheets",
        date: "Downloaded Jun 2023",
        price: "$19",
        category: "digital",
      },
      {
        title: "UI Design Templates",
        date: "Downloaded Mar 2023",
        price: "$49",
        category: "digital",
      },
      {
        title: "React Component Library",
        date: "Downloaded Jul 2023",
        price: "$89",
        category: "digital",
      },
      {
        title: "Database Schema Collection",
        date: "Downloaded May 2023",
        price: "$39",
        category: "digital",
      },
    ],
  };

  const transactions = [
    {
      id: "TXN001",
      date: "2023-07-15",
      amount: "$79",
      product: "Node.js Fundamentals",
      status: "Completed",
    },
    {
      id: "TXN002",
      date: "2023-07-10",
      amount: "$89",
      product: "React Component Library",
      status: "Completed",
    },
    {
      id: "TXN003",
      date: "2023-06-20",
      amount: "$30",
      product: "Modern CSS Techniques",
      status: "Completed",
    },
    {
      id: "TXN004",
      date: "2023-06-15",
      amount: "$89",
      product: "Advanced React Patterns",
      status: "Completed",
    },
    {
      id: "TXN005",
      date: "2023-06-01",
      amount: "$19",
      product: "JavaScript Cheat Sheets",
      status: "Completed",
    },
    {
      id: "TXN006",
      date: "2023-05-15",
      amount: "$25",
      product: "Next.js 13 Deep Dive",
      status: "Completed",
    },
  ];

  const totalSpent = transactions.reduce((sum, transaction) => {
    return sum + parseFloat(transaction.amount.replace("$", ""));
  }, 0);

  const handleExplore = (category) => {
    setActiveTab(category);
  };

  const getAllProducts = () => {
    const allProducts = [];
    Object.keys(contentData).forEach((category) => {
      allProducts.push(
        ...contentData[category].slice(0, 2).map((item) => ({
          ...item,
          category,
        }))
      );
    });
    return allProducts;
  };

  const getCurrentContent = () => {
    if (activeTab === "all") {
      return getAllProducts();
    }
    return contentData[activeTab] || [];
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "courses":
        return <BookOpen size={16} className="text-blue-400" />;
      case "webinars":
        return <MonitorPlay size={16} className="text-green-400" />;
      case "digital":
        return <FileDigit size={16} className="text-purple-400" />;
      default:
        return <ShoppingBag size={16} className="text-gray-400" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "courses":
        return "bg-blue-900/50 border-blue-500/30";
      case "webinars":
        return "bg-green-900/50 border-green-500/30";
      case "digital":
        return "bg-purple-900/50 border-purple-500/30";
      default:
        return "bg-gray-800 border-gray-700";
    }
  };

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
              Welcome back, <span className="text-indigo-400">Vishal</span>! 
            </h2>
            <p className="text-gray-300">
              Continue your learning journey with your purchased content.
            </p>
            <div className="flex gap-4 mt-4">
              
             
            </div>
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
            {activeTab === "all" && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Eye size={20} className="text-indigo-400" />
                  Quick Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {Object.keys(contentData).map((category) => (
                    <div
                      key={category}
                      className="text-center p-4 bg-gray-700/50 rounded-lg"
                    >
                      <div className="flex justify-center mb-2">
                        {getCategoryIcon(category)}
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {contentData[category].length}
                      </div>
                      <div className="text-sm text-gray-400 capitalize">
                        {category}
                      </div>
                      <button
                        onClick={() => handleExplore(category)}
                        className="mt-2 text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        Explore All
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {getCurrentContent().map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 rounded-lg border transition-all hover:scale-[1.02] ${getCategoryColor(
                    item.category
                  )}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(item.category)}
                      <h3 className="font-medium text-lg text-white">
                        {item.title}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-400">{item.date}</span>
                      {item.price && (
                        <div className="text-sm font-semibold text-green-400">
                          {item.price}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.progress !== undefined && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="text-indigo-400">
                          {item.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded-full capitalize">
                      {item.category}
                    </span>
                    <button className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm">
                      View details <ChevronRight size={16} />
                    </button>
                  </div>

                  {activeTab === "all" && (
                    <button
                      onClick={() => handleExplore(item.category)}
                      className="mt-2 w-full text-center text-xs text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                      Explore more {item.category} →
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
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
                  ${totalSpent}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Transactions Table */}
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
            <div className="max-h-96 overflow-y-auto">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="p-4 border-b border-gray-700/30 last:border-0 hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-sm text-white">
                        {transaction.product}
                      </p>
                      <p className="text-xs text-gray-400">
                        ID: {transaction.id}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-400">
                      {transaction.amount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={12} />
                      {transaction.date}
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-900/50 text-green-400 rounded-full">
                      {transaction.status}
                    </span>
                  </div>
                </motion.div>
              ))}
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

export default UserDashboard;
