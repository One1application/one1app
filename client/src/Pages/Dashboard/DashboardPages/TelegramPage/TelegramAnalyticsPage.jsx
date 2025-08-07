import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  IndianRupee,
  Activity,
  Calendar,
  UserCheck,
  UserX,
  Crown,
  ChevronDown,
  ExternalLink,
  BarChart3
} from "lucide-react";
import {
  getTelegramAnalytics,
  getCreatorTelegramById
} from "../../../../services/auth/api.services";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const TelegramAnalyticsPage = () => {
  const { telegramId } = useParams();
  const navigate = useNavigate();

  const [telegramData, setTelegramData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [period, setPeriod] = useState('month');

  // Fetch telegram basic info
  const fetchTelegramInfo = async () => {
    try {
      const response = await getCreatorTelegramById(telegramId);
      setTelegramData(response.data.payload.telegram);
    } catch (error) {
      console.error("Error fetching telegram info:", error);
      toast.error("Failed to load telegram information");
    }
  };

  // Fetch analytics data
  const fetchAnalyticsData = async (selectedPeriod = period) => {
    setAnalyticsLoading(true);
    try {
      const response = await getTelegramAnalytics(telegramId, selectedPeriod);
      console.log('Individual analytics data:', response.data);
      setAnalyticsData(response.data.payload);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    fetchAnalyticsData(newPeriod);
  };

  useEffect(() => {
    if (telegramId) {
      setIsLoading(true);
      Promise.all([fetchTelegramInfo(), fetchAnalyticsData()])
        .finally(() => setIsLoading(false));
    }
  }, [telegramId]);

  // Prepare chart data for subscription trends
  const subscriptionTrendsData = analyticsData?.subscriptionTrends?.map(trend => ({
    date: new Date(trend.period).toLocaleDateString('en-US', {
      month: 'short',
      day: period === 'day' ? 'numeric' : undefined,
      year: period === 'year' ? 'numeric' : undefined
    }),
    subscriptions: trend.subscriptions,
    revenue: trend.revenue,
    active: trend.active_subs,
    lifetime: trend.lifetime_subs
  })) || [];

  // Prepare subscription type pie chart data
  const subscriptionTypeData = analyticsData?.subscriptionTypeBreakdown?.map(type => ({
    name: type.type,
    value: type.total_subscriptions,
    revenue: type.total_revenue,
    color: getColorForSubscriptionType(type.type)
  })) || [];

  function getColorForSubscriptionType(type) {
    const colors = {
      'Weekly': '#FF6B6B',
      'Monthly': '#4ECDC4',
      'Yearly': '#45B7D1',
      'Lifetime': '#96CEB4',
      'Daily': '#FFEAA7'
    };
    return colors[type] || '#95A5A6';
  }

  // Revenue by payment method pie chart
  const paymentMethodData = analyticsData?.revenueByPayment?.map(payment => ({
    name: payment.modeOfPayment,
    value: payment._sum.amount,
    transactions: payment._count._all
  })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4 mx-auto"></div>
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!telegramData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Telegram channel not found</p>
          <button
            onClick={() => navigate('/app/telegram')}
            className="text-orange-600 hover:text-orange-700"
          >
            Go back to Telegram channels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate('/app/telegram')}
                className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {telegramData.title?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {telegramData.title} Analytics
                </h1>
                <p className="text-orange-100">
                  {telegramData.description} • {telegramData.genre}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/app/edit-telegram?telegramId=${telegramId}`, { state: { data: telegramData } })}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all flex items-center gap-2"
              >
                <span>Edit Channel</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/app/telegram?id=${telegramId}`);
                  toast.success("Share link copied!");
                }}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all"
              >
                Share Channel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="px-6 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Period Selector */}
          <div className="mb-6 flex justify-end">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              {['day', 'week', 'month', 'year'].map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${period === p
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-orange-500'
                    }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Subscribers */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Subscribers</p>
                  <p className="text-2xl font-bold">
                    {analyticsLoading ? "..." : analyticsData?.overallStats?.unique_subscribers || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Active Subscribers */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Subscribers</p>
                  <p className="text-2xl font-bold">
                    {analyticsLoading ? "..." : analyticsData?.overallStats?.active_subscriptions || 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ₹{analyticsLoading ? "..." : (analyticsData?.overallStats?.total_revenue || 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Total Earnings */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Total Earnings</p>
                  <p className="text-2xl font-bold">
                    ₹{analyticsLoading ? "..." : (analyticsData?.overallStats?.total_earnings || 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Trends Chart */}
          {subscriptionTrendsData.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Trends Over Time</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subscriptionTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="subscriptions" fill="#3B82F6" name="New Subscriptions" />
                    <Bar dataKey="active" fill="#10B981" name="Active Subscriptions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Subscription Types Breakdown */}
            {subscriptionTypeData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Types</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subscriptionTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {subscriptionTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {subscriptionTypeData.map((type, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                        <span>{type.name}</span>
                      </div>
                      <span className="font-medium">₹{type.revenue?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {paymentMethodData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Payment Method</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {paymentMethodData.map((method, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: `hsl(${index * 45}, 70%, 50%)` }}
                        ></div>
                        <span>{method.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{method.value?.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{method.transactions} transactions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Top Subscribers */}
          {analyticsData?.topSubscribers && analyticsData.topSubscribers.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Subscribers</h3>
              <div className="space-y-3">
                {analyticsData.topSubscribers.slice(0, 10).map((subscriber, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{subscriber.name}</h4>
                        <p className="text-sm text-gray-500">{subscriber.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{subscriber.total_spent?.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{subscriber.subscription_count} subscriptions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!analyticsLoading && (!analyticsData?.overallStats || analyticsData.overallStats.unique_subscribers === 0) && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <BarChart3 className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
              <p className="text-gray-500 mb-6">
                Start getting subscribers to see detailed analytics for this channel.
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/app/telegram?id=${telegramId}`);
                  toast.success("Share link copied!");
                }}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Share Your Channel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelegramAnalyticsPage;