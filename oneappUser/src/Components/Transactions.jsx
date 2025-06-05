import React from "react";
import { motion } from "framer-motion";
import { Calendar, CreditCard, CheckCircle, DollarSign } from "lucide-react";

const Transactions = ({ transactions }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-900/50 text-green-400";
      case "PENDING":
        return "bg-yellow-900/50 text-yellow-400";
      case "FAILED":
        return "bg-red-900/50 text-red-400";
      default:
        return "bg-gray-700 text-gray-400";
    }
  };

  const getPaymentIcon = (mode) => {
    switch (mode) {
      case "CARD":
        return <CreditCard size={14} className="text-blue-400" />;
      case "UPI":
        return <DollarSign size={14} className="text-purple-400" />;
      case "NET BANKING":
        return <DollarSign size={14} className="text-green-400" />;
      default:
        return <DollarSign size={14} className="text-gray-400" />;
    }
  };

  const getProductTypeColor = (type) => {
    switch (type) {
      case "WEBINAR":
        return "bg-green-900/20 text-green-400";
      case "COURSE":
        return "bg-blue-900/20 text-blue-400";
      case "PAYINGUP":
        return "bg-purple-900/20 text-purple-400 animate-blink";
      default:
        return "bg-gray-700/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-4">
      {transactions?.map((transaction, index) => (
        <motion.div
          key={transaction.transactionId || index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50 p-4 hover:border-indigo-500/30 transition-all"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-medium text-white line-clamp-1">
                {transaction.productTitle || "Unknown Product"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getProductTypeColor(
                    transaction.productType
                  )}`}
                >
                  {transaction.productType || "Unknown"}
                </span>
                 <p className="text-xs text-gray-400 w-full">
             {transaction.paymentId}
              </p>
              </div>
             
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-400">
                ₹{transaction.pricePaid}
              </div>
             
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={12} />
                {formatDate(transaction.createdAt)}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                {getPaymentIcon(transaction.modeOfPayment)}
                {transaction.modeOfPayment}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                  transaction.status
                )}`}
              >
                {transaction.status}
              </span>
            </div>
          </div>
        </motion.div>
      ))}

      {transactions?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700/50">
            <CheckCircle className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-white">
            No transactions yet
          </h3>
          <p className="text-gray-400 mt-1">
            Your transaction history will appear here
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Transactions;
