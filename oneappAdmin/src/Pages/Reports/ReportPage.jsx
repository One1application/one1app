import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Search } from 'lucide-react';
import { Pagination } from '@mui/material';
import StatsCard from '../../components/Cards/StatsCard';
import UserCard from '../../components/Cards/UserCard';
import UserDetailsModal from '../../components/Modal/UserDetailsModal';
import FullScreenLoader from '../../components/FullScreenLoader';
import { FaUsers } from 'react-icons/fa';
import { getCreatorReport } from '../../services/api-service';

const ReportPage = () => {
  const [statistics, setStatistics] = useState({
    totalCreators: 0,
    verifiedCreators: 0,
    unverifiedCreators: 0,
  });
  const [creators, setCreators] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState('');
  const [kycStatus, setKycStatus] = useState('');
  const [verifiedStatus, setVerifiedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);

  const fetchCreators = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getCreatorReport({
        page,
        limit: meta.limit,
        search: searchTerm,
        kycStatus,
        verifiedStatus,
      });
      setStatistics(data.statistics);
      setCreators(data.creators.data);
      setMeta(data.creators.meta);
    } catch (err) {
      setError('Failed to fetch creator data');
      console.error('Error fetching creators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [searchTerm, kycStatus, verifiedStatus]);

  const handlePageChange = (event, value) => {
    fetchCreators(value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setKycStatus('');
    setVerifiedStatus('');
  };

  const handleViewCreator = (creator) => {
    setSelectedCreator(creator);
  };

  const handleCloseModal = () => {
    setSelectedCreator(null);
  };

  if (loading) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <FaUsers className="md:size-8 size-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Creator Dashboard</h1>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <select
              value={kycStatus}
              onChange={(e) => setKycStatus(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">All KYC Status</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select
              value={verifiedStatus}
              onChange={(e) => setVerifiedStatus(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="">All Verification Status</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
            {(searchTerm || kycStatus || verifiedStatus) && (
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
            title="Total Creators"
            value={statistics.totalCreators}
            icon={<Users className="text-blue-600" size={24} />}
            color="bg-blue-50"
          />
          <StatsCard
            title="Verified Creators"
            value={statistics.verifiedCreators}
            icon={<UserCheck className="text-green-600" size={24} />}
            color="bg-green-50"
          />
          <StatsCard
            title="Unverified Creators"
            value={statistics.unverifiedCreators}
            icon={<UserX className="text-red-600" size={24} />}
            color="bg-red-50"
          />
          {error && (
            <div className="col-span-3 bg-red-500 text-white px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Creator Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creators.length > 0 ? (
            creators.map((creator) => (
              <UserCard
                key={creator.id}
                user={{
                  creatorId: creator.id,
                  creatorName: creator.name,
                  email: creator.email,
                  mobileNumber: creator.phone,
                  kycStatus: creator.kycStatus,
                  verified: creator.verified,
                }}
                onView={() => handleViewCreator(creator)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">No creators found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              count={meta.totalPages}
              page={meta.page}
              onChange={handlePageChange}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  backgroundColor: 'rgb(212 212 212)',
                  color: '#fff',
                  '&:hover': { backgroundColor: 'rgb(234, 88, 12)' },
                  '&.Mui-selected': { backgroundColor: 'rgb(234, 88, 12)', color: '#fff' },
                },
              }}
            />
          </div>
        )}

        {selectedCreator && (
          <UserDetailsModal
            creatorId={selectedCreator.id}
            isOpen={!!selectedCreator}
            onClose={handleCloseModal}
            onUpdate={() => fetchCreators(meta.page)}
          />
        )}
      </div>
    </div>
  );
};

export default ReportPage;