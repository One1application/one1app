import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaymentSignUpModel from "../../../../components/Modal/PaymentSignUpModel";
import SigninModal from "../../../../components/Modal/SigninModal";
import { useAuth } from "../../../../context/AuthContext";
import { fetchWebinar } from "../../../../services/auth/api.services";
import PageFooter from "../PayingUpPage/PageFooter";
import { getInitials } from "../../../../utils/constants/nameCutter.js";
import ClassInformation from "./ClassInformation.jsx";

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

  const { currentUserId, userDetails } = useAuth();

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
  }, [webinarId, currentUserId]);

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  // }, []);

  // const handlePayment = async () => {
  //   try {
  //     const response = await purchaseWebinar(webinarId);

  //     window.location.href = response.data.payload.redirectUrl;
  //     // const orderDetails = response.data.payload;

  //     // var options = {
  //     //   key: import.meta.env.VITE_RAZORPAY_KEY,
  //     //   amount: orderDetails.amount,
  //     //   currency: orderDetails.currency,
  //     //   name: "One App",
  //     //   description: "Complete Your Webinar Purchase",
  //     //   order_id: orderDetails.orderId,
  //     //   handler: async function (response) {
  //     //     const body = {
  //     //       razorpay_order_id: response.razorpay_order_id,
  //     //       razorpay_payment_id: response.razorpay_payment_id,
  //     //       razorpay_signature: response.razorpay_signature,
  //     //       webinarId: orderDetails.webinarId,
  //     //     };

  //     //     try {
  //     //       setIsVerifying(true);
  //     //       const verificationResponse = await verifyPayment(body);
  //     //       if (verificationResponse.data?.payload?.webinarDetail) {
  //     //         setMeetingDetails(
  //     //           verificationResponse.data.payload.webinarDetail
  //     //         );
  //     //         setIsPurchased(true);
  //     //       }

  //     //       toast("Payment successful!");
  //     //     } catch (error) {
  //     //       console.error("Error while verifying payment.", error);
  //     //       if (!handleAuthError(error)) {
  //     //         toast("Payment Failed");
  //     //       }
  //     //     } finally {
  //     //       setIsVerifying(false);
  //     //     }
  //     //   },
  //     //   prefill: {
  //     //     name: "John Doe",
  //     //     email: "john.doe@example.com",
  //     //     contact: "9999999999",
  //     //   },
  //     //   theme: {
  //     //     color: "#F37254",
  //     //   },
  //     // };

  //     // const rzp1 = new window.Razorpay(options);
  //     // rzp1.open();
  //   } catch (error) {
  //     console.log("Error during webinar payment.", error);
  //     if (!handleAuthError(error)) {
  //       toast("Payment initiation failed");
  //     }
  //   }
  // };

  const handleSaveEmail = (email) => {
    setUserEmail(email);
    toast.success("Email updated successfully!");
    navigate("/app/payment", {
      id: webinarId,
      title: webinarData.title,
      baseAmount: webinarData.amount,
      courseType: "webinar",
      createdBy: webinarData.createdBy.name,
    });
  };

  const handleSuccessfulSignup = (data) => {
    if (data.token) {
      localStorage.setItem("AuthToken", data.token);
      setShowSignupModal(false);
      toast.success("Signup successful!");
      navigate("/app/payment", {
        state: {
          id: webinarId,
          title: webinarData.title,
          baseAmount: webinarData.amount,
          courseType: "webinar",
          createdBy: webinarData.createdBy.name,
        },
      });
    }
  };

  const handleSuccessfulSignIn = (data) => {
    if (data.token) {
      localStorage.setItem("AuthToken", data.token);
      setShowSigninModal(false);
      toast.success("SignIn successful!");
      navigate("/app/payment", {
        state: {
          id: webinarId,
          title: webinarData.title,
          baseAmount: webinarData.amount,
          courseType: "webinar",
          createdBy: webinarData.createdBy.name,
        },
      });
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
    //       ) : isPurchased ? (
    //         <div className="bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center">
    //           <Icons.CheckCircle className="w-5 h-5 mr-2" />
    //           <span>Already Purchased</span>
    //         </div>
    //       ) : (
    //         <button
    //           onClick={handlePayment}
    //           disabled={isVerifying || !webinarData.paymentEnabled}
    //           className={`py-4 px-10 rounded-lg font-bold transition-colors duration-300 shadow-xl inline-flex items-center space-x-3 text-lg ${
    //             !webinarData.paymentEnabled
    //               ? "bg-gray-700 text-gray-400 cursor-not-allowed"
    //               : "bg-black text-orange-500 hover:bg-gray-900"
    //           }`}
    //         >
    //           {isVerifying ? (
    //             <>
    //               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600 mr-2"></div>
    //               <span>Processing...</span>
    //             </>
    //           ) : !webinarData.paymentEnabled ? (
    //             <span>Payment Disabled</span>
    //           ) : (
    //             <>
    //               <span>Enroll for</span>
    //               <IndianRupee className="w-6 h-6" />
    //               <span>{webinarData.amount}</span>
    //             </>
    //           )}
    //         </button>
    //       )}
    //     </div>
    //   </section> */}

    //      {/* Header */}
    //   <div className="bg-orange-500 flex items-center justify-between  rounded-lg p-4 mt-2 ">
    //     <div className="flex content-center gap-6">
    //       <div className="pt-2"><img className="h-4 w-4 border-2 border-solid border-black rounded-lg"/></div>
    //     <div> <p className="text-sm text-white">Created by</p>
    //       <p className="font-bold text-white"> {webinarData.createdById}</p></div>
    //     </div>
    //     <div className="text-right ">
    //       <p className="text-lg font-bold text-white"> {webinarData.title}</p>
    //       <p className="text-sm text-white">Webinar Event</p>
    //         <p className=" text-gray-200 text-lg"> {webinarData.category}</p>
    //     </div>
    //  </div>

    //   {/* Main Content */}
    //   <div className="max-w-6xl mx-auto px-4">
    //     {/* Meeting Details Section - Show after successful purchase */}
    //     {isPurchased && meetingDetails && (
    //       <div className="mt-6">
    //         <div className="p-8 bg-slate-900 rounded-2xl shadow-2xl border border-orange-500/20">
    //           <h2 className="text-4xl font-bold mb-6 text-orange-500">
    //             Meeting Details
    //           </h2>
    //           <div className="space-y-4 bg-black/40 p-6 rounded-lg">
    //             {(meetingDetails.meetingLink ||
    //               meetingDetails.meetingId ||
    //               meetingDetails.meetingPassword) && (
    //               <>
    //                 <h3 className="text-xl font-bold text-white">
    //                   Zoom Meeting
    //                 </h3>

    //                 {meetingDetails.meetingLink && (
    //                   <div className="space-y-2">
    //                     <label className="text-sm font-semibold text-white">
    //                       Meeting Link:
    //                     </label>
    //                     <div className="flex items-center gap-2">
    //                       <input
    //                         type="text"
    //                         value={meetingDetails.meetingLink}
    //                         readOnly
    //                         className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white focus:outline-none"
    //                       />
    //                       <button
    //                         onClick={() =>
    //                           navigator.clipboard.writeText(
    //                             meetingDetails.meetingLink
    //                           )
    //                         }
    //                         className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700"
    //                       >
    //                         <Icons.Copy className="w-5 h-5" />
    //                       </button>
    //                     </div>
    //                   </div>
    //                 )}

    //                 {meetingDetails.meetingId && (
    //                   <div className="space-y-2">
    //                     <label className="text-sm font-semibold text-white">
    //                       Meeting ID:
    //                     </label>
    //                     <div className="flex items-center gap-2">
    //                       <input
    //                         type="text"
    //                         value={meetingDetails.meetingId}
    //                         readOnly
    //                         className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white focus:outline-none"
    //                       />
    //                       <button
    //                         onClick={() =>
    //                           navigator.clipboard.writeText(
    //                             meetingDetails.meetingId
    //                           )
    //                         }
    //                         className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700"
    //                       >
    //                         <Icons.Copy className="w-5 h-5" />
    //                       </button>
    //                     </div>
    //                   </div>
    //                 )}

    //                 {meetingDetails.meetingPassword && (
    //                   <div className="space-y-2">
    //                     <label className="text-sm font-semibold text-white">
    //                       Meeting Password:
    //                     </label>
    //                     <div className="flex items-center gap-2">
    //                       <input
    //                         type="text"
    //                         value={meetingDetails.meetingPassword}
    //                         readOnly
    //                         className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white focus:outline-none"
    //                       />
    //                       <button
    //                         onClick={() =>
    //                           navigator.clipboard.writeText(
    //                             meetingDetails.meetingPassword
    //                           )
    //                         }
    //                         className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700"
    //                       >
    //                         <Icons.Copy className="w-5 h-5" />
    //                       </button>
    //                     </div>
    //                   </div>
    //                 )}
    //               </>
    //             )}

    //             {meetingDetails.platformLink && (
    //               <>
    //                 <h3 className="text-xl font-bold text-white">
    //                   Meeting Link
    //                 </h3>
    //                 <div className="space-y-2">
    //                   <label className="text-sm font-semibold text-white">
    //                     Platform Link:
    //                   </label>
    //                   <div className="flex items-center gap-2">
    //                     <input
    //                       type="text"
    //                       value={meetingDetails.platformLink}
    //                       readOnly
    //                       className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white focus:outline-none"
    //                     />
    //                     <button
    //                       onClick={() =>
    //                         navigator.clipboard.writeText(
    //                           meetingDetails.platformLink
    //                         )
    //                       }
    //                       className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700"
    //                     >
    //                       <Icons.Copy className="w-5 h-5" />
    //                     </button>
    //                   </div>
    //                 </div>
    //               </>
    //             )}

    //             {meetingDetails.venue && (
    //               <>
    //                 <h3 className="text-xl font-bold text-white">
    //                   Offline Venue Address
    //                 </h3>
    //                 <div className="space-y-2">
    //                   <label className="text-sm font-semibold text-white">
    //                     Venue:
    //                   </label>
    //                   <div className="flex items-center gap-2">
    //                     <input
    //                       type="text"
    //                       value={meetingDetails.venue}
    //                       readOnly
    //                       className="w-full bg-black/50 border-2 border-orange-500/30 rounded-lg p-3 text-sm text-white focus:outline-none"
    //                     />
    //                     <button
    //                       onClick={() =>
    //                         navigator.clipboard.writeText(meetingDetails.venue)
    //                       }
    //                       className="bg-orange-600 text-white p-3 rounded-lg hover:bg-orange-700"
    //                     >
    //                       <Icons.Copy className="w-5 h-5" />
    //                     </button>
    //                   </div>
    //                 </div>
    //               </>
    //             )}

    //             <div className="mt-4">
    //               {(meetingDetails.meetingLink ||
    //                 meetingDetails.platformLink) && (
    //                 <a
    //                   href={
    //                     meetingDetails.meetingLink ||
    //                     meetingDetails.platformLink
    //                   }
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                   className="bg-orange-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-orange-700 transition-colors duration-300 shadow-xl inline-flex items-center gap-2"
    //                 >
    //                   <Icons.ExternalLink className="w-5 h-5" />
    //                   Join Meeting
    //                 </a>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     )}

    <div className="min-h-screen bg-gray-950 scrollbar-hide overflow-y-scroll">
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
      {/* Header Section */}
      {webinarData?.coverImage && (
        <section className="pb-6">
          <div className="w-full mx-auto">
            {/* Cover Image */}
            <div className="relative overflow-hidden rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-orange-500/30 group transition-all duration-300 hover:shadow-[0_10px_40px_rgba(255,90,0,0.2)]">
              <img
                src={webinarData.coverImage}
                alt="Webinar Cover"
                className="w-full h-[180px] sm:h-[220px] md:h-[280px] object-cover transition-transform duration-500 group-hover:scale-102"
              />
            </div>

            {/* Info Block */}
            <div className="bg-gradient-to-br from-gray-900 to-orange-900/70 mt-1 p-4 shadow-lg border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4 px-5">
                {/* Avatar or Initials */}
                <div className="flex items-center gap-4">
                  {webinarData?.createdBy?.userImage ? (
                    <img
                      className="w-12 h-12 rounded-full border-2 border-white/80 shadow-sm"
                      src={webinarData.createdBy.userImage}
                      alt="Creator Avatar"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-600/90 flex items-center justify-center border-2 border-white/80">
                      <span className="text-lg font-bold text-white">
                        {getInitials(webinarData?.createdBy?.name)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-300 uppercase tracking-wider">
                      Created by
                    </p>
                    <h2 className="text-base font-semibold text-white">
                      {webinarData?.createdBy?.name}
                    </h2>
                  </div>
                </div>

                {/* Title & Badge */}
                <div className="text-right flex flex-col items-center">
                  <h1 className="text-xl font-bold text-white truncate max-w-[180px]">
                    {webinarData?.title}
                  </h1>
                  <span className="inline-block px-2 py-1 text-xs font-bold bg-orange-500/90 text-white rounded-full">
                    WEBINAR
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cover and Description */}
      <section className="py-16 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="relative p-8 sm:p-12 rounded-3xl border border-orange-500/30 bg-gray-900/60 backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-orange-600/10">
            {/* Gradient border accent ring */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500/10 to-orange-700/10 rounded-3xl blur-md opacity-25"></div>

            {/* Header */}
            <div className="relative z-10 mb-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-3">
                About the Webinar
              </h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full"></div>
            </div>

            {/* Description */}
            <div
              className="relative z-10 text-gray-300 leading-relaxed text-[17px] sm:text-lg space-y-6 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: webinarData.description
                  ? webinarData.description
                  : "At OneApp, we are focused on elevating creators by offering a platform that makes the path from passion to profit effortless...",
              }}
            />
          </div>
        </div>
      </section>

      {/* Class Information */}

      <ClassInformation webinarData={webinarData} isPurchased={isPurchased} />

      {/* Enroll CTA */}
      <div className="mt-16 flex justify-center mb-5">
        {!isPurchased ? (
          <button
            onClick={() => {
              if (!currentUserId) {
                setShowSignupModal(true);
              } else {
                navigate("/app/payment", {
                  state: {
                    id: webinarId,
                    title: webinarData.title,
                    baseAmount: webinarData.amount,
                    courseType: "webinar",
                    createdBy: webinarData.createdBy.name,
                  },
                });
              }
            }}
            disabled={!webinarData.paymentEnabled}
            className="bg-orange-600 px-8 py-4 rounded-2xl text-white text-2xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-4"
          >
            <span>
              {webinarData.paymentButtonTitle?.toUpperCase() || "ENROLL FOR"}
            </span>
            <span>₹{webinarData.amount}</span>
          </button>
        ) : webinarData.createdById === currentUserId ? (
          <div className="bg-green-600 text-white py-3 px-6 rounded-2xl inline-flex items-center text-xl font-semibold shadow-lg">
            <Icons.CheckCircle className="w-6 h-6 mr-2" />
            <span>You Created This</span>
          </div>
        ) : (
          <a
            href="http://localhost:5174/dashboard"
            className="bg-green-600 text-white py-3 px-6 rounded-2xl inline-flex items-center text-xl font-semibold shadow-lg hover:bg-green-700 transition-colors duration-300"
          >
            <Icons.LayoutDashboard className="w-6 h-6 mr-2" />
            <span>Go to Dashboard</span>
          </a>
        )}
      </div>

      <PageFooter />
    </div>
  );
};

export default WebinarPages;
