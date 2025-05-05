import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import { HiOutlineCash } from "react-icons/hi";
import { userPaymentConfig } from "./userPaymentConfig";
import { getPaymentsApiService } from "../../services/api-service";

const UserPaymentsPage = () => {
  const { title, tableHeader, config } = userPaymentConfig;
  const [payments, setPayments] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayments = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPaymentsApiService({ page, limit });
      setPayments(response.data);
      setMeta(response.meta);
    } catch (error) {
      setError("Failed to fetch payments. Please try again.");
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(meta.page, meta.limit);
  }, [meta.page, meta.limit]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setMeta((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white px-4 py-3 md:px-6 md:py-4 space-y-4">
      <Header title="User Payments" IconComponent={HiOutlineCash} />

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && payments.length === 0 && (
        <p className="text-center text-gray-600">No payments found.</p>
      )}

      {payments.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {tableHeader.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {tableHeader.map((header, idx) => (
                    <td
                      key={idx}
                      className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6"
                    >
                      {payment[header.key] || "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {(meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} payments
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page === 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page === meta.totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300"
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