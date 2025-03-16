/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Users, UserCheck, Clock, Search, UserX } from "lucide-react";
import StatsCard from "../../components/Cards/StatsCard";
import UserCard from "../../components/Cards/UserCard";
import { reportConfig } from "./reportConfig";
import { FaUsers } from "react-icons/fa";
import UserDetailsModal from '../../components/Modal/UserDetailsModal';
import EditUserModal from '../../components/Modal/EditUserModal';
import { Pagination } from '@mui/material';

const ReportPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [kycFilter, setKycFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(reportConfig);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8; // Adjust the number of cards per page as needed

  useEffect(() => {
    // Filter users based on search and filters
    const filtered = reportConfig.filter((user) => {
      const name = user.name || "";
      const email = user.email || "";
      const mobile = user.mobile || "";
      const kycStatus = user.kycStatus || "";
      const status = user.status || "";

      const matchesSearch =
        !searchTerm ||
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mobile.includes(searchTerm);

      const matchesKyc = !kycFilter || kycStatus === kycFilter;
      const matchesStatus = !statusFilter || status === statusFilter;

      return matchesSearch && matchesKyc && matchesStatus;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to the first page when filters change
  }, [searchTerm, kycFilter, statusFilter]);

  // Paginate the filtered users
  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalUsers = reportConfig.length;
  const totalActiveUsers = reportConfig.filter((user) => user.status === "Active").length;
  const totalInactiveUsers = reportConfig.filter((user) => user.status === "Inactive").length;
  const verifiedUsers = reportConfig.filter((user) => user.kycStatus === "Verified").length;
  const pendingUsers = reportConfig.filter((user) => user.kycStatus === "Pending").length;

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setKycFilter("");
    setStatusFilter("");
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleSaveUser = (updatedUser) => {
    const updatedUsers = reportConfig.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    console.log("Saving updated user:", updatedUser);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleCloseEditModal = () => {
    setEditingUser(null);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex justify-center items-center gap-3">
            <FaUsers className="md:size-8 size-6" />
            <h1 className="text-2xl font-bold text-gray-800">User Reports</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="w-full md:w-64">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* KYC Filter Dropdown */}
            <div className="w-full md:w-48">
              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All KYC Status</option>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Status Filter Dropdown */}
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Reset Filters Button */}
            {(searchTerm || kycFilter || statusFilter) && (
              <button
                onClick={resetFilters}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Users"
            value={totalUsers}
            icon={<Users className="text-blue-600" size={24} />}
            color="bg-blue-50"
          />
          <StatsCard
            title="Verified Users"
            value={verifiedUsers}
            icon={<UserCheck className="text-green-600" size={24} />}
            color="bg-green-50"
          />
          <StatsCard
            title="Pending Verification"
            value={pendingUsers}
            icon={<Clock className="text-yellow-600" size={24} />}
            color="bg-yellow-50"
          />
          <StatsCard
            title="Active Users"
            value={totalActiveUsers}
            icon={<Users className="text-green-600" size={24} />}
            color="bg-green-50"
          />
          <StatsCard
            title="Inactive Users"
            value={totalInactiveUsers}
            icon={<UserX className="text-red-600" size={24} />}
            color="bg-red-50"
          />
        </div>

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentUsers.length > 0 ? (
            currentUsers.map((user, index) => (
              <UserCard
                key={index}
                user={user}
                onView={() => handleViewUser(user)}
                onEdit={() => handleEditUser(user)}
                onDelete={() => console.log(`Delete user: ${user.name}`)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No users found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > rowsPerPage && (
          <div className="mt-6 flex justify-center">
            <Pagination
              count={Math.ceil(filteredUsers.length / rowsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  backgroundColor: "rgb(212 212 212)",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "rgb(234, 88, 12)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgb(234, 88, 12)",
                    color: "#fff",
                  },
                },
              }}
            />
          </div>
        )}

        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            isOpen={!!selectedUser}
            onClose={handleCloseModal}
          />
        )}

        {editingUser && (
          <EditUserModal
            user={editingUser}
            isOpen={!!editingUser}
            onClose={handleCloseEditModal}
            onSave={handleSaveUser}
          />
        )}
      </div>
    </div>
  );
};

export default ReportPage;
