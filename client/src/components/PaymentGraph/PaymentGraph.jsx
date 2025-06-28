import { useState, useMemo } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// DatePicker remains unchanged
const DatePicker = ({ selectedDate, onDateSelect, isOpen, setIsOpen }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const getCalendarDays = () => {
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const daysInMonth = getDaysInMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateClick = (day) => {
    if (day) {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      onDateSelect(newDate);
      setIsOpen(false);
    }
  };

  const formatDate = (date) => {
    return `${
      MONTHS[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-48 text-left flex items-center justify-between focus:outline-none hover:border-orange-500"
      >
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-gray-700">
            {selectedDate ? formatDate(selectedDate) : "Select date"}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
          <div className="p-2">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-sm font-medium">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs text-gray-500 py-1"
                >
                  {day}
                </div>
              ))}
              {getCalendarDays().map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`
                    text-center p-1 text-sm rounded hover:bg-orange-100
                    ${!day ? "invisible" : ""}
                    ${
                      selectedDate &&
                      day === selectedDate.getDate() &&
                      currentDate.getMonth() === selectedDate.getMonth() &&
                      currentDate.getFullYear() === selectedDate.getFullYear()
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "text-gray-700"
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentGraph = ({ cardData }) => {
  console.log("card data ", cardData);
  const [selectedMetric, setSelectedMetric] = useState("sales");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();
  const todayStr = `${today.getDate()} ${MONTHS[today.getMonth()].substring(
    0,
    3
  )}`;

  // Process and memoize the graph data
  const graphData = useMemo(() => {
    if (!cardData || !Array.isArray(cardData)) return [];

    return cardData
      .map((card) => {
        if (!card.date || card.value === undefined || card.value === null) return null;


        const [day, monthStr] = card.date.split(" ");
        const monthIndex = MONTHS.findIndex(
          (m) => m.substring(0, 3).toLowerCase() === monthStr.toLowerCase()
        );

        if (monthIndex === -1) return null;

        const date = new Date(today.getFullYear(), monthIndex, parseInt(day));
        const sales = parseFloat(card.value) || 0;

        // For revenue, we'll calculate cumulative values
        return {
          date: card.date,
          fullDate: date,
          sales,
          revenue: sales, // This will be transformed to cumulative later
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.fullDate - b.fullDate)
      .map((item, index, array) => {
        // Calculate cumulative revenue
        const cumulativeRevenue = array
          .slice(0, index + 1)
          .reduce((sum, curr) => sum + curr.revenue, 0);

        return {
          ...item,
          revenue: cumulativeRevenue,
        };
      });
  }, [cardData, today]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const todaySales =
      graphData.find((item) => item.date === todayStr)?.sales || 0;
    const weekSales = graphData.reduce((sum, item) => sum + item.sales, 0);
    const totalRevenue = graphData[graphData.length - 1]?.revenue || 0;

    return { todaySales, weekSales, totalRevenue };
  }, [graphData, todayStr]);

  const getFilteredData = () => {
    if (selectedMetric === "todaySales") {
      return graphData.filter((item) => item.date === todayStr);
    }
    if (selectedDate) {
      const selectedDay = selectedDate.getDate();
      const selectedMonth = selectedDate.toLocaleString("en-US", {
        month: "short",
      });
      return graphData.filter((item) => {
        const [day, month] = item.date.split(" ");
        return parseInt(day) === selectedDay && month === selectedMonth;
      });
    }
    return graphData;
  };

  const filteredData = getFilteredData();

  const renderGraph = () => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10}/>
          <YAxis
            domain={[0, "auto"]}
            tickFormatter={(value) => `₹${value.toLocaleString()}`}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <Tooltip
            formatter={(value) => [
              `₹${value.toLocaleString()}`,
              selectedMetric === "revenue"
                ? "Total Revenue"
                : selectedMetric === "todaySales"
                ? "Today's Sales"
                : "Daily Sales",
            ]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey={selectedMetric === "revenue" ? "revenue" : "sales"}
            stroke="#EA580C"
            strokeWidth={2}
            dot={{ fill: "#EA580C", r: 4 }}
            activeDot={{ r: 6, fill: "#EA580C" }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  if (!cardData || !Array.isArray(cardData) || cardData.length === 0) {
    return (
      <div className="w-full px-6 relative -mt-20 z-10">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
          No data available to display graph.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 relative -mt-20 z-10">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 w-48 text-left flex items-center justify-between focus:outline-none hover:border-orange-500"
              >
                <span className="text-gray-700">
                  {selectedMetric === "sales"
                    ? "Daily Sales"
                    : selectedMetric === "revenue"
                    ? "Total Revenue"
                    : "Today's Sales"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setSelectedMetric("todaySales");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-t-lg"
                  >
                    Today's Sales
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMetric("sales");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Daily Sales
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMetric("revenue");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-b-lg"
                  >
                    Total Revenue
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              {selectedMetric === "todaySales" && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg px-4 py-2 shadow min-w-[180px]">
                  <div className="flex flex-col">
                    <div className="text-xs text-orange-100 font-medium">
                      Today's Sales
                    </div>
                    <div className="text-lg font-semibold text-white">
                      ₹{metrics.todaySales.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {selectedMetric === "sales" && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg px-4 py-2 shadow min-w-[180px]">
                  <div className="flex flex-col">
                    <div className="text-xs text-orange-100 font-medium">
                      This Week's Sales
                    </div>
                    <div className="text-lg font-semibold text-white">
                      ₹{metrics.weekSales.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {selectedMetric === "revenue" && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg px-4 py-2 shadow min-w-[180px]">
                  <div className="flex flex-col">
                    <div className="text-xs text-orange-100 font-medium">
                      Total Revenue
                    </div>
                    <div className="text-lg font-semibold text-white">
                      ₹{metrics.totalRevenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* <DatePicker
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            isOpen={isCalendarOpen}
            setIsOpen={setIsCalendarOpen}
          /> */}
          <div className="flex items-center">
  <DatePicker
     selectedDate={selectedDate}
     onDateSelect={setSelectedDate}
     isOpen={isCalendarOpen}
     setIsOpen={setIsCalendarOpen}
  />

     {selectedDate && (
    <button
      onClick={() => setSelectedDate(null)}
      className="text-sm text-orange-500 hover:underline ml-2"
    >
      Clear date
    </button>
  )}
</div>

         
        </div>

        <div className="h-[400px] w-full">{renderGraph()}</div>
      </div>
    </div>
  );
};

export default PaymentGraph;
