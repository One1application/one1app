import { motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  applyTelegramCoupon,
  purchaseCourse,
  purchasePayingUp,
  purchasePremiumContent,
  purchaseTelegramSubscription,
  purchaseWebinar,
} from '../services/auth/api.services';

export default function PaymentInterface() {
  // const [selectedPlan, setSelectedPlan] = useState("2000");
  const navigate = useNavigate();
  const location = useLocation();
  const productData = location.state || {};

  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [baseAmount, setBaseAmount] = useState(Math.round(productData.baseAmount) || 0);
  const [productTitle, setProductTitle] = useState(productData.title || 'product');
  const [createdBy, setCreatedBy] = useState(productData.createdBy || 'sumit');
  const [productId, setProductId] = useState(productData.id || '');

  const [courseType, setCourseType] = useState(productData.courseType || '');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [renewalError, setRenewalError] = useState(null);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        // Check if script already exists
        const existingScript = document.getElementById('razorpay-script');
        if (existingScript) {
          existingScript.remove();
        }

        const script = document.createElement('script');
        script.id = 'razorpay-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;

        script.onload = () => {
          setIsRazorpayLoaded(true);
          resolve(true);
        };

        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          setIsRazorpayLoaded(false);
          resolve(false);
        };

        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();

    // Cleanup function
    return () => {
      const script = document.getElementById('razorpay-script');
      if (script) {
        script.remove();
      }
    };
  }, []);
  useEffect(() => {
    if (location.state) {
      setBaseAmount(Math.round(location.state.baseAmount) || 0);

      setProductTitle(location.state.title || 'product');
      setProductId(location.state.id || '');
      setCourseType(location.state.courseType || '');
      setCreatedBy(location.state.createdBy || 'sumit');

      // For telegram, if coupon was already applied in TelegramFormPrev
      if (location.state.courseType === 'telegram' && location.state.appliedCoupon) {
        setCouponCode(location.state.appliedCoupon.couponCode);
        setDiscountAmount(location.state.appliedCoupon.discountPrice || 0);
        setDiscountApplied(true);
      }
    }
  }, [location.state]);

  const paymentMethods = [
    {
      name: 'Visa',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
      color: 'bg-blue-600',
    },
    {
      name: 'Mastercard',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png',
      color: 'bg-red-600',
    },
    {
      name: 'Google pay',
      icon: 'https://toppng.com/uploads/preview/google-pay-gpay-logo-11530962961mwws81tde9.png',
      color: 'bg-blue-500',
    },
    {
      name: 'Phone pay',
      icon: 'https://i.pinimg.com/736x/19/29/17/1929176785bcaf86ef6518447e5f6914.jpg',
      color: 'bg-purple-600',
    },
    {
      name: 'Paytm',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Paytm_logo.png/640px-Paytm_logo.png',
      color: 'bg-blue-400',
    },
    {
      name: 'RuPay',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/RuPay.svg/1200px-RuPay.svg.png',
      color: 'bg-orange-600',
    },
  ];

  const applyCoupon = async () => {
    if (couponCode.trim() === '') {
      toast.error('Please enter a coupon code');
      return;
    }
    setIsVerifyingCoupon(true);
    try {
      let res;
      switch (courseType) {
        case 'course':
          res = await purchaseCourse({
            courseId: productId,
            couponCode,
            validateOnly: true,
          });
          if (res?.data?.success) {
            setDiscountAmount(parseFloat((res.data.payload.discountPrice || 0).toFixed(2)));
            setDiscountApplied(true);
            setShowCoupon(false);
            toast.success('Coupon apllied successfully');
          }
          break;

        case 'webinar':
          res = await purchaseWebinar({
            webinarId: productId,
            couponCode,
            validateOnly: true,
          });
          if (res?.data?.success) {
            setDiscountAmount(parseFloat((res.data.payload.discountPrice || 0).toFixed(2)));
            setDiscountApplied(true);
            setShowCoupon(false);
            toast.success('Coupon apllied successfully');
          }
          break;

        case 'payingUp':
          res = await purchasePayingUp({
            payingUpId: productId,
            couponCode,
            validateOnly: true,
          });
          if (res?.data?.success) {
            setDiscountAmount(parseFloat((res.data.payload.discountPrice || 0).toFixed(2)));
            setDiscountApplied(true);
            setShowCoupon(false);
            toast.success('Coupon apllied successfully');
          }
          break;

        case 'premiumcontent':
          res = await purchasePremiumContent({
            contentId: productId,
            couponCode,
            validateOnly: true,
          });
          if (res?.data?.success) {
            setDiscountAmount(parseFloat((res.data.payload.discountPrice || 0).toFixed(2)));
            setDiscountApplied(true);
            setShowCoupon(false);
            toast.success('Coupon apllied successfully');
          }
          break;

        case 'telegram':
          res = await applyTelegramCoupon({
            telegramId: productData.telegramId || productId,
            subscriptionId: productData.subscriptionId,
            couponCode,
          });
          if (res?.data?.success) {
            setDiscountAmount(parseFloat((res.data.payload.discountPrice || 0).toFixed(2)));
            setDiscountApplied(true);
            setShowCoupon(false);
            toast.success('Coupon applied successfully');
          }
          break;

        case 'telegram':
          res = await applyTelegramCoupon({
            telegramId: productData.telegramId || productId,
            subscriptionId: productData.subscriptionId,
            couponCode,
          });
          if (res?.data?.success) {
            setDiscountAmount(parseFloat((res.data.payload.discountPrice || 0).toFixed(2)));
            setDiscountApplied(true);
            setShowCoupon(false);
            toast.success('Coupon applied successfully');
          }
          break;

        default:
          toast.error('Invalid Product type');
          break;
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(error.response?.data?.message || 'Invalid coupon code');
      setDiscountApplied(false);
    } finally {
      setIsVerifyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
    setDiscountApplied(false);
  };
  console.log('location', location);
  const handlePayment = async () => {
    setShowPaymentModal(true);

    try {
      let res;

      switch (courseType) {
        case 'course':
          res = await purchaseCourse({
            courseId: productId,
            couponCode: discountApplied ? couponCode : null,
          });
          break;

        case 'webinar':
          res = await purchaseWebinar({
            webinarId: productId,
            couponCode: discountApplied ? couponCode : null,
          });
          break;

        case 'payingUp':
          res = await purchasePayingUp({
            payingUpId: productId,
            couponCode: discountApplied ? couponCode : null,
          });
          break;

        case 'premiumcontent':
          res = await purchasePremiumContent({
            contentId: productId,
            couponCode: discountApplied ? couponCode : null,
          });
          break;

        case 'telegram':
          res = await purchaseTelegramSubscription({
            telegramId: productData.telegramId || productId,
            subscriptionId: productData.subscriptionId,
            couponCode: discountApplied ? couponCode : null,
          });
          break;

        default:
          toast.error('Invalid product type');
          throw new Error('Invalid product type');
      }
      console.log('AF', res.data);
      if (res?.data?.success) {
        if (res.data.payload.paymentProvider === 'Phonepay') {
          console.log('RES inside phoenpay', res.data.payload);
          window.location.href = `${res.data.payload.redirectUrl}`;
        } else if (res.data.payload.paymentProvider === 'Razorpay') {
          const options = {
            key: res.data.payload.key, // Replace with your Razorpay key ID
            amount: res.data.payload.amount, // Amount in paise (e.g., 50000 = ₹500)
            currency: 'INR',
            name: 'One App',
            description: 'Purchase Description',

            order_id: res.data.payload.razorpayOrderId, // Received from backend
            handler: function (response) {
              console.log('inside REDIRECT');
              const params = new URLSearchParams();

              // Add only the relevant ID based on courseType

              if (courseType === 'course') params.append('courseId', productId);
              if (courseType === 'payingUp') params.append('payingUpId', productId);
              if (courseType === 'webinar') params.append('webinarId', productId);
              if (courseType === 'premiumcontent') params.append('contentId', productId);

              // Add telegram specific parameters
              if (courseType === 'telegram') {
                params.append('telegramId', productData.telegramId || productId);
                params.append('subscriptionId', productData.subscriptionId);
              }

              // Add payment-related fields only if present
              if (baseAmount) params.append('discountedPrice', baseAmount.toString());
              params.append('paymentProvider', 'Razorpay');

              if (response?.razorpay_signature) {
                params.append('razorpay_signature', response.razorpay_signature);
              }
              if (response?.razorpay_payment_id) {
                params.append('razorpay_payment_id', response.razorpay_payment_id);
              }
              if (response?.razorpay_order_id) {
                params.append('razorpay_order_id', response.razorpay_order_id);
              }
              setShowPaymentModal(false);

              window.location.href = `${res.data.payload.redirectUrl}?${params.toString()}`;
            },
            prefill: {
              name: res.data.payload.customerName || '',
              email: res.data.payload.customerEmail || '',
              contact: res.data.payload.customerPhone || '',
            },

            theme: {
              color: '#3399cc',
            },
          };
          console.log('options', options);
          const rzp = new window.Razorpay(options);
          rzp.open();
        }
      } else {
        toast.error('Payment initialization failed');
        throw new Error('Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);

      // Handle specific error messages from server
      const errorMessage = error.response?.data?.message || 'Failed to initialize payment';

      // Check if it's a subscription renewal validation error
      if (errorMessage.includes('Cannot purchase subscription') && errorMessage.includes('within the last 5 days')) {
        // Set renewal error state for prominent display
        setRenewalError(errorMessage);

        // Also display toast for immediate feedback
        toast.error(errorMessage, {
          duration: 6000, // Show for 6 seconds
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            maxWidth: '500px',
          },
        });
      } else {
        toast.error(errorMessage);
      }

      setShowPaymentModal(false);
    }
  };

  const closeModal = () => {
    setShowPaymentModal(false);
  };

  const goBack = () => {
    navigate(-1);
  };

  const totalAmount = Math.round(baseAmount - discountAmount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 relative overflow-hidden">
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <div className="flex items-center justify-center px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl bg-black bg-opacity-60 backdrop-blur-lg rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center p-6 border-b border-gray-700">
            <ArrowLeft className="w-6 h-6 text-white mr-3" onClick={goBack} />
            <span className="text-white text-lg font-medium">Make payment and get access now</span>
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-purple-500 rounded-full flex items-center justify-center">
                      <div className="text-white text-sm font-bold">
                        <img
                          src="https://cdn.discordapp.com/attachments/1368862317877530684/1373680257604915311/App_Icon__2_-removebg-preview.png?ex=682fe82f&is=682e96af&hm=02e977524d5823772a79d7562cc8453193102de8440d67d4f7e5f8f13ffca8f3&"
                          alt=""
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-gray-300 text-sm">Created by</h3>
                      <p className="text-gray-100 text-md font-semibold pl-2">{createdBy || 'sumit'}</p>
                    </div>
                  </div>

                  <h2 className="text-white text-2xl font-semibold mb-2">{productTitle}</h2>
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
                    <span className="text-sm">Guaranteed safe & secure payment</span>
                  </div>
                  <div className="text-xs bg-gray-700 px-2 py-1 rounded text-white flex items-center gap-1">
                    <span>powered by</span>
                    <div className="w-8 h-8 flex items-center justify-center">
                      {typeof paymentMethods[3].icon === 'string' ? (
                        <img src={paymentMethods[3].icon} alt="Payment Provider" className="w-full h-full object-contain" />
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
                        {typeof method.icon === 'string' ? (
                          <img src={method.icon} alt={method.name} className="w-full h-full object-contain" />
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
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:w-1/2 p-6">
              {/* Plan Selection  yo wassup malik */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4 p-1">
                  <span className="text-white text-lg font-medium">Selected Plan</span>
                  <motion.button onClick={goBack} whileHover={{ scale: 1.05 }} className="text-blue-400 text-sm hover:text-blue-300 mr-2">
                    Change plan
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 bg-opacity-50 rounded-xl p-4 flex items-center justify-between"
                >
                  <span className="text-white">
                    {courseType === 'course' && 'Course'}
                    {courseType === 'webinar' && 'Webinar'}
                    {courseType === 'payingUp' && 'Paying Up'}
                    {courseType === 'premiumcontent' && 'Premium Content'}
                    {courseType === 'telegram' && 'Telegram Subscription'}
                  </span>

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
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
                {discountApplied ? (
                  <div className="bg-green-900 bg-opacity-30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-green-400">Coupon applied (-₹{discountAmount})</span>
                    </div>
                    <button onClick={removeCoupon} className="text-gray-300 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : showCoupon ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
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
                      <button onClick={applyCoupon} className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition-colors">
                        {isVerifyingCoupon ? 'Verifying...' : 'Apply'}
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4 mb-8">
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

              {/* Renewal Error Display */}
              {renewalError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 bg-red-900 bg-opacity-30 border border-red-500 rounded-xl p-4"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <X className="w-5 h-5 text-red-400 mt-0.5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-red-400 font-semibold mb-1">Cannot Purchase Subscription</h4>
                      <p className="text-red-300 text-sm leading-relaxed">{renewalError}</p>
                    </div>
                    <button onClick={() => setRenewalError(null)} className="flex-shrink-0 text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Pay Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: renewalError ? 1 : 1.02 }}
                whileTap={{ scale: renewalError ? 1 : 0.98 }}
                onClick={renewalError ? null : handlePayment}
                disabled={renewalError}
                className={`w-full py-4 rounded-xl text-lg font-semibold transition-all ${
                  renewalError
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                {renewalError ? 'Cannot Purchase' : `Pay ₹${totalAmount} and start subscription`}
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
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Processing Payment</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <p className="text-gray-300 text-center mb-6">We're processing your payment of ₹{totalAmount}. Please wait...</p>

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
