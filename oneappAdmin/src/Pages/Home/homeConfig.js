/**
 * 
 * Per Transaction (₹1)
Revenue: ₹1
Commission: ₹1 * 0.08 = ₹0.08
Spend: ₹0.08 * 0.0195 = ₹0.00156
Saving: ₹0.08 - ₹0.00156 = ₹0.07844
GST: ₹0.08 * 0.18 = ₹0.0144

Aggregated for 4 Transactions
Total Revenue: ₹1 * 4 = ₹4
Total Commission: ₹0.08 * 4 = ₹0.32
Total Spend: ₹0.00156 * 4 = ₹0.00624
Total Saving: ₹0.07844 * 4 = ₹0.31376
Total GST: ₹0.0144 * 4 = ₹0.0576
 */

export const dashboardConfig = {
  todaysRevenue: "1010",
  lastUpdated: "25/07/2023 12:30 PM",
  stats: [
    {
      title: "Total Revenue",
      value: "₹12,50,538",
      trend: "positive",
      percentage: "+43.2%",
      description: "From Last Period",
    },
    {
      title: "Total Spend",
      value: "₹12,50,538",
      trend: "negative",
      percentage: "-23.2%",
      description: "From Last Period",
    },
    {
      title: "Total Saving",
      value: "₹12,50,538",
      trend: "positive",
      percentage: "+43.2%",
      description: "From Last Period",
    },
    {
      title: "Total Creators",
      value: "1,225",
      trend: "positive",
      percentage: "+43.2%",
      description: "From Last Period",
    },
    {
      title: "New Creators",
      value: "152",
      trend: "positive",
      percentage: "+43.2%",
      description: "From Last Period",
    },
    {
      title: "Deactive Creators",
      value: "22",
      trend: "negative",
      percentage: "-23.2%",
      description: "From Last Period",
    },
  ],

  leaderboard: {
    today: [
      {
        name: "Aditya Agarwal",
        earnings: "₹4,54,890",
      },
      {
        name: "Sumit Kumar",
        earnings: "₹3,54,890",
      },
      {
        name: "Rahul Singh",
        earnings: "₹3,54,890",
      },
      {
        name: "Priya Sharma",
        earnings: "₹2,00,556",
      },
    ],
    thisWeek: [
      {
        name: "Aditya Agarwal",
        earnings: "₹4,54,890",
      },
      {
        name: "Sumit Kumar",
        earnings: "₹3,54,890",
      },
      {
        name: "Rahul Singh",
        earnings: "₹3,54,890",
      },
      {
        name: "Priya Sharma",
        earnings: "₹2,00,556",
      },
    ],
    thisMonth: [
      {
        name: "Aditya Agarwal",
        earnings: "₹4,54,890",
      },
      {
        name: "Sumit Kumar",
        earnings: "₹3,54,890",
      },
      {
        name: "Rahul Singh",
        earnings: "₹3,54,890",
      },
      {
        name: "Priya Sharma",
        earnings: "₹2,00,556",
      },
    ],
    allTime: [
      {
        name: "Adi Agarwal",
        earnings: "₹4,54,890",
      },
      {
        name: "Sumit Kumar",
        earnings: "₹3,54,890",
      },
      {
        name: "Rahul",
        earnings: "₹3,54,890",
      },
      {
        name: "Priya Sharma",
        earnings: "₹2,00,556",
      },
    ],
  },
  revenueGraph: {
    title: "Revenue",
    revenue: "₹ 2,84,587.36",
    color: "#f97316",
    yDataKey: "earnings",
    earningsData: [
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
    ],
  },
  notifications: [
    {
      title: "New User Joined",
      description: "A new user has joined the platform.",
      timestamp: "2024-06-15 12:30:00",
    },
    {
      title: "Payment Received",
      description: "A payment of ₹5,000 has been processed.",
      timestamp: "2024-06-14 10:30:00",
    },
    {
      title: "Content Milestone",
      description: "Your content reached 10,000 views!",
      timestamp: "2024-06-13 15:45:00",
    },
  ],
};
