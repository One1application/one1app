import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, IdCard, Briefcase, CreditCard, Globe, Target, Ear, Coins, Filter, Search, Wallet, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCreatorDetails, getCreatorWithdrawals, toggleCreatorKycStatus, updateCreatorPersonalDetails, updateWithdrawalStatus } from '../../services/api-service';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
const UserDetailsModal = ({ creatorId, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    socialMedia: '',
    goals: [],
    heardAboutUs: '',
    creatorComission: null
  });
  const [kycForm, setKycForm] = useState({ status: '', rejectionReason: '' });
  const [creatorWithdrawalsDetails, setCreatorWithdrawalsDetails] = useState([]);
  const [withdrawalFilter, setWithdrawalFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'personalInfo', label: 'Personal Info' },
    { id: 'kycDetails', label: 'KYC Details' },
    { id: 'businessInfo', label: 'Business Info' },
    { id: 'bankDetails', label: 'Bank Details' },
    { id: 'withdrawals', label: 'Withdrawals Details' },
    { id: 'wallet', label: 'Wallet' },
  ];

  const fetchCreatorDetails = async () => {
    setLoading(true);
    try {
      const data = await getCreatorDetails(creatorId);
      const withdrawalsDetails = await getCreatorWithdrawals(creatorId);
      setCreatorWithdrawalsDetails(withdrawalsDetails.withdrawalsDetails);
      setCreator(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        socialMedia: data.socialMedia || '',
        goals: data.goals || [],
        heardAboutUs: data.heardAboutUs || '',
        creatorComission: data.creatorComission
      });
      setKycForm({
        status: data.kycRecords?.status || 'PENDING',
        rejectionReason: data.kycRecords?.rejectionReason || '',
      });
    } catch (err) {
      setError('Failed to fetch creator details');
      console.error('Error fetching creator details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCreatorDetails();
    }
  }, [isOpen, creatorId]);

  const handleKycUpdate = async () => {
    try {
      await toggleCreatorKycStatus(creatorId, kycForm);
      await fetchCreatorDetails();
      onUpdate();
      toast.success('KYC status updated successfully');
    } catch (err) {
      toast.error('Failed to update KYC status');
      console.error('Error updating KYC status:', err);
    }
  };

  const handlePersonalUpdate = async () => {
    try {
      await updateCreatorPersonalDetails(creatorId, formData);
      await fetchCreatorDetails();
      setIsEditing(false);
      onUpdate();
      toast.success('Personal details updated successfully');
    } catch (err) {
      toast.error('Failed to update personal details');
      console.error('Error updating personal details:', err);
    }
  };

  const handleWithdrawalStatusUpdate = async (withdrawalId, status, failedReason = '') => {
    try {
      await updateWithdrawalStatus(withdrawalId, status, failedReason);
      await fetchCreatorDetails();
      toast.success('Withdrawal status updated successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update withdrawal status');
      console.error('Error updating withdrawal status:', err);
    }
  };

  const renderAvatar = () => {
    if (!creator) return null;
    const initials = creator.name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="w-32 h-32 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold shadow-lg mx-auto">
        {initials}
      </div>
    );
  };

  const renderKycBadge = () => {
    if (!creator) return null;
    const statusColors = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };

    const color = statusColors[creator.kycRecords?.status?.toLowerCase()] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${color}`}>
        {creator.kycRecords?.status || 'Unknown'}
      </span>
    );
  };

  const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-start justify-between gap-3 flex-col md:flex-row py-3 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className=" text-sm text-gray-800 break-all">
        {typeof value === 'string' && value.startsWith('http') && label.includes('Card') ? (
          <a href={value} target="_blank" rel="noopener noreferrer">
            <img src={value} alt={label} className="w-24 h-auto rounded-md hover:scale-105 transition-transform" />
          </a>
        ) : typeof value === 'string' && value.startsWith('http') ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {value}
          </a>
        ) : (
          value || 'N/A'
        )}
      </div>
    </div>
  );

  const WithdrawalCard = ({ withdrawal }) => {
    const [status, setStatus] = useState(withdrawal.status);
    const [failedReason, setFailedReason] = useState(withdrawal.failedReason || '');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async () => {
      setIsUpdating(true);
      await handleWithdrawalStatusUpdate(withdrawal.id, status, status === 'FAILED' ? failedReason : '');
      setIsUpdating(false);
    };

    const statusColors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      SUCCESS: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Withdrawal ID</p>
            <p className="text-sm font-medium">{withdrawal.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Amount</p>
            <p className="text-sm font-medium">₹{withdrawal.amount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mode</p>
            <p className="text-sm font-medium">{withdrawal.modeOfWithdrawal}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="text-sm font-medium">{new Date(withdrawal.createdAt).toLocaleDateString()}</p>
          </div>
          {withdrawal.modeOfWithdrawal === 'bank' && withdrawal.bankDetails && (
            <>
              <div>
                <p className="text-sm text-gray-600">Account Holder</p>
                <p className="text-sm font-medium">{withdrawal.bankDetails.accountHolderName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Number</p>
                <p className="text-sm font-medium">{withdrawal.bankDetails.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">IFSC Code</p>
                <p className="text-sm font-medium">{withdrawal.bankDetails.ifscCode}</p>
              </div>
            </>
          )}
          {withdrawal.modeOfWithdrawal === 'upi' && withdrawal.upi && (
            <div>
              <p className="text-sm text-gray-600">UPI ID</p>
              <p className="text-sm font-medium">{withdrawal.upi.upiId}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[withdrawal.status]}`}>
              {withdrawal.status}
            </span>
          </div>
        </div>
        {withdrawal.status === 'PENDING' && (
          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-medium mb-2">Update Status</p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-2"
              disabled={isUpdating}
            >
              <option value="PENDING">Pending</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
            </select>
            {status === 'FAILED' && (
              <textarea
                value={failedReason}
                onChange={(e) => setFailedReason(e.target.value)}
                placeholder="Enter reason for failure"
                className="w-full px-3 py-2 border rounded-lg mb-2"
                rows="3"
                disabled={isUpdating}
              />
            )}
            <button
              onClick={handleStatusChange}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg text-white ${isUpdating ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        )}
        {withdrawal.status === 'FAILED' && withdrawal.failedReason && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Failed Reason</p>
            <p className="text-sm text-red-600">{withdrawal.failedReason}</p>
          </div>
        )}
      </div>
    );
  };

  const filteredWithdrawals = creatorWithdrawalsDetails.filter((withdrawal) => {
    const matchesStatus = withdrawalFilter === 'ALL' || withdrawal.status === withdrawalFilter;
    const matchesSearch = withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (withdrawal.bankDetails?.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (withdrawal.upi?.upiId?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const renderTabContent = () => {
    if (!creator) return <div className="w-full h-full flex items-center justify-center text-gray-500">Loading...</div>;

    switch (activeTab) {
      case 'personalInfo':
        return isEditing ? (
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm text-gray-600 font-medium">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 font-medium">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 font-medium">Social Media</label>
              <input
                type="text"
                value={formData.socialMedia}
                onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 font-medium">Goals (comma-separated)</label>
              <input
                type="text"
                value={formData.goals.join(',')}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value.split(',').map((g) => g.trim()) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 font-medium">Heard About Us</label>
              <input
                type="text"
                value={formData.heardAboutUs}
                onChange={(e) => setFormData({ ...formData, heardAboutUs: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 font-medium">CreatorComission</label>
              <input
                type="number"
                value={formData.creatorComission}
                onChange={(e) => setFormData({ ...formData, creatorComission: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePersonalUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <DetailRow
              icon={<User className="text-blue-500" size={20} />}
              label="Creator ID"
              value={creator.id}
            />
            <DetailRow
              icon={<User className="text-blue-500" size={20} />}
              label="Full Name"
              value={creator.name}
            />
            <DetailRow
              icon={<Mail className="text-green-500" size={20} />}
              label="Email Address"
              value={creator.email}
            />
            <DetailRow
              icon={<Phone className="text-purple-500" size={20} />}
              label="Mobile Number"
              value={creator.phone}
            />
            <DetailRow
              icon={<Globe className="text-teal-500" size={20} />}
              label="Social Media"
              value={creator.socialMedia}
            />
            <DetailRow
              icon={<Target className="text-orange-500" size={20} />}
              label="Goals"
              value={creator.goals?.join(', ')}
            />
            <DetailRow
              icon={<Ear className="text-pink-500" size={20} />}
              label="Heard About Us"
              value={creator.heardAboutUs}
            />
            <DetailRow
              icon={<Coins className="text-black" size={20} />}
              label="Creator Comission"
              value={creator.creatorComission}
            />
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit Details
              </button>
            </div>
          </div>
        );

      case 'kycDetails':
        return creator.hasKyc ? (
          <div className="p-6 bg-gray-50 rounded-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow
                icon={<IdCard className="text-teal-500" size={20} />}
                label="KYC Status"
                value={creator?.kycRecords?.status}
              />
              <DetailRow
                icon={<IdCard className="text-teal-500" size={20} />}
                label="Aadhaar Number"
                value={creator?.kycRecords?.aadhaarNumber}
              />
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow
                  icon={<IdCard className="text-teal-500" size={20} />}
                  label="Aadhaar Front Card"
                  value={creator?.kycRecords?.aadhaarFront}
                />
                <DetailRow
                  icon={<IdCard className="text-teal-500" size={20} />}
                  label="Aadhaar Back Card"
                  value={creator?.kycRecords?.aadhaarBack}
                />
                <DetailRow
                  icon={<IdCard className="text-teal-500" size={20} />}
                  label="PAN Card"
                  value={creator?.kycRecords?.panCard}
                />
                <DetailRow
                  icon={<IdCard className="text-teal-500" size={20} />}
                  label="Selfie Card"
                  value={creator?.kycRecords?.selfie}
                />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Social Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(creator?.kycRecords?.socialMedia || {}).map(([platform, link]) => (
                  link && (
                    <DetailRow
                      key={platform}
                      icon={<IdCard className="text-teal-500" size={20} />}
                      label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                      value={link}
                    />
                  )
                ))}
              </div>
            </div>
            {creator?.kycRecords?.rejectionReason && (
              <DetailRow
                icon={<IdCard className="text-teal-500" size={20} />}
                label="Rejection Reason"
                value={creator?.kycRecords.rejectionReason}
              />
            )}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Update KYC Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 font-medium mb-1">KYC Status</label>
                  <select
                    value={kycForm.status}
                    onChange={(e) => setKycForm({ ...kycForm, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                {kycForm.status === 'REJECTED' && (
                  <div>
                    <label className="block text-sm text-gray-600 font-medium mb-1">Rejection Reason</label>
                    <textarea
                      value={kycForm.rejectionReason}
                      onChange={(e) => setKycForm({ ...kycForm, rejectionReason: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      rows="4"
                      placeholder="Enter reason for rejection"
                    />
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={handleKycUpdate}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Update KYC
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No KYC details available for this creator.
          </div>
        );

      case 'businessInfo':
        return creator.hasBusinessInfo ? (
          <div className="p-6 bg-gray-50 rounded-lg">
            <DetailRow
              icon={<Briefcase className="text-orange-500" size={20} />}
              label="First Name"
              value={creator.businessInfo?.firstName}
            />
            <DetailRow
              icon={<Briefcase className="text-orange-500" size={20} />}
              label="Last Name"
              value={creator.businessInfo?.lastName}
            />
            <DetailRow
              icon={<Briefcase className="text-orange-500" size={20} />}
              label="Business Structure"
              value={creator.businessInfo?.businessStructure}
            />
            <DetailRow
              icon={<Briefcase className="text-orange-500" size={20} />}
              label="GST Number"
              value={creator.businessInfo?.gstNumber}
            />
            <DetailRow
              icon={<Briefcase className="text-orange-500" size={20} />}
              label="SEBI Number"
              value={creator.businessInfo?.sebiNumber}
            />
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No business information available for this creator.
          </div>
        );

      case 'bankDetails':
        return creator.hasBankDetails ? (
          <div className="p-6 rounded-lg flex flex-col gap-4">
            <h2 className='uppercase font-bold text-3xl text-black my-3'>CREATOR BANK ACCOUNTS</h2>
            {creator.BankAccounts?.map((bank) => (
              <div key={bank.id} className="mb-4 pb-4 bg-gray-50 px-2">
                <DetailRow
                  icon={<CreditCard className="text-purple-500" size={20} />}
                  label="Account Holder Name"
                  value={bank.accountHolderName}
                />
                <DetailRow
                  icon={<CreditCard className="text-purple-500" size={20} />}
                  label="Account Number"
                  value={bank.accountNumber}
                />
                <DetailRow
                  icon={<CreditCard className="text-purple-500" size={20} />}
                  label="IFSC Code"
                  value={bank.ifscCode}
                />
                <DetailRow
                  icon={<CreditCard className="text-purple-500" size={20} />}
                  label="Primary"
                  value={bank.primary ? 'Yes' : 'No'}
                />
              </div>
            ))}
            <h2 className='uppercase font-bold text-3xl text-black my-3'>Creator UPI IDS</h2>
            {creator.upiIds?.map((upi) => (
              <div key={upi.id} className="mb-4 px-3 bg-gray-50">
                <DetailRow
                  icon={<CreditCard className="text-purple-500" size={20} />}
                  label="UPI ID"
                  value={upi.upiId}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No bank details or UPI IDs available for this creator.
          </div>
        );

      case 'withdrawals':
        return (
          <div className="p-3">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Withdrawal Details</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex items-center gap-2 flex-1">
                <Search className="text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search by ID, Account Number, or UPI ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-500" size={20} />
                <select
                  value={withdrawalFilter}
                  onChange={(e) => setWithdrawalFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
            </div>
            {filteredWithdrawals.length > 0 ? (
              filteredWithdrawals.map((withdrawal) => (
                <WithdrawalCard key={withdrawal.id} withdrawal={withdrawal} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No withdrawals found matching the current filters.
              </div>
            )}
          </div>
        );

      case 'wallet':
        return creator.hasWallet ? (
          <div className="p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Wallet Details</h2>
            <div className="grid grid-cols-1  gap-6">
              <DetailRow
                icon={<Wallet className="text-green-500" size={20} />}
                label="Wallet ID"
                value={creator.wallet.id}
              />
              <DetailRow
                icon={<Coins className="text-yellow-500" size={20} />}
                label="Balance"
                value={`₹${creator.wallet.balance.toFixed(2)}`}
              />
              <DetailRow
                icon={<Coins className="text-yellow-500" size={20} />}
                label="Total Earnings"
                value={`₹${creator.wallet.totalEarnings.toFixed(2)}`}
              />
              <DetailRow
                icon={<Coins className="text-yellow-500" size={20} />}
                label="Total Withdrawals"
                value={`₹${creator.wallet.totalWithdrawals.toFixed(2)}`}
              />
              <DetailRow
                icon={<IdCard className="text-blue-500" size={20} />}
                label="KYC Verified"
                value={
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${creator.wallet.isKycVerified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {creator.wallet.isKycVerified ? 'Verified' : 'Unverified'}
                  </span>
                }
              />
              <DetailRow
                icon={<Clock className="text-gray-500" size={20} />}
                label="Created At"
                value={format(new Date(creator.wallet.createdAt), 'MMM dd, yyyy HH:mm')}
              />
              <DetailRow
                icon={<Clock className="text-gray-500" size={20} />}
                label="Updated At"
                value={format(new Date(creator.wallet.updatedAt), 'MMM dd, yyyy HH:mm')}
              />
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No wallet details available for this creator.
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto  relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
        >
          <X size={24} />
        </button>
        <div className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white p-6 rounded-t-2xl">
          <div className="mb-4">{renderAvatar()}</div>
          <h2 className="text-2xl font-bold text-center mt-4">{creator?.name}</h2>
          <div className="flex justify-center mt-2">{renderKycBadge()}</div>
        </div>
        <div className="border-b flex justify-between bg-gray-50 max-w-5xl overflow-x-scroll md:overflow-x-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center mx-5 md:mx-3 font-semibold ${activeTab === tab.id
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-orange-500'
                } transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">{renderTabContent()}</div>

      </motion.div>
    </div>
  );
};

export default UserDetailsModal;