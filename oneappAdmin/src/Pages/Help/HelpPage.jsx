import Header from "../../components/Header/Header";
import { FaHandsHelping } from "react-icons/fa";
import {
  getallQueries,
  toggleQueryStatus,
} from "../../services/api-service.js";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { format } from "timeago.js";
import { toast } from "react-toastify";

// todo : add pagination
// websockets
// fix dialog box toggle button for now it's working but it should be fixed

const HelpPage = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchQueries() {
      try {
        const res = await getallQueries();
        setQueries(res.data?.data || []);
      } catch (error) {
        toast.error("Failed to fetch queries");
      } finally {
        setLoading(false);
      }
    }
    fetchQueries();
  }, []);

  const filteredQueries = queries.filter((query) => {
    const matchesFilter = filter === "All" || query.status === filter;
    const matchesSearch =
      query.id.toString().includes(search) ||
      query.phone?.toLowerCase().includes(search.toLowerCase()) ||
      query.query?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openQueryDialog = (query) => {
    setSelectedQuery(query);
    setIsDialogOpen(true);
  };

  const csvData = filteredQueries.map((q) => ({
    ID: q.id,
    Phone: q.phone,
    Date: new Date(q.createdAt).toLocaleString(),
    Query: q.query,
    Status: q.status,
    Images: q.images?.join(" | ") || "No Images",
  }));

  const handleToggleStatus = async (id) => {
    try {
      const { success, data, message } = await toggleQueryStatus(id);
      if (success) {
        const updatedQuery = data;
        toast.success(message);

        setQueries((prev) =>
          prev.map((q) =>
            q.id === id ? { ...q, status: updatedQuery.status } : q
          )
        );

        if (selectedQuery && selectedQuery.id === id) {
          setSelectedQuery((prev) =>
            prev ? { ...prev, status: updatedQuery.status } : prev
          );
        }
      }
    } catch (error) {
      toast.error("Failed to toggle query status");
    }
  };

  const allCount = queries.length;
  const pendingCount = queries.filter((q) => q.status === "Pending").length;
  const resolvedCount = queries.filter((q) => q.status === "Resolved").length;

  return (
    <div className="max-w-full min-h-screen px-4 py-6 bg-gray-900 space-y-6 text-gray-100">
      <div className="mb-6 flex items-center flex-col justify-center">
        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight 
          bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-400 
          bg-clip-text text-transparent flex items-center gap-3"
        >
          <FaHandsHelping className="text-pink-400 drop-shadow-md" />
          Resolution Center
        </h1>
        <p className="mt-2 text-gray-400 text-sm sm:text-base">
          All queries submitted by{" "}
          <span className="text-indigo-400 font-medium">creators</span> in one
          place. Review, manage, and resolve efficiently 🚀
        </p>
      </div>

      {/* Queries Section */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-white">Creator Queries</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Export CSV Button */}
            <CSVLink
              data={csvData}
              filename={`queries_export_${Date.now()}.csv`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              📤 Export CSV
            </CSVLink>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by ID, phone, or query..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              {[
                { label: "All", count: allCount },
                { label: "Pending", count: pendingCount },
                { label: "Resolved", count: resolvedCount },
              ].map((f) => (
                <button
                  key={f.label}
                  onClick={() => setFilter(f.label)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    filter === f.label
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {f.label}{" "}
                  <span className="px-2 py-0.5 text-xs bg-gray-900 rounded-full">
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredQueries.length === 0 ? (
          <p className="text-center py-8 text-gray-400">No queries found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  {[
                    "ID",
                    "Name",
                    "Phone",
                    "Date",
                    "Query Preview",
                    "Status",
                    "Actions",
                    "Timeago",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredQueries.map((query) => (
                  <tr
                    key={query.id}
                    className="hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => openQueryDialog(query)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {query.id.slice(0, 10) + "..."}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {query?.user?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {query.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {new Date(query.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 line-clamp-1">
                      {query.query}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          query.status === "Pending"
                            ? "bg-amber-900 text-amber-300"
                            : "bg-green-900 text-green-300"
                        }`}
                      >
                        {query.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          query.status === "Pending"
                            ? "bg-green-900 text-green-300 hover:bg-green-800"
                            : "bg-amber-900 text-amber-300 hover:bg-amber-800"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(query.id);
                        }}
                      >
                        {query.status === "Pending" ? "Resolve" : "Reopen"}
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {format(query.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Query Details Dialog */}
      {isDialogOpen && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white">Query Details</h3>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Query Id</p>
                  <p className="text-gray-200">{selectedQuery.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date Submitted</p>
                  <p className="text-gray-200">
                    {new Date(selectedQuery.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Creator's Name</p>
                  <p className="text-gray-200">
                    {selectedQuery.user?.name || "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-gray-200">{selectedQuery.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Query</p>
                  <p className="text-gray-200 whitespace-pre-wrap">
                    {selectedQuery.query}
                  </p>
                </div>

                {selectedQuery.images?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Attachments</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedQuery.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Attachment ${index + 1}`}
                          className="rounded-lg border border-gray-700 object-cover h-32"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end space-x-3">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(selectedQuery.id);
                  }}
                >
                  {selectedQuery.status === "Pending" ? "Resolve" : "Reopen"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpPage;
