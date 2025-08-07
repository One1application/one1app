import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const TelegramAnalyticsChart = ({ chartData, period, isLoading }) => {
  console.log(period);

  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chartType, setChartType] = useState("line");

  const metricOptions = [
    { key: "revenue", label: "Revenue", color: "#EA580C", prefix: "₹" },
    { key: "earnings", label: "Earnings (After Commission)", color: "#16A34A", prefix: "₹" },
    { key: "transactions", label: "Transaction Count", color: "#2563EB", prefix: "" },
    { key: "buyers", label: "Unique Buyers", color: "#7C3AED", prefix: "" },
  ];

  const currentMetric = metricOptions.find(m => m.key === selectedMetric);

  const formatTooltipValue = (value, name) => {
    const metric = metricOptions.find(m => m.label === name);
    if (metric && metric.prefix === "₹") {
      return [`${metric.prefix}${value.toLocaleString()}`, name];
    }
    return [value.toLocaleString(), name];
  };

  const formatYAxisTick = (value) => {
    if (selectedMetric === "revenue" || selectedMetric === "earnings") {
      if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`;
      } else if (value >= 1000) {
        return `₹${(value / 1000).toFixed(1)}K`;
      }
      return `₹${value}`;
    }
    return value;
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'day':
        return "Daily"
      case 'week':
        return 'Weekly';
      case 'month':
        return 'Monthly';
      case 'year':
        return 'Yearly';
      default:
        return 'Weekly';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Trends</h3>
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">No transaction data available</p>
            <p className="text-sm">Start selling to see your transaction trends here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {getPeriodLabel()} Transaction Trends
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Track your {selectedMetric} over time
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Chart Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType("line")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${chartType === "line"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${chartType === "bar"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Bar
            </button>
          </div>

          {/* Metric Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 min-w-[200px] text-left flex items-center justify-between focus:outline-none hover:border-orange-500"
            >
              <span className="text-gray-700">{currentMetric?.label}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "transform rotate-180" : ""
                  }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 min-w-[200px] bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {metricOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      setSelectedMetric(option.key);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: option.color }}
                    ></div>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Metric Value */}
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-800 text-sm font-medium">
              Current {getPeriodLabel()} {currentMetric?.label}
            </p>
            <p className="text-2xl font-bold text-orange-900">
              {currentMetric?.prefix}
              {chartData
                .reduce((sum, item) => sum + (item[selectedMetric] || 0), 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-orange-700 text-sm">
              {chartData.length} {period === 'week' ? 'days' : period === 'month' ? 'weeks' : 'months'}
            </p>
            <p className="text-orange-600 text-xs">
              Average: {currentMetric?.prefix}
              {Math.round(
                chartData.reduce((sum, item) => sum + (item[selectedMetric] || 0), 0) /
                Math.max(chartData.length, 1)
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickMargin={10}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                domain={[0, "auto"]}
                tickFormatter={formatYAxisTick}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={currentMetric?.color}
                strokeWidth={3}
                dot={{ fill: currentMetric?.color, r: 4 }}
                activeDot={{ r: 6, fill: currentMetric?.color }}
                animationDuration={500}
              />
            </LineChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickMargin={10}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                domain={[0, "auto"]}
                tickFormatter={formatYAxisTick}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <Tooltip
                formatter={formatTooltipValue}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar
                dataKey={selectedMetric}
                fill={currentMetric?.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {metricOptions.map((option) => {
          const totalValue = chartData.reduce((sum, item) => sum + (item[option.key] || 0), 0);
          return (
            <div
              key={option.key}
              className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${selectedMetric === option.key
                ? "border-orange-200 bg-orange-50"
                : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
              onClick={() => setSelectedMetric(option.key)}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: option.color }}
                ></div>
                <p className="text-xs text-gray-600 font-medium">{option.label}</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {option.prefix}{totalValue.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TelegramAnalyticsChart;