import { useState, useEffect, useMemo } from 'react';
import { FaMoneyBill, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import Header from '../../components/Header/Header';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchTransactionsService } from '../../services/api-service';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    dateRange: 'today',
    customStartDate: null,
    customEndDate: null,
    role: 'all',
    search: '',
    userId: '',
    productType: 'all',
    status: 'all'
  });
  const [analytics, setAnalytics] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    totalAmountAfterFee: 0,
    todayTransactions: 0,
    todayAmount: 0,
    todayAmountAfterFee: 0,
    dailyData: []
  });

  const transactionsPerPage = 10;

  // Fetch transactions and analytics
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetchTransactionsService({
        page: currentPage,
        limit: transactionsPerPage,
        dateRange: filters.dateRange,
        startDate: filters.customStartDate?.toISOString(),
        endDate: filters.customEndDate?.toISOString(),
        role: filters.role,
        userId: filters.userId,
        search: filters.search,
        productType: filters.productType,
        status: filters.status
      });
      setTransactions(response.transactions || []);
      setFilteredTransactions(response.transactions || []);
      setTotalPages(response.totalPages || 1);
      setAnalytics(response.analytics || {
        totalTransactions: 0,
        totalAmount: 0,
        totalAmountAfterFee: 0,
        todayTransactions: 0,
        todayAmount: 0,
        todayAmountAfterFee: 0,
        dailyData: []
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch transactions');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, filters]);

  // Chart data for transaction trends
  const chartData = useMemo(() => {
    const labels = analytics.dailyData?.map(data => new Date(data.date).toLocaleDateString()) || [];
    const amounts = analytics.dailyData?.map(data => data.totalAmount) || [];
    const amountsAfterFee = analytics.dailyData?.map(data => data.totalAmountAfterFee) || [];

    return {
      labels,
      datasets: [
        {
          label: 'Transaction Amount',
          data: amounts,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Amount After Fee',
          data: amountsAfterFee,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }
      ]
    };
  }, [analytics]);

  // Filter change handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'dateRange' && value !== 'custom' ? { customStartDate: null, customEndDate: null } : {})
    }));
    setCurrentPage(1);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFilters(prev => ({
      ...prev,
      customStartDate: start,
      customEndDate: end,
      dateRange: 'custom'
    }));
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-full min-h-screen md:px-5 md:py-3 px-2 py-2 bg-gradient-to-b from-gray-100 to-white space-y-3">
      <Header title="Transaction Management" IconComponent={FaMoneyBill} />

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Transactions</h3>
          <p className="text-2xl">{analytics.totalTransactions}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Amount</h3>
          <p className="text-2xl">₹{analytics.totalAmount.toFixed(2)}</p>
          <p className="text-sm text-gray-500">After Fee: ₹{analytics.totalAmountAfterFee.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Today Transactions</h3>
          <p className="text-2xl">{analytics.todayTransactions}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Today Amount</h3>
          <p className="text-2xl">₹{analytics.todayAmount.toFixed(2)}</p>
          <p className="text-sm text-gray-500">After Fee: ₹{analytics.todayAmountAfterFee.toFixed(2)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Trends</h3>
        <Line data={chartData} options={{ responsive: true }} />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium">Date Range</label>
            <select
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          {filters.dateRange === 'custom' && (
            <div className="col-span-2">
              <label className="block text-sm font-medium">Custom Date Range</label>
              <DatePicker
                selectsRange
                startDate={filters.customStartDate}
                endDate={filters.customEndDate}
                onChange={handleDateChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholderText="Select date range"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="all">All</option>
              <option value="User">User</option>
              <option value="Creator">Creator</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Product Type</label>
            <select
              name="productType"
              value={filters.productType}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="all">All</option>
              <option value="WEBINAR">Webinar</option>
              <option value="COURSE">Course</option>
              <option value="PAYINGUP">PayingUp</option>
              <option value="TELEGRAM">Telegram</option>
              <option value="PREMIUMCONTENT">Premium Content</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="all">All</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Search by User ID</label>
            <input
              type="text"
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Enter User ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Search</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Search by Txn ID or Product ID"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Txn ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creator</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount After Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode of Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="11" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="11" className="px-6 py-4 text-center text-red-500">{error}</td></tr>
            ) : filteredTransactions.length === 0 ? (
              <tr><td colSpan="11" className="px-6 py-4 text-center">No transactions found</td></tr>
            ) : (
              filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.txnID || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.buyer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.creator.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.productId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.productType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{transaction.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{transaction.amountAfterFee?.toFixed(2) || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.modeOfPayment}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;