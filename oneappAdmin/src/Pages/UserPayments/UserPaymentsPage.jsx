import { useState, useEffect, useCallback } from 'react';
import { HiOutlineCash } from 'react-icons/hi';
import { Filter, Search, SortAsc, SortDesc } from 'lucide-react';
import Header from '../../components/Header/Header';
import { userPaymentConfig } from './userPaymentConfig';
import { getPaymentsApiService } from '../../services/api-service';
import { format } from 'date-fns';

const UserPaymentsPage = () => {
  const { title, tableHeader } = userPaymentConfig;
  const [payments, setPayments] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    productType: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPaymentsApiService({
        page: meta.page,
        limit: meta.limit,
        ...filters,
      });
      setPayments(response.data);
      setMeta(response.meta);
    } catch (error) {
      setError('Failed to fetch payments. Please try again.');
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, filters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setMeta((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setMeta((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (key) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: key,
      sortOrder: prev.sortBy === key && prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
  };

  const statusOptions = ['', 'COMPLETED', 'PENDING', 'FAILED'];
  const productTypeOptions = ['', 'WEBINAR', 'COURSE', 'PAYING_UP', 'TELEGRAM'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white px-4 py-3 md:px-6 md:py-4 space-y-6">
      <Header title="User Payments" IconComponent={HiOutlineCash} />

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Search className="text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search by ID, Product ID, Name, or Email"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500" size={20} />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option || 'All Statuses'}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500" size={20} />
            <select
              value={filters.productType}
              onChange={(e) => handleFilterChange('productType', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {productTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option || 'All Product Types'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* No Data State */}
      {!loading && !error && payments.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No payments found.</p>
        </div>
      )}

      {/* Payments Table */}
      {payments.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {tableHeader.map((header) => (
                  <th
                    key={header.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort(header.key)}
                  >
                    <div className="flex items-center gap-2">
                      {header.label}
                      {filters.sortBy === header.key && (
                        filters.sortOrder === 'asc' ? (
                          <SortAsc size={16} />
                        ) : (
                          <SortDesc size={16} />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6">
                    {payment.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6">
                    {payment.productId}...
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6">
                    {payment.buyerName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6">
                    {payment.buyerEmail}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6">
                    {payment.creatorName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6">
                    {payment.creatorEmail}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6">
                    ₹{payment.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6">
                    {payment.productType}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm md:px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6">
                    {payment.modeOfPayment}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6">
                    {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">
            Showing {(meta.page - 1) * meta.limit + 1} to{' '}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} payments
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page === meta.totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPaymentsPage;