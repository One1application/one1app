/* eslint-disable react/prop-types */

const StepOneVerification = ({ firstName, setFirstName, lastName, setLastName }) => {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-center">Step 1: Basic Details</h1>
        <p className="text-sm text-gray-600 mb-4 text-center">
          We use this information to verify it with your Aadhaar and PAN details. Your oneapp account will use the same info.
        </p>
        <hr className="border-gray-200 mb-4" />
        
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
  
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default StepOneVerification;
  