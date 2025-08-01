import { Antenna, CreditCard, Wallet, CheckCircle, LayoutDashboard, Shield, Star, Users, TrendingUp, AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProfileImg from '../../../../assets/oneapp.jpeg';
import SigninModal from '../../../../components/Modal/SigninModal';
import SignupModal from '../../../../components/Modal/SignupModal';
import { useAuth } from '../../../../context/AuthContext';
import {
  getTelegramById,
  applyTelegramCoupon,
} from '../../../../services/auth/api.services';
import { getInitials } from '../../../../utils/constants/nameCutter.js';
import PaymentSignUpModel from '../../../../components/Modal/PaymentSignUpModel.jsx';

const TelegramFormPrev = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const telegramId = params.get('id');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isPurchased, setIsPurchased] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const { currentUserId, userDetails } = useAuth();

  const footerLinks = [
    { title: 'Privacy', path: '/publicpolicy' },
    { title: 'Terms', path: '/terms' },
    { title: 'Refund', path: '/refund-cancellation' },
    { title: 'Disclaimer', path: '/disclaimer' },
  ];

  const paymentMethods = [
    {
      name: 'PhonePe',
      icon: 'Wallet',
      color: 'purple-600',
    },
    {
      name: 'GPay',
      icon: 'CreditCard',
      color: 'green-600',
    },
    {
      name: 'Razorpay',
      icon: 'CreditCard',
      color: 'blue-600',
    },
  ];

  const disclaimers = {
    general: 'CosmicFeed Technologies Pvt. Ltd. shall not be held liable for any content or materials published, sold, or distributed by content creators on our associated apps or websites. We do not endorse or take responsibility for the accuracy, legality, or quality of their content. Users must exercise their own judgment and discretion when relying on such content.',
    riskWarning: 'Trading in financial markets involves substantial risks. Past performance is not indicative of future results.',
  };

  const handleAuthError = (error) => {
    if (error?.response?.data?.message === 'Token not found, Access Denied!' || error?.message === 'Token not found, Access Denied!') {
      setShowSignupModal(true);
      return true;
    }
    return false;
  };
  useEffect(() => {
    if (!telegramId) return;

    const fetchTelegramDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getTelegramById(telegramId);
        console.log('Telegram details:', response);

        const telegramData = response.data.payload.telegram;
        setData(telegramData);

        // Check if current user is the creator
        if (currentUserId && telegramData.createdById === currentUserId) {
          setIsCreator(true);
        }

        // Check if user has already purchased any subscription
        // This would come from backend - for now assuming not purchased
        setIsPurchased(false);

      } catch (error) {
        console.error('Error while fetching telegram details:', error);
        if (!handleAuthError(error)) {
          toast.error('Failed to load telegram details. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTelegramDetails();
  }, [telegramId, currentUserId]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (!currentUserId) {
      setShowSignupModal(true);
      return;
    }

    if (!selectedPlan) {
      toast.error('Please select a subscription plan first');
      return;
    }

    try {
      setIsApplyingCoupon(true);
      const response = await applyTelegramCoupon({
        telegramId: data.id,
        couponCode: couponCode.trim(),
        subscriptionId: selectedPlan.id
      });

      if (response.data.success) {
        const couponData = {
          ...response.data.payload,
          subscriptionId: selectedPlan.id,
        };
        setAppliedCoupon(couponData);
        toast.success(`Coupon applied! You saved ₹${response.data.payload.discountPrice}`);
        setShowCouponInput(false);
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      const errorMessage = error.response?.data?.message || 'Failed to apply coupon';
      toast.error(errorMessage);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setShowCouponInput(false);
    toast.success('Coupon removed');
  };

  const handlePlanSelection = (plan) => {
    // If there's an applied coupon and it's for a different plan, clear it
    if (appliedCoupon && appliedCoupon.subscriptionId !== plan.id) {
      setAppliedCoupon(null);
      setCouponCode('');
      setShowCouponInput(false);
      toast.info('Coupon cleared - please reapply for this plan');
    }
    setSelectedPlan(plan);
  };

  const calculateFinalAmount = (plan) => {
    if (!appliedCoupon || appliedCoupon.subscriptionId !== plan.id) {
      return plan.price;
    }

    // Use the totalAmount from backend response which is already calculated
    return appliedCoupon.totalAmount;
  };

  const handlePayment = async (plan) => {
    // Check if user is authenticated
    if (!currentUserId) {
      setShowSignupModal(true);
      return;
    }

    // Check if user is trying to buy their own subscription
    if (isCreator) {
      toast.error("You cannot purchase your own Telegram subscription");
      return;
    }

    // Navigate to PaymentInterface with telegram subscription data
    navigate('/app/payment', {
      state: {
        id: data.id,
        title: data.title,
        baseAmount: calculateFinalAmount(plan),
        createdBy: data.createdBy?.name || 'Creator',
        courseType: 'telegram',
        telegramId: data.id,
        subscriptionId: plan.id,
        subscriptionType: plan.type,
        appliedCoupon: appliedCoupon
      }
    });
  };

  const handleSaveEmail = (email) => {
    setUserEmail(email);
    toast.success('Email updated successfully!');
  };

  const handleSuccessfulSignup = (authData) => {
    if (authData.token) {
      localStorage.setItem('AuthToken', authData.token);
      setShowSignupModal(false);
      toast.success('Signup successful!');
      window.location.reload();
    }
  };

  const handleSuccessfulSignIn = (authData) => {
    if (authData.token) {
      localStorage.setItem('AuthToken', authData.token);
      setShowSigninModal(false);
      toast.success('Sign in successful!');
      // Refresh page to update auth state
      window.location.reload();
    }
  };

  const handleSwitchToSignin = () => {
    setShowSignupModal(false);
    setShowSigninModal(true);
  };

  const handleSwitchToSignup = () => {
    setShowSigninModal(false);
    setShowSignupModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Telegram Not Found</h2>
          <p className="text-gray-400">The requested telegram subscription was not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-950 p-8 flex items-center justify-center overflow-hidden">

      <PaymentSignUpModel
        open={showSignupModal}
        handleClose={() => setShowSignupModal(false)}
        onSuccessfulSignup={handleSuccessfulSignup}
        onSwitchToSignin={handleSwitchToSignin}
      />

      <SigninModal
        open={showSigninModal}
        handleClose={() => setShowSigninModal(false)}
        label="Email"
        value={userEmail}
        onSuccessfullLogin={handleSuccessfulSignIn}
        onSave={handleSaveEmail}
        onSwitchToSignup={handleSwitchToSignup}
      />

      {/* Fixed Background Circles */}
      <div className="fixed w-[32rem] h-[30rem] rounded-full bg-orange-600 opacity-80 -left-48 -bottom-20 "></div>
      <div className="fixed w-[32rem] h-[32rem] rounded-full bg-orange-600 opacity-80 -right-48 -top-48"></div>

      {/* Main container with gradient background */}
      <div className="relative w-full max-w-5xl mx-auto bg-gradient-to-br from-gray-300/20 to-gray-500/20 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-6 relative z-10">
          {/* Left Section */}
          <div className="flex-1 bg-gray-900/60 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                {data?.coverImage ? (
                  <img
                    src={data.coverImage}
                    alt={`${data.title}'s cover`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = ProfileImg;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white text-lg font-bold">
                    {getInitials(data.title)}
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-400 text-sm">Telegram Channel</div>
                <div className="text-white font-medium">{data?.title}</div>
              </div>
            </div>

            <div className="space-y-6 ">
              <div>
                <h2 className="text-white text-lg font-semibold mb-4">About the channel</h2>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-800/60 rounded-full text-sm text-gray-300">{data?.genre}</span>
                  <span className="px-3 py-1 bg-gray-800/60 rounded-full text-sm text-orange-400">+ {data?.subscriptions?.length || 0} Plans</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{data?.description || 'Premium telegram channel with exclusive content and updates.'}</p>
              </div>

              {/* Channel Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-800/40 rounded-lg">
                  <Users className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <div className="text-white font-semibold">500+</div>
                  <div className="text-gray-400 text-xs">Members</div>
                </div>
                <div className="text-center p-3 bg-gray-800/40 rounded-lg">
                  <Star className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <div className="text-white font-semibold">4.8</div>
                  <div className="text-gray-400 text-xs">Rating</div>
                </div>
                <div className="text-center p-3 bg-gray-800/40 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <div className="text-white font-semibold">95%</div>
                  <div className="text-gray-400 text-xs">Success</div>
                </div>
              </div>

              <div className="justify-end">
                <h3 className="text-gray-400 font-medium mb-2">Disclaimer</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{disclaimers.general}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-2">{disclaimers.riskWarning}</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:w-[45%] bg-gray-900/60 backdrop-blur-sm rounded-xl p-6">
            <div className="flex justify-center mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Antenna className="w-8 h-8 text-orange-400" />
                </div>
                <h2 className="text-white text-xl font-semibold">{data.title} Subscription</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-gray-400 mb-2 font-medium">Select a plan and continue</div>

              {data?.subscriptions?.map((plan, index) => (
                <div key={index} className="space-y-2">
                  <button
                    className={`w-full p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg flex justify-between items-center hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/20 ${selectedPlan?.id === plan.id ? 'ring-2 ring-orange-300' : ''
                      }`}
                    onClick={() => handlePlanSelection(plan)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">₹{calculateFinalAmount(plan)}</span>
                      <span className="text-xs text-orange-200">{plan?.type}</span>
                    </div>
                    <span className="font-semibold">₹{calculateFinalAmount(plan)}</span>
                  </button>

                  {selectedPlan?.id === plan.id && (
                    <div className="bg-gray-800/40 rounded-lg p-4 space-y-3">
                      {/* Coupon Section */}
                      {appliedCoupon ? (
                        <div className="bg-green-900/30 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm">
                              Coupon applied: {appliedCoupon.couponCode} (-₹{appliedCoupon.discountPrice})
                            </span>
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : showCouponInput ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter coupon code"
                            className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon}
                            className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                          >
                            {isApplyingCoupon ? 'Applying...' : 'Apply'}
                          </button>
                          <button
                            onClick={() => {
                              setShowCouponInput(false);
                              setCouponCode('');
                            }}
                            className="px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCouponInput(true)}
                          className="text-orange-400 text-sm hover:text-orange-300 transition-colors"
                        >
                          Have a coupon code?
                        </button>
                      )}

                      {/* Payment Button */}
                      <button
                        onClick={() => handlePayment(plan)}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300"
                      >
                        Continue to Payment - ₹{calculateFinalAmount(plan)}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="text-sm text-gray-400 mb-4 font-medium">Guaranteed safe & secure payment</div>
              <div className="flex justify-center items-center gap-6">
                {paymentMethods?.map((method, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    <div
                      className={`w-12 h-12 bg-${method.color} rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      {method.icon === 'Wallet' ? <Wallet className="w-6 h-6 text-white" /> : <CreditCard className="w-6 h-6 text-white" />}
                    </div>
                    <span className="text-sm text-gray-400 mt-2 group-hover:text-white transition-colors duration-300">{method?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm font-medium">Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span className="text-gray-400 text-sm font-medium">in Bharat</span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-x-6">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  className="group relative text-sm text-gray-400 hover:text-orange-400 transition-all duration-300 ease-in-out px-2 py-1"
                >
                  <span className="relative">
                    {link.title}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TelegramFormPrev;
