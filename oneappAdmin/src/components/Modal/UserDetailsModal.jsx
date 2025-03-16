/* eslint-disable react/prop-types */
import {
  X,
  User,
  Mail,
  Phone,
  IdCard,
  CreditCard,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("personalInfo");

  if (!isOpen) return null;

  const tabs = [
    { id: "personalInfo", label: "Personal Info" },
    { id: "accountDetails", label: "Account Details" },
    { id: "incomeDetails", label: "Income Details" },
    { id: "links", label: "Links" },
  ];

  const renderAvatar = () => {
    if (user.image) {
      return (
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden mx-auto">
          <img
            src={user.image}
            alt={user.creatorName}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    const initials = user.creatorName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="w-32 h-32 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold shadow-lg mx-auto">
        {initials}
      </div>
    );
  };

  const renderKycBadge = () => {
    const statusColors = {
      verified: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
    };

    const color =
      statusColors[user.kycStatus?.toLowerCase()] ||
      "bg-gray-100 text-gray-800";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${color}`}
      >
        {user.kycStatus || "Unknown"}
      </span>
    );
  };
  const renderActiveBadge = () => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
    };

    const color =
      statusColors[user.status?.toLowerCase()] || "bg-gray-100 text-gray-800";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${color}`}
      >
        {user.status || "Unknown"}
      </span>
    );
  };

  const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-center border-b border-gray-100 py-3 px-4">
      {icon}
      <div className="ml-4">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value || "N/A"}</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "personalInfo":
        return (
          <div>
            <DetailRow
              icon={<User className="text-blue-500" size={20} />}
              label="Creator Id"
              value={user.creatorId}
            />
            <DetailRow
              icon={<User className="text-blue-500" size={20} />}
              label="Full Name"
              value={user.creatorName}
            />
            <DetailRow
              icon={<Mail className="text-green-500" size={20} />}
              label="Email Address"
              value={user.email}
            />
            <DetailRow
              icon={<Phone className="text-purple-500" size={20} />}
              label="Mobile Number"
              value={user.mobileNumber}
            />
            <DetailRow
              icon={<IdCard className="text-indigo-500" size={20} />}
              label="KYC Status"
              value={user.kycStatus}
            />
            <DetailRow
              icon={<CreditCard className="text-teal-500" size={20} />}
              label="Account Status"
              value={user.status}
            />
          </div>
        );
      case "accountDetails":
        return (
          <div>
            <DetailRow
              icon={<IdCard className="text-indigo-500" size={20} />}
              label="Account Number"
              value={user.accountNumber}
            />
            <DetailRow
              icon={<CreditCard className="text-teal-500" size={20} />}
              label="IFSC Code"
              value={user.ifscCode}
            />
            <DetailRow
              icon={<FileText className="text-orange-500" size={20} />}
              label="GST Number"
              value={user.gstNumber}
            />
            <DetailRow
              icon={<FileText className="text-orange-500" size={20} />}
              label="Payment Hold"
              value={user.paymentsHold}
            />
          </div>
        );
      case "incomeDetails":
        return (
          <div>
            <DetailRow
              icon={<FileText className="text-orange-500" size={20} />}
              label="Total Amount"
              value={user.totalAmount}
            />
            <DetailRow
              icon={<FileText className="text-orange-500" size={20} />}
              label="Total Revenue"
              value={user.todaysRevenue}
            />
            <DetailRow
              icon={<FileText className="text-orange-500" size={20} />}
              label="Total Amount In Wallet"
              value={user.amountInWallet}
            />
            <DetailRow
              icon={<FileText className="text-orange-500" size={20} />}
              label="Amount Withdrawn"
              value={user.amountWithdrawal}
            />
          </div>
        );
      case "links":
        return (
          <div>
            <DetailRow
              icon={<FileText className="text-orange-500" size={20} />}
              label="Bank Proof"
              value={
                user.bankProof ? (
                  <a
                    href={user.bankProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Bank Proof
                  </a>
                ) : (
                  "N/A"
                )
              }
            />
            <DetailRow
              icon={<FileText className="text-orange-500" size={20} />}
              label="Product Link"
              value={
                user.productsLink ? (
                  <a
                    href={user.productsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Product
                  </a>
                ) : (
                  "N/A"
                )
              }
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative scrollbar-hide"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
        >
          <X size={24} />
        </button>

        {/* Header with Avatar */}
        <div className="bg-gradient-to-r from-orange-500 to-white-600 text-white p-6 rounded-t-2xl">
          <div className="mb-4">{renderAvatar()}</div>
          <h2 className="text-2xl font-bold text-center mt-4">
            {user.creatorName}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex justify-center mt-2">{renderKycBadge()}</div>
            <div className="flex justify-center mt-2">
              {renderActiveBadge()}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b flex justify-between">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center font-semibold ${
                activeTab === tab.id
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">{renderTabContent()}</div>
      </motion.div>
    </div>
  );
};

export default UserDetailsModal;
