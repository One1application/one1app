import React, { useState, useEffect } from 'react';
import { TrashIcon, PencilIcon, PlusIcon } from "lucide-react";
import Modal from 'react-modal';
import { createUserApi, deleteUserApi, getUsers, updateUserApi } from '../../services/api-service';
import * as XLSX from 'xlsx';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    name: '',
    goals: '',
    heardAboutUs: '',
    socialMedia: '',
    role: 'User',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers({ page: meta.page, limit: meta.limit, role: roleFilter });
      console.log(response.data);
      setUsers(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [meta.page, roleFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserApi(formData);
      setIsCreateModalOpen(false);
      setFormData({
        email: '',
        phoneNumber: '',
        name: '',
        goals: '',
        heardAboutUs: '',
        socialMedia: '',
        role: 'User',
      });
      fetchUsers();
    } catch (err) {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserApi(selectedUser.id, formData);
      setIsUpdateModalOpen(false);
      setFormData({
        email: '',
        phoneNumber: '',
        name: '',
        goals: '',
        heardAboutUs: '',
        socialMedia: '',
        role: '',
      });
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      phoneNumber: user.phone,
      name: user.name,
      goals: user.goals.join(','),
      heardAboutUs: user.heardAboutUs,
      socialMedia: user.socialMedia,
      role: user.role,
    });
    setIsUpdateModalOpen(true);
  };

  // Export filtered users to Excel
  const exportToExcel = () => {
    // Prepare data for Excel
    const exportData = users.map(user => ({
      Name: user.name,
      Email: user.email,
      Phone: user.phone,
      Role: user.role,
      SocialMedia: user.socialMedia,
      Goals: user.goals.join(', '),
      HeardAboutUs: user.heardAboutUs,
      TotalEarnings: user.wallet.totalEarnings,
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    // Generate and download the Excel file
    XLSX.writeFile(wb, `users_${roleFilter || 'all'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };


  // const handleDeleteUser = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this user?')) {
  //     try {
  //       await deleteUserApi(id);
  //       fetchUsers();
  //     } catch (err) {
  //       setError('Failed to delete user');
  //     }
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add User
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full sm:w-48"
        >
          <option value="">All Roles</option>
          <option value="User">User</option>
          <option value="Creator">Creator</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => openUpdateModal(user)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p>Showing {users.length} of {meta.total} users</p>
        <div className="flex space-x-2">
          <button
            onClick={() => setMeta({ ...meta, page: meta.page - 1 })}
            disabled={meta.page === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setMeta({ ...meta, page: meta.page + 1 })}
            disabled={meta.page === meta.totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        className="w-full max-w-lg mx-auto mt-10 sm:mt-20 bg-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Create User</h2>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Goals (comma-separated)</label>
            <input
              type="text"
              name="goals"
              value={formData.goals}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Heard About Us</label>
            <input
              type="text"
              name="heardAboutUs"
              value={formData.heardAboutUs}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Social Media</label>
            <input
              type="text"
              name="socialMedia"
              value={formData.socialMedia}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="User">User</option>
              <option value="Creator">Creator</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData({
                  email: '',
                  phoneNumber: '',
                  name: '',
                  goals: '',
                  heardAboutUs: '',
                  socialMedia: '',
                  role: '',
                });
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      {/* Update User Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        className="w-full max-w-lg mx-auto mt-10 sm:mt-20 bg-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Update User</h2>
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Goals (comma-separated)</label>
            <input
              type="text"
              name="goals"
              value={formData.goals}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Heard About Us</label>
            <input
              type="text"
              name="heardAboutUs"
              value={formData.heardAboutUs}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Social Media</label>
            <input
              type="text"
              name="socialMedia"
              value={formData.socialMedia}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="User">User</option>
              <option value="Creator">Creator</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsUpdateModalOpen(false);
                setFormData({
                  email: '',
                  phoneNumber: '',
                  name: '',
                  goals: '',
                  heardAboutUs: '',
                  socialMedia: '',
                  role: '',
                });
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Update
            </button>
          </div>
        </form>
      </Modal>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default UsersPage;