import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const SuccessMessage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0F1418] py-10 px-4">
      <div className="bg-[#1A1D21] p-6 rounded-lg shadow-md w-full max-w-4xl mb-8">
        <div className="text-center">
          <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">
              Request Sent Successfully!
          </h1>
          <p className="text-gray-700 mb-6">
            Your banking information has been submitted successfully.
          </p>
          <Link
            to="/dashboard/wallets"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
