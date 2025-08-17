import { motion } from "framer-motion";
import {
  Construction,
  HardHat,
  AlertTriangle,
  Hammer,
  Wrench,
  PlusCircle,
  List,
  Filter,
  ChevronDown,
  HeartHandshake,
  PartyPopper,
  HandHeart,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getallQueries } from "../../services/auth/api.services.js";
import { format } from "timeago.js";
import RaiseQueryForm from "./RaiseQueryForm.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";

const HelpCenterComingSoon = () => {
  const { userDetails } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [activeTab, setActiveTab] = useState("raise");
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  
  const statusFilter = searchParams.get("status") || "";

  const fetchQueries = async (status = "") => {
    try {
      setLoading(true);
      const response = await getallQueries(status);
      if (response.success) {
        setQueries(response.data?.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching queries:", error);
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "raise") {
      setSearchParams({});
    } else {
      fetchQueries();
    }
  };

  const handleStatusFilter = (status) => {
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
    fetchQueries(status);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    if (activeTab === "all") {
      fetchQueries(statusFilter);
    }
  }, [activeTab, statusFilter]);

  const username = userDetails?.name || "Creator";

  const renderContent = () => {
    if (activeTab === "raise") {
      return <RaiseQueryForm />;
    } else {
      return (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Your Queries</h3>
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition"
              >
                <Filter className="h-4 w-4" />
                <span>{statusFilter ? statusFilter : "All"}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg border border-gray-700 shadow-lg z-10"
                >
                  <ul className="py-1">
                    {["", "Pending", "Resolved"].map((status) => (
                      <li key={status || "All"}>
                        <button
                          onClick={() => handleStatusFilter(status)}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            statusFilter === status
                              ? "bg-orange-600/20 text-orange-400"
                              : "text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          {status || "All"}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : queries.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No {statusFilter.toLowerCase() || ""} queries found
            </div>
          ) : (
            <div className="space-y-4">
              {queries.map((query) => (
                <motion.div
                  key={query.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">{query.query}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {format(query.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        query.status === "Resolved"
                          ? "bg-green-900/50 text-green-400"
                          : "bg-orange-900/50 text-orange-400"
                      }`}
                    >
                      {query.status}
                    </span>
                  </div>
                  {query.images && query.images.length > 0 && (
                    <div className="mt-3 flex space-x-2">
                      {query.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          loading="lazy"
                          alt={`Query attachment ${idx + 1}`}
                          className="h-16 w-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* Left Side */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full p-6 rounded-lg bg-gray-900 border border-gray-800 relative overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-500 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-red-600 rounded-full filter blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="p-3 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex-shrink-0"
                  >
                    <Construction className="h-6 w-6 text-white" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-white">
                    Creator Help Center
                  </h2>
                </div>

                <div className="flex bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => handleTabChange("raise")}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium ${
                      activeTab === "raise"
                        ? "bg-orange-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Raise Query
                  </button>
                  <button
                    onClick={() => handleTabChange("all")}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium ${
                      activeTab === "all"
                        ? "bg-orange-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <List className="h-4 w-4" />
                    All Queries
                  </button>
                </div>
              </div>

              {activeTab === "raise" && (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      <HeartHandshake fill="red" color="red" />
                      Hey {username}, raise your query here!
                    </h2>
                    <p className="mt-3 text-gray-300">
                      We're here to help you with any issues you're facing.
                    </p>
                  </div>
                </div>
              )}

              {renderContent()}
            </div>
          </motion.div>
        </div>

        {/* - Right Side */}
        <div className="md:w-80 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-4 sticky top-8"
          >
            <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-lg flex items-start gap-4">
              <div className="p-2 bg-orange-500/10 rounded-full">
                <HandHeart className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Quick Support</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Get help within 24 hours
                </p>
              </div>
            </div>

            <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-lg flex items-start gap-4">
              <div className="p-2 bg-red-500/10 rounded-full">
                <HandHeart className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Track Status</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Monitor your query progress
                </p>
              </div>
            </div>

            <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-lg flex items-start gap-4">
              <div className="p-2 bg-orange-500/10 rounded-full">
                <Heart className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-white">Attachments</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Add screenshots for clarity
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterComingSoon;
