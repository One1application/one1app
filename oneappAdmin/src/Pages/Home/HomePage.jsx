/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import CountUp from "react-countup";
import LineChartComponent from "../../components/Charts/LineChartComponent";
import { dashboardConfig } from "./homeConfig";
import NotificationModal from "../../components/Modal/NotificationModal";

const HomePage = () => {
  const { todaysRevenue, lastUpdated, stats, leaderboard, revenueGraph,notifications } =
    dashboardConfig;
  const [activeTab, setActiveTab] = useState("today");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="max-w-full min-h-screen px-4 md:px-6 py-8 bg-gray-100">
      {/* Dashboard Header */}
      <div className="flex flex-col bg-white py-4 px-3 md:py-6 md:px-5 rounded-md">
        <div className="flex bg-[#EFF4F5] py-4 md:py-6 px-3 rounded-md items-center justify-between">
          <div className="flex gap-3 items-center">
            <FaHome className="text-xl md:text-2xl" aria-label="Home Icon" />
            <p className="font-poppins tracking-tight text-[16px] md:text-xl font-bold">
              Dashboard
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
              ₹<CountUp start={0} end={todaysRevenue} duration={2} />
            </h2>
            <p className="font-poppins tracking-tight text-sm text-gray-500">
              Last Updated on {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Stats and Leaderboard Section */}
      <div className="flex flex-wrap lg:flex-nowrap gap-6 mt-8">
        {/* Stats Section */}
        <div className="w-full lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
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
                    className={`font-medium ${
                      stat.trend === "positive"
                        ? "text-green-500"
                        : "text-red-500"
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
          <div className="flex space-x-1 mb-4 overflow-x-auto scrollbar-hide">
            {[
              { id: "today", label: "Today" },
              { id: "thisWeek", label: "This Week" },
              { id: "thisMonth", label: "This Month" },
              { id: "allTime", label: "All Time" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`text-sm font-medium px-3 py-1 rounded-lg whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-orange-600 text-white"
                    : "text-gray-600 bg-gray-100"
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div>
            {leaderboard[activeTab].map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border-b border-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.date}</p>
                </div>
                <p className="font-semibold text-gray-700">{user.earnings}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <LineChartComponent
          data={revenueGraph.earningsData}
          title={revenueGraph.title}
          revenue={revenueGraph.revenue}
          color="#f97316"
          yDataKey="earnings"
        />
        <LineChartComponent
          data={revenueGraph.earningsData}
          title={revenueGraph.title}
          revenue={revenueGraph.revenue}
          color="#16a34a"
          yDataKey="earnings"
        />
        <LineChartComponent
          data={revenueGraph.earningsData}
          title={revenueGraph.title}
          revenue={revenueGraph.revenue}
          color="#2563eb"
          yDataKey="earnings"
        />
        <LineChartComponent
          data={revenueGraph.earningsData}
          title={revenueGraph.title}
          revenue={revenueGraph.revenue}
          color="#9333ea"
          yDataKey="earnings"
        />
      </div>
    </div>
  );
};

export default HomePage;