import { useState, useEffect } from "react";
import { RiAdminFill } from "react-icons/ri";
import Header from "../../components/Header/Header";
import { adminAccessConfig } from "./adminAccessConfig";
import { getAdminApiService, createAdminApiService, updateAdminApiService, deleteAdminApiService } from "../../services/api-service";
import AdminModal from "../../components/Modal/AdminModal";

const AdminAccessPage = () => {
  const { title, buttonTitle, tableHeader } = adminAccessConfig;
  const [admins, setAdmins] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const fetchAdmins = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminApiService({ page, limit });
      setAdmins(response.data);
      setMeta(response.meta);
    } catch (error) {
      setError("Failed to fetch admins. Please try again.");
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(meta.page, meta.limit);
  }, [meta.page, meta.limit]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setMeta((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleCreateAdmin = async (adminData) => {
    try {
      await createAdminApiService(adminData);
      setIsModalOpen(false);
      fetchAdmins(meta.page, meta.limit);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create admin.");
    }
  };

  const handleEditAdmin = async (adminData) => {
    try {
      await updateAdminApiService(selectedAdmin.id, adminData);
      setIsModalOpen(false);
      setSelectedAdmin(null);
      fetchAdmins(meta.page, meta.limit);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update admin.");
    }
  };

  const handleDeleteAdmin = async (id, role) => {
    if (role === "SuperAdmin") {
      setError("SuperAdmin cannot be deleted.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await deleteAdminApiService(id);
        fetchAdmins(meta.page, meta.limit);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete admin.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white px-4 py-3 md:px-6 md:py-4 space-y-4">
      <Header title={title} IconComponent={RiAdminFill} />
      <div className="flex justify-end">
        <button
          onClick={() => {
            setSelectedAdmin(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {buttonTitle}
        </button>
      </div>

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && admins.length === 0 && (
        <p className="text-center text-gray-600">No admins found.</p>
      )}

      {admins.length > 0 && (
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  {tableHeader.map((header, idx) => (
                    <td
                      key={idx}
                      className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 md:px-6"
                    >
                      {admin[header.key] || "N/A"}
                    </td>
                  ))}
                  <td className="px-4 py-4 whitespace-nowrap text-sm md:px-6">
                    <button
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAdmin(admin.id, admin.role)}
                      className={`text-red-600 hover:text-red-800 ${admin.role === "SuperAdmin" ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={admin.role === "SuperAdmin"}
                    >
                      Delete
                    </button>
                  </td>
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
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} admins
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

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAdmin(null);
        }}
        onSubmit={selectedAdmin ? handleEditAdmin : handleCreateAdmin}
        initialData={selectedAdmin}
      />
    </div>
  );
};

export default AdminAccessPage;