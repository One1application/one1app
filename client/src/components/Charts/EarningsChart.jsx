import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchWalletChartData } from "../../services/auth/api.services";


// is dummy data
const defaultEarningsData = [
  { month: "Jan", earnings: 5000 },
  { month: "Feb", earnings: 10000 },
  { month: "Mar", earnings: 8000 },
  { month: "Apr", earnings: 36450 },
  { month: "May", earnings: 15000 },
  { month: "Jun", earnings: 20000 },
  { month: "Jul", earnings: 4000 },
  { month: "Aug", earnings: 18000 },
  { month: "Sep", earnings: 25000 },
  { month: "Oct", earnings: 22000 },
  { month: "Nov", earnings: 27000 },
  { month: "Dec", earnings: 30000 },
];

const ProductType  = {
  WEBINAR: 'WEBINAR',
  COURSE: 'COURSE',
  PAYINGUP: 'PAYINGUP',
  TELEGRAM: 'TELEGRAM',
  PREMIUMCONTENT: 'PREMIUMCONTENT'
};

const defaultEr = [
  { month: "Jan", earnings: 0 },
  { month: "Feb", earnings: 0 },
  { month: "Mar", earnings: 0 },
  { month: "Apr", earnings: 0 },
  { month: "May", earnings: 0 },
  { month: "Jun", earnings: 0 },
  { month: "Jul", earnings: 0 },
  { month: "Aug", earnings: 0 },
  { month: "Sep", earnings: 0 },
  { month: "Oct", earnings: 0 },
  { month: "Nov", earnings: 0 },
  { month: "Dec", earnings: 0 },
]

const EarningsChart = () => {
  const [selectedCategory, setSelectedCategory] = useState("Product");
  const [chartData, setChartData] = useState(defaultEr);
  const [totalEarnings, setTotalEarning] = useState(0);
  const [fetchCat, setFetchCat] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryChange = (category) => {
    console.log(category);
    setSelectedCategory(category)
    switch (category) {
      case 'PayingUp':
        console.log(1);
        setFetchCat(ProductType.PAYINGUP)
        break;
      case 'Webinar':
        console.log(2);
        setFetchCat(ProductType.WEBINAR)
        break;
      case 'Courses':
        console.log(3);
        setFetchCat(ProductType.COURSE)
        break;
      case 'Telegram':
        console.log(4);
        setFetchCat(ProductType.TELEGRAM)
        break;
      case 'PremiumContent':
        console.log(5);
        setFetchCat(ProductType.PREMIUMCONTENT)
        break;
      default:
        setFetchCat('')
        break;
    }
  };

  async function getChartData() {
  try {
    setIsLoading(true)
    const response = await fetchWalletChartData({ fetchCat });
    if (response?.data) {
      setTotalEarning(response.data.payload.totalEarnings || 0)
      toast.success(response.data.message);
      if(!fetchCat) {
        setChartData(response.data.payload.monthlyEarnings || 0);
      } else {
        setChartData(response.data.payload.productBreakdown[fetchCat]);
      }
    } else {
      setChartData(defaultEr);
    }
  } catch (e) {
    toast.error(e.message);
    setTotalEarning(0);
    console.error(e.message);
    setChartData(defaultEr);
  } finally {
    setIsLoading(false)
  }
}
  useEffect(() => {
    getChartData();
  }, [fetchCat])


    if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="md:text-xl font-semibold text-gray-800 font-poppins tracking-tight">
          All Time Earnings
        </h3>
        <div className="flex flex-col md:flex-row space-x-4 items-center font-poppins tracking-tight font-medium">
          <p className="md:text-md text-sm">
            ₹ {totalEarnings.toLocaleString("en-IN")}
          </p>
          <div className="hidden md:flex space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 text-sm border rounded-lg font-poppins bg-white tracking-tight focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="Product">Product</option>
              <option value="PayingUp">Paying Up</option>
              <option value="Webinar">Webinar</option>
              <option value="Courses">Courses</option>
              <option value="Telegram">Telegram</option>
              <option value="PremiumContent">Premium Content</option>
            </select>
            <select className="px-3 py-2 text-sm border font-poppins bg-white tracking-tight rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="Last Year">Last Year</option>
              <option value="Last Month">Last Month</option>
            </select>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "5px",
            }}
            labelStyle={{ color: "#6b7280" }}
            cursor={{ stroke: "#f97316", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="earnings"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 6, fill: "#fff", stroke: "#f97316", strokeWidth: 2 }}
            activeDot={{ r: 8, fill: "#f97316", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
