/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const FormInput = ({ label, type = 'text', name, value, onChange, required, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
};

const FormSelect = ({ label, name, value, onChange, options }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value || ''}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const EditUserModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    creatorId: '',
    creatorName: '',
    email: '',
    mobileNumber: '',
    kycStatus: '',
    status: '',
    totalAmount: '',
    todaysRevenue: '',
    amountInWallet: '',
    amountWithdrawal: '',
    accountNumber: '',
    ifscCode: '',
    gstNumber: '',
    bankProof: '',
    productsLink: '',
    paymentsHold: ''
  });

  useEffect(() => {
    if (user) {
      // Spread operator to handle partial user data
      setFormData(prevData => ({
        ...prevData,
        ...user
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh] scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit User Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              label="Creator ID"
              name="creatorId"
              value={formData.creatorId}
              onChange={handleChange}
            />
            <FormInput
              label="Creator Name"
              name="creatorName"
              value={formData.creatorName}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Mobile Number"
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
            
            <FormSelect
              label="KYC Status"
              name="kycStatus"
              value={formData.kycStatus}
              onChange={handleChange}
              options={[
                { value: 'Verified', label: 'Verified' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Rejected', label: 'Rejected' }
              ]}
            />

            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
              ]}
            />

            <FormInput
              label="Total Amount"
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
            />

            <FormInput
              label="Today's Revenue"
              type="number"
              name="todaysRevenue"
              value={formData.todaysRevenue}
              onChange={handleChange}
            />

            <FormInput
              label="Amount in Wallet"
              type="number"
              name="amountInWallet"
              value={formData.amountInWallet}
              onChange={handleChange}
            />

            <FormInput
              label="Amount Withdrawal"
              type="number"
              name="amountWithdrawal"
              value={formData.amountWithdrawal}
              onChange={handleChange}
            />

            <FormInput
              label="Account Number"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
            />

            <FormInput
              label="IFSC Code"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
            />

            <FormInput
              label="GST Number"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
            />

            <FormInput
              label="Bank Proof URL"
              type="url"
              name="bankProof"
              value={formData.bankProof}
              onChange={handleChange}
              placeholder="https://example.com/proof.png"
            />

            <FormInput
              label="Products Link"
              type="url"
              name="productsLink"
              value={formData.productsLink}
              onChange={handleChange}
              placeholder="https://example.com/products"
            />

            <FormInput
              label="Payments Hold"
              type="number"
              name="paymentsHold"
              value={formData.paymentsHold}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;