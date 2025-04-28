// client/src/Pages/Dashboard/DashboardPages/LockedContentPage/LockedContentDisplayPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import * as Icons from "lucide-react";
import { fetchPremiumContentById, purchasePremiumContent, verifyPayment } from "../../../../services/auth/api.services"; // Assuming these functions exist or will be created
import SignupModal from "../../../../components/Modal/SignupModal";
import SigninModal from "../../../../components/Modal/SigninModal";
import { useAuth } from "../../../../context/AuthContext";
import PageFooter from "../PayingUpPage/PageFooter"; // Reusing footer

const LockedContentDisplayPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const contentId = params.get("id");
  const { currentUserId, setCurrentUserId, isAuthLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentVerifying, setIsPaymentVerifying] = useState(false);
  const [lockedContentData, setLockedContentData] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // For signin modal if needed
  const [authActionCompleted, setAuthActionCompleted] = useState(false);

  // --- Authentication Error Handling ---
  const handleAuthError = (error) => {
    const errorMessage = error?.response?.data?.message || error?.message;
    if (errorMessage?.includes("Token not found") || errorMessage?.includes("Invalid Token")) {
      setAuthActionCompleted(false);
      if (!showSignupModal && !showSigninModal) {
        if (errorMessage?.includes("Invalid Token")) {
            setShowSigninModal(true);
        } else {
            setShowSignupModal(true);
        }
      }
      return true; // Indicate auth error was handled
    }
    return false;
  };

  // --- Effect to handle auth state changes and modal visibility ---
  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (currentUserId) {
      if (showSignupModal) setShowSignupModal(false);
      if (showSigninModal) setShowSigninModal(false);
      if (authActionCompleted) setAuthActionCompleted(false);
    } else if (!isAuthLoading && !currentUserId) {
      if (!authActionCompleted) {
        if (!showSignupModal && !showSigninModal) {
          setShowSignupModal(true);
          setIsLoading(false);
        }
      }
    }
  }, [currentUserId, isAuthLoading, showSignupModal, showSigninModal, authActionCompleted]);

  // --- Fetch Locked Content Data ---
  useEffect(() => {
    if (!currentUserId || !contentId || isAuthLoading) {
      if (!isAuthLoading && !currentUserId) {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    const fetchContent = async () => {
      try {
        const response = await fetchPremiumContentById(contentId);
        const data = response.data.data || response.data.content;
        setLockedContentData(data);

        if (!data) {
           toast.error("Content not found or is empty.");
           setIsPurchased(false);
           setLockedContentData(null);
           setIsLoading(false);
           return;
        }

        const userIsCreator = data.createdBy === currentUserId;
        const contentAvailable = !!(data.text || (data.images && data.images.length > 0) || (data.files && data.files.length > 0));
        setIsPurchased(userIsCreator || contentAvailable);

      } catch (error) {
        console.error("Error fetching locked content:", error);
        const handled = handleAuthError(error);
        if (!handled) {
          toast.error(error?.response?.data?.message || "Failed to load content details.");
        }
        setLockedContentData(null);
        setIsPurchased(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [contentId, currentUserId, isAuthLoading]);

  // --- Load Razorpay Script ---
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // --- Modal Handlers ---
  const handleSaveEmail = (email) => {
    setUserEmail(email);
  };

  const handleSuccessfulSignup = (data) => {
    if (data.token) {
      localStorage.setItem("AuthToken", data.token);
      setShowSignupModal(false);
      setAuthActionCompleted(true);
      toast.success("Signup successful! Welcome.");
      window.location.reload();
    } else {
      toast.error("Signup completed, but no token received. Please try signing in.");
      handleSwitchToSignin();
    }
  };

  const handleSuccessfulSignin = (data) => {
    console.log(data ," asfhd");
    if (data.token) {
        localStorage.setItem("AuthToken", data.token);
        setShowSigninModal(false);
        setAuthActionCompleted(true);
        window.location.reload();

        toast.success("Signin successful! Welcome back.");
    } else {
        toast.error("Signin process completed, but no token received. Please try again.");
    }
  };

  const handleSwitchToSignin = () => {
    setAuthActionCompleted(false);
    setShowSignupModal(false);
    setShowSigninModal(true);
  };

  const handleSwitchToSignup = () => {
    setAuthActionCompleted(false);
    setShowSigninModal(false);
    setShowSignupModal(true);
  };

  // --- Payment Handling ---
  const handlePayment = async () => {
    if (!lockedContentData?.unlockPrice || lockedContentData.unlockPrice <= 0) {
        toast.error("This content is not available for purchase or has an invalid price.");
        return;
    }
    if (!currentUserId) {
        toast.error("Please sign up or sign in to purchase content.");
        setAuthActionCompleted(false);
        if (!showSigninModal) setShowSignupModal(true);
        return;
    }

    try {
      const response = await purchasePremiumContent(contentId, currentUserId);
      const orderDetails = response.data.payload;

      if (!orderDetails || !orderDetails.orderId) {
          throw new Error("Failed to get payment order details from server.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        name: "One App Locked Content",
        description: `Unlock: ${lockedContentData.title || 'Premium Content'}`,
        order_id: orderDetails.orderId,
        handler: async function (paymentResponse) {
          const body = {
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            premiumContentId: contentId,
          };

          try {
            setIsPaymentVerifying(true);
            toast.loading("Verifying payment...", { id: 'payment-verify-toast' });
            const verifyResponse = await verifyPayment(body);
            toast.dismiss('payment-verify-toast');

            if (verifyResponse.data.success) {
              toast.success("Payment successful! Loading unlocked content...");
              setIsLoading(true);
              try {
                  const updatedContentResponse = await fetchPremiumContentById(contentId);
                  const data = updatedContentResponse.data.data || updatedContentResponse.data.content;
                  setLockedContentData(data);
                  const userIsCreator = data?.createdBy === currentUserId;
                  const contentAvailable = !!(data?.text || (data?.images && data.images.length > 0) || (data?.files && data.files.length > 0));
                  setIsPurchased(userIsCreator || contentAvailable);
              } catch (fetchError) {
                   console.error("Error fetching updated content after purchase:", fetchError);
                   toast.error("Payment verified, but failed to refresh content. Please reload the page.");
              } finally {
                   setIsLoading(false);
              }

            } else {
                toast.error(verifyResponse.data.message || "Payment verification failed. Please check your account or contact support.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.dismiss('payment-verify-toast');
            if (!handleAuthError(error)){
               toast.error("Payment verification failed. If payment was deducted, please contact support.");
            }
          } finally {
            setIsPaymentVerifying(false);
          }
        },
        prefill: {
        },
        theme: {
          color: "#F59E0B",
        },
        modal: {
            ondismiss: function() {
                console.log('Razorpay modal dismissed');
            }
        }
      };

      if (!window.Razorpay) {
          toast.error("Payment gateway is not loaded. Please refresh the page.");
          return;
      }

      const rzp1 = new window.Razorpay(options);

      rzp1.on('payment.failed', function (response){
            console.error("Razorpay Payment Failed:", response.error);
            let errorMessage = "Payment Failed";
            if (response.error?.description) {
                errorMessage += `: ${response.error.description}`;
            } else if (response.error?.reason) {
                errorMessage += `: ${response.error.reason}`;
            }
            toast.error(errorMessage);
            console.error("Failure Code:", response.error?.code);
            console.error("Failure Reason:", response.error?.reason);
            console.error("Failure Step:", response.error?.step);
            console.error("Failure Metadata:", response.error?.metadata);
      });

      rzp1.open();

    } catch (error) {
      console.error("Error initiating payment:", error);
      if (!handleAuthError(error)) {
        toast.error(error?.response?.data?.message || "Payment initiation failed. Please try again.");
      }
    }
  };

  // --- Render Logic ---
  if (isAuthLoading || (isLoading && currentUserId)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Icons.Loader2 className="animate-spin h-12 w-12 text-orange-500" />
      </div>
    );
  }

  if (!isAuthLoading && !currentUserId) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-4 relative">
        <SignupModal
          open={showSignupModal}
          handleClose={() => setShowSignupModal(false)}
          onSuccessfulSignup={handleSuccessfulSignup}
          onSwitchToSignin={handleSwitchToSignin}
        />
        <SigninModal
          open={showSigninModal}
          handleClose={() => setShowSigninModal(false)}
          label="Email"
          onSuccessfulLogin={handleSuccessfulSignin}
          onSwitchToSignup={handleSwitchToSignup}
        />
        {!showSigninModal && !showSignupModal && (
          <>
            <Icons.LogIn className="h-12 w-12 text-orange-500 mb-4" />
            <p className="mb-4 text-lg">Please Sign In or Sign Up</p>
            <p className="text-sm text-gray-400 mb-6">You need an account to view or purchase this content.</p>
            <div className="flex gap-4 mt-4">
              <button onClick={handleSwitchToSignin} className="px-4 py-2 bg-orange-500 rounded hover:bg-orange-600 transition-colors">
                Sign In
              </button>
              <button onClick={handleSwitchToSignup} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                Sign Up
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (!lockedContentData && !isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-4">
        <SignupModal
          open={showSignupModal}
          handleClose={() => setShowSignupModal(false)}
          onSuccessfulSignup={handleSuccessfulSignup}
          onSwitchToSignin={handleSwitchToSignin}
        />
        <SigninModal
          open={showSigninModal}
          handleClose={() => setShowSigninModal(false)}
          label="Email"
          onSuccessfulSignin={handleSuccessfulSignin}
          onSwitchToSignup={handleSwitchToSignup}
        />
        <Icons.AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <p className="mb-4">Could not load content details.</p>
        <p className="text-sm text-gray-400 mb-6">This might be due to an invalid ID, a network issue, or the content not existing.</p>
        <button onClick={() => { setIsLoading(true); }} className="mt-4 px-4 py-2 bg-orange-500 rounded hover:bg-orange-600 transition-colors">
          Retry Loading
        </button>
      </div>
    );
  }

  const isCreator = lockedContentData?.createdBy === currentUserId;
  const hasFullAccess = isCreator || isPurchased;

  return (
    <div className="min-h-screen bg-black text-white scrollbar-hide overflow-y-scroll">
      <SignupModal
        open={showSignupModal}
        handleClose={() => setShowSignupModal(false)}
        onSuccessfulSignup={handleSuccessfulSignup}
        onSwitchToSignin={handleSwitchToSignin}
      />
      <SigninModal
        open={showSigninModal}
        handleClose={() => setShowSigninModal(false)}
        label="Email"
        onSuccessfulSignin={handleSuccessfulSignin}
        onSwitchToSignup={handleSwitchToSignup}
      />

      {isPaymentVerifying && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="text-center p-6 bg-gray-900 rounded-lg shadow-xl">
            <Icons.Loader2 className="animate-spin h-16 w-16 text-orange-500 mx-auto mb-4" />
            <p className="text-white text-lg font-semibold">Verifying your payment...</p>
            <p className="text-gray-400 text-sm">Please wait, this may take a moment.</p>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-r from-orange-600 to-orange-500 py-12 px-4 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            {lockedContentData.title || "Premium Content"}
          </h1>
          {lockedContentData.category && (
             <p className="text-lg text-white/90 mb-6">Category: {lockedContentData.category}</p>
          )}

          {isCreator ? (
             <div className="bg-blue-600 text-white py-3 px-6 rounded-lg inline-flex items-center justify-center shadow-md gap-2">
              <Icons.UserCheck className="w-5 h-5" />
              <span className="font-medium">You Created This</span>
            </div>
          ) : hasFullAccess ? (
            <div className="bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center justify-center shadow-md gap-2">
              <Icons.CheckCircle className="w-5 h-5" />
              <span className="font-medium">Access Granted</span>
            </div>
          ) : (
            lockedContentData.unlockPrice > 0 ? (
                <button
                  onClick={handlePayment}
                  disabled={isPaymentVerifying}
                  className={`bg-black text-orange-500 py-3 px-8 rounded-lg font-bold hover:bg-gray-900 transition-all duration-300 shadow-xl inline-flex items-center space-x-2 text-lg disabled:opacity-70 disabled:cursor-wait`}
                >
                  <Icons.Lock className="w-5 h-5" />
                  <span>Unlock for</span>
                  <Icons.IndianRupee className="w-5 h-5" />
                  <span>{lockedContentData.unlockPrice}</span>
                </button>
             ) : (
                 <div className="bg-gray-700 text-white py-3 px-6 rounded-lg inline-flex items-center justify-center shadow-md gap-2">
                    <Icons.Info className="w-5 h-5" />
                    <span className="font-medium">Not Available for Purchase</span>
                 </div>
             )
          )}
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
           <div className="p-6 md:p-8 bg-gray-900 rounded-2xl shadow-2xl border border-orange-500/20">
            <h2 className="text-3xl font-bold mb-6 text-orange-500">
                {hasFullAccess ? "Content Details" : "Content Preview"}
            </h2>

            {hasFullAccess ? (
                <div className="space-y-6">
                    {lockedContentData.text && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-300 mb-3 flex items-center gap-2"><Icons.FileText className="w-5 h-5 text-orange-400"/>Message:</h3>
                            <p className="text-gray-300 bg-gray-800 p-4 rounded-lg whitespace-pre-wrap border border-gray-700">{lockedContentData.text}</p>
                        </div>
                    )}
                    {lockedContentData.images && lockedContentData.images.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-300 mb-3 flex items-center gap-2"><Icons.Image className="w-5 h-5 text-orange-400"/>Image:</h3>
                            <img src={lockedContentData.images[0]} alt={lockedContentData.title || 'Locked Content Image'} className="max-w-full h-auto rounded-lg shadow-lg border border-gray-700"/>
                        </div>
                    )}
                    {lockedContentData.files && lockedContentData.files.length > 0 && (
                         <div>
                            <h3 className="text-xl font-semibold text-gray-300 mb-3 flex items-center gap-2"><Icons.File className="w-5 h-5 text-orange-400"/>File:</h3>
                            <a
                                href={lockedContentData.files[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors shadow"
                            >
                                <Icons.Download className="w-5 h-5" />
                                Download File
                            </a>
                        </div>
                    )}
                    {!lockedContentData.text && (!lockedContentData.images || lockedContentData.images.length === 0) && (!lockedContentData.files || lockedContentData.files.length === 0) && (
                         <div className="text-center py-6 px-4 bg-gray-800 rounded-lg border border-dashed border-gray-600">
                            <Icons.Info className="w-10 h-10 text-blue-400 mx-auto mb-3"/>
                            <p className="text-gray-400">Access granted, but no displayable content (text, image, or file) was provided for this item.</p>
                         </div>
                     )}
                </div>
            ) : (
                <div className="text-center py-8 px-4 bg-gray-800/50 rounded-lg border border-dashed border-gray-600">
                    <Icons.Lock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-white">
                        Content Locked
                    </h3>
                    {lockedContentData.unlockPrice > 0 ? (
                        <>
                            <p className="text-gray-400 mb-5">
                                Purchase this item for <Icons.IndianRupee className="inline-block w-4 h-4 -mt-1"/>{lockedContentData.unlockPrice} to unlock the full content.
                            </p>
                            <button
                                onClick={handlePayment}
                                disabled={isPaymentVerifying}
                                className={`bg-orange-500 text-white py-2 px-6 rounded-lg font-bold hover:bg-orange-600 transition-colors duration-300 shadow-lg inline-flex items-center space-x-2 text-md disabled:opacity-70 disabled:cursor-wait`}
                            >
                                <Icons.IndianRupee className="w-5 h-5" />
                                <span>Unlock for {lockedContentData.unlockPrice}</span>
                            </button>
                        </>
                    ) : (
                         <p className="text-gray-400">
                            This content is currently locked and not available for purchase.
                         </p>
                    )}
                </div>
            )}
            </div>
        </div>
      </section>

      <PageFooter />
    </div>
  );
};

export default LockedContentDisplayPage;
