/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useMemo } from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import CountUp from "react-countup";
import NotificationModal from "../../components/Modal/NotificationModal";
import { dashboardData } from "../../services/api-service";
import PieChartComponent from "../../components/Charts/PieChartComponent";

const HomePage = () => {
  const [dashboard, setDashboard] = useState({
    todaysRevenue: "0",
    lastUpdated: "",
    stats: [],
    leaderboard: {
      today: [],
      thisWeek: [],
      thisMonth: [],
      thisYear: [],
    },
    spendingPieChart: [],
    creatorPieChart: [],
  });
  const [activeTab, setActiveTab] = useState("today");
  const [period, setPeriod] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async (selectedPeriod) => {
    setIsLoading(true);
    try {
      const response = await dashboardData(selectedPeriod);
      setDashboard(response);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(period);
  }, [period]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handlePeriodChange = (e) => {
    const newPeriod = e.target.value;
    setPeriod(newPeriod);
    setActiveTab(newPeriod); // Sync leaderboard tab with period
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredLeaderboard = useMemo(() => {
    return dashboard.leaderboard[activeTab].filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dashboard.leaderboard, activeTab, searchQuery]);

  // Mock notifications (replace with actual data if needed)
  const notifications = [
    {
      title: "New Creator Joined",
      description: "A new creator has joined the platform.",
      timestamp: "2025-05-05 12:30:00",
    },
    {
      title: "Payment Processed",
      description: "A payment of ₹5,000 has been processed.",
      timestamp: "2025-05-04 10:30:00",
    },
    {
      title: "Revenue Milestone",
      description: "Your revenue reached ₹10,00,000!",
      timestamp: "2025-05-03 15:45:00",
    },
  ];

  return (
    <div className="max-w-full min-h-screen px-4 md:px-6 py-8 bg-gray-100">
      {/* Dashboard Header */}
      <div className="flex flex-col bg-white py-4 px-3 md:py-6 md:px-5 rounded-md">
        <div className="flex bg-[#EFF4F5] py-4 md:py-6 px-3 rounded-md items-center justify-between">
          <div className="flex gap-3 items-center">
            <FaHome className="text-xl md:text-2xl" aria-label="Home Icon" />
            <p className="font-poppins tracking-tight text-[16px] md:text-xl font-bold">
              Creators Dashboard
            </p>
          </div>
          <NotificationModal notifications={notifications} />
        </div>

        {/* Wallet Content */}
        <div className="my-4 flex flex-col md:flex-row justify-between md:items-center gap-6">
          <div className="flex flex-col gap-3">
            <p className="font-poppins tracking-tight text-sm text-gray-500">
              Today's Revenue
            </p>
            <h2 className="font-bold tracking-tight font-poppins text-3xl flex gap-1">
              ₹<CountUp start={0} end={parseFloat(dashboard.todaysRevenue)} duration={2} decimals={2} />
            </h2>
            <p className="font-poppins tracking-tight text-sm text-gray-500">
              Last Updated on {dashboard.lastUpdated}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={period}
              onChange={handlePeriodChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats and Leaderboard Section */}
      <div className="flex flex-wrap lg:flex-nowrap gap-6 mt-8">
        {/* Stats Section */}
        <div className="w-full lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboard.stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white shadow-md p-4 rounded-lg border border-gray-200 text-sm"
              >
                <h3 className="text-base font-semibold text-gray-700 mb-2">
                  {stat.title}
                </h3>
                <hr className="mb-3 border-gray-300" />
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <div className="flex justify-between items-center">
                  <p
                    className={`font-medium ${stat.trend === "positive" ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {stat.percentage}
                  </p>
                  <p className="ml-2 text-sm text-gray-500">From Last Period</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="w-full lg:w-1/3 bg-white shadow-md p-4 rounded-lg border border-gray-200 text-sm">
          <h3 className="text-base font-semibold text-gray-700 mb-4">
            Creators Leaderboard
          </h3>
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
              {[
                { id: "today", label: "Today" },
                { id: "thisWeek", label: "This Week" },
                { id: "thisMonth", label: "This Month" },
                { id: "thisYear", label: "This Year" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`text-sm font-medium px-3 py-1 rounded-lg whitespace-nowrap ${activeTab === tab.id
                      ? "bg-orange-600 text-white"
                      : "text-gray-600 bg-gray-100"
                    }`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search creators..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
              />
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-600"></div>
              </div>
            ) : filteredLeaderboard.length === 0 ? (
              <p className="text-center text-gray-500">No creators found.</p>
            ) : (
              filteredLeaderboard.map((user, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 border-b border-gray-100"
                >
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">Earnings: ₹{user.earnings}</p>
                  </div>
                  <p className="font-semibold text-gray-700">₹{user.earnings}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pie Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <PieChartComponent
          data={dashboard.spendingPieChart}
          title="Spending Distribution"
        />
        <PieChartComponent
          data={dashboard.creatorPieChart}
          title="Creator Distribution"
        />
      </div>

      {error && (
        <div className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default HomePage;