import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  
  Check,
  X,
  ShieldCheck,
} from "lucide-react";

export default function PaymentInterface() {
  // const [selectedPlan, setSelectedPlan] = useState("2000");
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [baseAmount] = useState(2000);

  const [discountAmount, setDiscountAmount] = useState(0);

  const paymentMethods = [
    {
      name: "Visa",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png",
      color: "bg-blue-600",
    },
    {
      name: "Mastercard",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png",
      color: "bg-red-600",
    },
    {
      name: "Google pay",
      icon: "https://cdn.discordapp.com/attachments/1288531236503027724/1374969011506380830/icons8-google-pay-240.png?ex=682ffb2e&is=682ea9ae&hm=6dfc7649c3e91734d2e6debef042ff08155419265c02893498df70e391a28369&",
      color: "bg-blue-500",
    },
    {
      name: "Phone pay",
      icon: "https://cdn.discordapp.com/attachments/1288531236503027724/1374624540864417844/phonepe-icon.png?ex=682f631d&is=682e119d&hm=a2fa1053933a1a86de17e2f541731e199c7c3d5ee2df9d0544ae5306eeaf1ed4&",
      color: "bg-purple-600",
    },
    {
      name: "Paytm",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Paytm_logo.png/640px-Paytm_logo.png",
      color: "bg-blue-400",
    },
    {
      name: "RuPay",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/RuPay.svg/1200px-RuPay.svg.png",
      color: "bg-orange-600",
    },
  ];

  const applyCoupon = () => {
    if (couponCode.trim() !== "") {
      setDiscountAmount(50);
      setDiscountApplied(true);
      setShowCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscountAmount(0);
    setDiscountApplied(false);
  };

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  const closeModal = () => {
    setShowPaymentModal(false);
  };

  const totalAmount = baseAmount - discountAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
      {/* Main Content */}
      <div className="flex items-center justify-center px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl bg-black bg-opacity-60 backdrop-blur-lg rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center p-6 border-b border-gray-700"
          >
            <ArrowLeft className="w-6 h-6 text-white mr-3" />
            <span className="text-white text-lg font-medium">
              Make payment and get access now
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Course Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:w-1/2 p-6 flex flex-col"
            >
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 mb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-purple-500 rounded-full flex items-center justify-center">
                    <div className="text-white text-sm font-bold">
                      <img src="https://cdn.discordapp.com/attachments/1368862317877530684/1373680257604915311/App_Icon__2_-removebg-preview.png?ex=682fe82f&is=682e96af&hm=02e977524d5823772a79d7562cc8453193102de8440d67d4f7e5f8f13ffca8f3&" alt="" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      One1App payment
                    </h3>
                    <p className="text-gray-400 text-sm">By contiks one hub</p>
                  </div>
                </div>
              </div>

              {/* Bottom part of left container */}
              <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 mt-auto">
                {/* Security Badge Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between text-green-400 mb-4"
                >
                  <div className="flex items-center">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span className="text-sm">
                      Guaranteed safe & secure payment
                    </span>
                  </div>
                  <div className="text-xs bg-gray-700 px-2 py-1 rounded text-white flex items-center gap-1">
                    <span>powered by</span>
                    <div className="w-5 h-5 flex items-center justify-center">
                      {typeof paymentMethods[3].icon === "string" ? (
                        <img
                          src={paymentMethods[3].icon}
                          alt="Payment Provider"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        paymentMethods[3].icon
                      )}
                    </div>
                  </div>
                </motion.div>

                <hr className="my-4 border-gray-600" />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap items-center justify-center gap-4"
                >
                  {paymentMethods.map((method, index) => (
                    <motion.div
                      key={method.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-lg p-2 w-10 h-10 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all"
                    >
                      <div className="w-10 h-10 flex items-center justify-center">
                        {typeof method.icon === "string" ? (
                          <img
                            src={method.icon}
                            alt={method.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          method.icon
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Payment Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-1/2 p-6"
            >
              {/* Plan Selection  yo wassup malik */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4 p-1">
                  <span className="text-white text-lg font-medium">
                    Selected Plan
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-blue-400 text-sm hover:text-blue-300 mr-2"
                  >
                    Change plan
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 bg-opacity-50 rounded-xl p-4 flex items-center justify-between"
                >
                  <span className="text-white">2000</span>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-600 px-4 py-2 rounded-lg text-white font-medium"
                  >
                    ₹{baseAmount}
                  </motion.div>
                </motion.div>
              </div>

              {/* Coupon Code */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                {discountApplied ? (
                  <div className="bg-green-900 bg-opacity-30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-green-400">
                        Coupon applied (-₹50)
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-gray-300 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : showCoupon ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden"
                  >
                    <div className="p-4 flex">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-l-lg focus:outline-none"
                      />
                      <button
                        onClick={applyCoupon}
                        className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setShowCoupon(true)}
                    className="w-full bg-gray-800 bg-opacity-50 rounded-xl p-4 flex items-center justify-between text-white hover:bg-opacity-70 transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span>Do you have a coupon code?</span>
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                )}
              </motion.div>

              {/* Price Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 mb-8"
              >
                <div className="flex items-center justify-between text-gray-300">
                  <span>Sub Total</span>
                  <span>₹{baseAmount}.00</span>
                </div>
                {discountApplied && (
                  <div className="flex items-center justify-between text-green-400">
                    <span>Discount</span>
                    <span>-₹{discountAmount}.00</span>
                  </div>
                )}

                <div className="h-px bg-gray-700"></div>
                <div className="flex items-center justify-between text-white text-xl font-semibold">
                  <span>Total</span>
                  <span>₹{totalAmount}.00</span>
                </div>
              </motion.div>

              {/* Pay Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Pay ₹{totalAmount} and start subscription
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                Processing Payment
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <p className="text-gray-300 text-center mb-6">
              We're processing your payment of ₹{totalAmount}. Please wait...
            </p>

            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-gray-300 mb-2">
                <span>Amount:</span>
                <span>₹{baseAmount}.00</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-green-400 mb-2">
                  <span>Discount:</span>
                  <span>-₹{discountAmount}.00</span>
                </div>
              )}

              <div className="h-px bg-gray-600 my-2"></div>
              <div className="flex justify-between text-white font-semibold">
                <span>Total:</span>
                <span>₹{totalAmount}.00</span>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-400">
              <ShieldCheck className="w-4 h-4 mr-2 text-green-400" />
              <span>Your payment is secure and encrypted</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
