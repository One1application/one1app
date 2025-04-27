import * as Icons from "lucide-react";
import { IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaymentSignUpModel from "../../../../components/Modal/PaymentSignUpModel";
import SigninModal from "../../../../components/Modal/SigninModal";
import { useAuth } from "../../../../context/AuthContext";
import {
  fetchWebinar,
  purchaseWebinar,
} from "../../../../services/auth/api.services";
import PageFooter from "../PayingUpPage/PageFooter";

const WebinarPages = () => {
  const navigate = useNavigate();
  const [activeTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [params] = useSearchParams();
  const webinarId = params.get("id");
  const [webinarData, setWebinarData] = useState(null);
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isCreator, setIsCreator] = useState(false);

  const { currentUserId } = useAuth();

  const handleAuthError = (error) => {
    if (
      error?.response?.data?.message === "Token not found, Access Denied!" ||
      error?.message === "Token not found, Access Denied!"
    ) {
      setShowSignupModal(true);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!webinarId) return;
    const fetch = async () => {
      setIsLoading(true);
      try {
        const response = await fetchWebinar(webinarId);
        console.log(response);
        setWebinarData(response.data.payload.webinar);

        // If link exists, set as purchased
        if (response.data.payload.webinar.link) {
          setIsPurchased(true);
          setMeetingDetails({
            ...response.data.payload.webinar.link,
            venue: response.data.payload.webinar.venue,
          });
        }
      } catch (error) {
        console.error("Error in fetching webinar", error);
        if (!handleAuthError(error)) {
          toast("Failed to fetch webinar.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [webinarId]);

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  // }, []);

  const handlePayment = async () => {
    try {
      const response = await purchaseWebinar(webinarId);
     
      window.location.href = response.data.payload.redirectUrl;
      // const orderDetails = response.data.payload;

      // var options = {
      //   key: import.meta.env.VITE_RAZORPAY_KEY,
      //   amount: orderDetails.amount,
      //   currency: orderDetails.currency,
      //   name: "One App",
      //   description: "Complete Your Webinar Purchase",
      //   order_id: orderDetails.orderId,
      //   handler: async function (response) {
      //     const body = {
      //       razorpay_order_id: response.razorpay_order_id,
      //       razorpay_payment_id: response.razorpay_payment_id,
      //       razorpay_signature: response.razorpay_signature,
      //       webinarId: orderDetails.webinarId,
      //     };

      //     try {
      //       setIsVerifying(true);
      //       const verificationResponse = await verifyPayment(body);
      //       if (verificationResponse.data?.payload?.webinarDetail) {
      //         setMeetingDetails(
      //           verificationResponse.data.payload.webinarDetail
      //         );
      //         setIsPurchased(true);
      //       }

      //       toast("Payment successful!");
      //     } catch (error) {
      //       console.error("Error while verifying payment.", error);
      //       if (!handleAuthError(error)) {
      //         toast("Payment Failed");
      //       }
      //     } finally {
      //       setIsVerifying(false);
      //     }
      //   },
      //   prefill: {
      //     name: "John Doe",
      //     email: "john.doe@example.com",
      //     contact: "9999999999",
      //   },
      //   theme: {
      //     color: "#F37254",
      //   },
      // };

      // const rzp1 = new window.Razorpay(options);
      // rzp1.open();
    } catch (error) {
      console.log("Error during webinar payment.", error);
      if (!handleAuthError(error)) {
        toast("Payment initiation failed");
      }
    }
  };

  const handleSaveEmail = (email) => {
    setUserEmail(email);
    toast.success("Email updated successfully!");
  };

  const handleSuccessfulSignup = (data) => {
    if (data.token) {
      localStorage.setItem("AuthToken", data.token);
      setShowSignupModal(false);
      toast.success("Signup successful!");
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!webinarData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        No webinar data available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black scrollbar-hide overflow-y-scroll">
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
        onSave={handleSaveEmail}
        onSwitchToSignup={handleSwitchToSignup}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-3 text-white">
            {webinarData.title}
          </h1>
          <h2 className="text-2xl font-bold  mb-3">Webinar Event</h2>
          {currentUserId === webinarData.createdById ? (
            <div className="bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center">
              <Icons.CheckCircle className="w-5 h-5 mr-2" />
              <span>You Created This</span>
            </div>
          ) : isPurchased ? (
            <div className="bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center">
              <Icons.CheckCircle className="w-5 h-5 mr-2" />
              <span>Already Purchased</span>
            </div>
          ) : (
            <button
              onClick={handlePayment}
              disabled={isVerifying || !webinarData.paymentEnabled}
              className={`py-4 px-10 rounded-lg font-bold transition-colors duration-300 shadow-xl inline-flex items-center space-x-3 text-lg ${
                !webinarData.paymentEnabled
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-black text-orange-500 hover:bg-gray-900"
              }`}
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600 mr-2"></div>
                  <span>Processing...</span>
                </>
              ) : !webinarData.paymentEnabled ? (
                <span>Payment Disabled</span>
              ) : (
                <>
                  <span>Enroll for</span>
                  <IndianRupee className="w-6 h-6" />
                  <span>{webinarData.amount}</span>
                </>
              )}
            </button>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Meeting Details Section - Show after successful purchase */}
        {isPurchased && meetingDetails && (
          <div className="mt-6">
            <div className="p-8 bg-slate-900 rounded-2xl shadow-2xl border border-orange-500/20">
              <h2 className="text-4xl font-bold mb-6 text-orange-500">
                Meeting Details
              </h2>
              <div className="space-y-4 bg-black/40 p-6 rounded-lg">
                {(meetingDetails.meetingLink ||
                  meetingDetails.meetingId ||
                  meetingDetails.meetingPassword) && (
                  <>
                    <h3 className="text-xl font-bold text-white">
                      Zoom Meeting
                    </h3>

                    {meetingDetails.meetingLink && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">
                          Meeting Link:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={meetingDetails.meetingLink}
                            readOnly
                            className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white focus:outline-none"
                          />
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                meetingDetails.meetingLink
                              )
                            }
                            className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700"
                          >
                            <Icons.Copy className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {meetingDetails.meetingId && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">
                          Meeting ID:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={meetingDetails.meetingId}
                            readOnly
                            className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white focus:outline-none"
                          />
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                meetingDetails.meetingId
                              )
                            }
                            className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700"
                          >
                            <Icons.Copy className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {meetingDetails.meetingPassword && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">
                          Meeting Password:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={meetingDetails.meetingPassword}
                            readOnly
                            className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white focus:outline-none"
                          />
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                meetingDetails.meetingPassword
                              )
                            }
                            className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700"
                          >
                            <Icons.Copy className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {meetingDetails.platformLink && (
                  <>
                    <h3 className="text-xl font-bold text-white">
                      Meeting Link
                    </h3>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white">
                        Platform Link:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={meetingDetails.platformLink}
                          readOnly
                          className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white focus:outline-none"
                        />
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              meetingDetails.platformLink
                            )
                          }
                          className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700"
                        >
                          <Icons.Copy className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {meetingDetails.venue && (
                  <>
                    <h3 className="text-xl font-bold text-white">
                      Offline Venue Address
                    </h3>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white">
                        Venue:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={meetingDetails.venue}
                          readOnly
                          className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white focus:outline-none"
                        />
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(meetingDetails.venue)
                          }
                          className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700"
                        >
                          <Icons.Copy className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-4">
                  {(meetingDetails.meetingLink ||
                    meetingDetails.platformLink) && (
                    <a
                      href={
                        meetingDetails.meetingLink ||
                        meetingDetails.platformLink
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-orange-700 transition-colors duration-300 shadow-xl inline-flex items-center gap-2"
                    >
                      <Icons.ExternalLink className="w-5 h-5" />
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Event Image */}
        <div className="mt-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-orange-500/20">
            <img
              src={webinarData.coverImage}
              alt="Event Cover"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>

        {/* Event Details */}
        <div className="mt-6">
          <div className="p-8 bg-slate-900 rounded-2xl shadow-2xl border border-orange-500/20">
            <h2 className="text-4xl font-bold text-orange-500 mb-3">
              Category
            </h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              {webinarData.category}
            </p>
          </div>
        </div>

        {/* Date & Time Section */}
        <div className="mt-6">
          <div className="p-8 bg-slate-900 rounded-2xl shadow-2xl border border-orange-500/20">
            <h2 className="text-4xl font-bold mb-6 text-orange-500">
              Date & Time
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Icons.Calendar className="w-6 h-6 text-orange-500" />
                <span className="text-lg">Start Date : </span>
                <span className="text-lg">
                  {new Date(webinarData.startDate).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <Icons.Calendar className="w-6 h-6 text-orange-500" />
                <span className="text-lg">End Date : </span>
                <span className="text-lg">
                  {new Date(webinarData.endDate).toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Icons.RefreshCcw className="w-6 h-6 text-orange-500" />
                <span className="text-lg">
                  {webinarData.occurrence || "Single Time"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Information Section */}
        <div className="mt-6">
          <div className="p-8 bg-slate-900 rounded-2xl shadow-2xl border border-orange-500/20">
            <h2 className="text-4xl font-bold mb-6 text-orange-500">
              Ticket Information
            </h2>
            <div className="space-y-3 text-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ticket Type:</span>
                <span className="text-gray-300">
                  {webinarData.isPaid ? "Paid" : "Free"}
                </span>
              </div>
              {webinarData.isPaid && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-gray-300">{webinarData.amount}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="mt-6 mb-8">
          <div className="flex justify-end gap-4">
            <button 
              onClick={handlePayment}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-10 rounded-lg font-bold hover:opacity-90 transition-opacity duration-300 shadow-xl inline-flex items-center space-x-3 text-lg"
            >
              <Icons.Send className="w-6 h-6 mr-2" />
              Purchase Ticket
            </button>
          </div>
        </div> */}
      </div>
      {/* page footer */}
      <PageFooter />
    </div>
  );
};

export default WebinarPages;
