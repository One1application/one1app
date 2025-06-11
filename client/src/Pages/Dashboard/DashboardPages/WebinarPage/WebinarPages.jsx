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

    <div className="w-full max-w-7xl mx-auto min-h-screen bg-black rounded-3xl overflow-hidden px-4 py-10 text-white">
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
      <div className="bg-gradient-to-br from-orange-600/80 to-gray-900/60 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <img
            className="w-28 h-28 rounded-full border-4 border-white"
            src="https://placehold.co/120x120"
            alt="Creator Avatar"
          />
          <div>
            <p className="text-xl">Created by</p>
            <h2 className="text-3xl font-semibold">
              {webinarData.createdBy.name}
            </h2>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold">
            {webinarData.title}
          </h1>
          <p className="text-2xl font-semibold">Webinar Event</p>
        </div>
      </div>

      {/* Cover and Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div>
          <h3 className="text-3xl font-semibold text-orange-600 mb-4">
            Cover Photo
          </h3>
          <img
            className="w-full h-auto rounded-3xl object-cover"
            src={webinarData.coverImage}
            alt="Webinar Cover"
          />
        </div>
        <div>
          <h3 className="text-3xl font-semibold text-orange-600 mb-4">
            Description
          </h3>
          <div
            className="text-lg leading-8"
            dangerouslySetInnerHTML={{
              __html: webinarData.description
                ? webinarData.description
                : "At OneApp, we are focused on elevating creators by offering a platform that makes the path from passion to profit effortless... ",
            }}
          ></div>
        </div>
      </div>

      {/* Class Information */}
      <section className="mt-16">
        <h2 className="text-4xl font-semibold text-orange-600 mb-6">
          Class Information
        </h2>
        <div className="bg-gray-900 p-6 rounded-2xl space-y-8">
          <div className="border-2 border-solid border-orange-300 rounded-xl p-4 mt-4 mb-4 space-y-4">
            <h3 className="text-2xl font-semibold text-orange-600">
              Date & Time
            </h3>
            <p className="text-lg">
              Start Date:{" "}
              <span className="font-bold">
                {new Date(webinarData.startDate).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </p>
            <p className="text-lg">
              End Date:{" "}
              <span className="font-bold">
                {new Date(webinarData.endDate).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </p>
            <p className="text-lg font-bold">
              {webinarData.occurrence || "Single Event"}
            </p>
          </div>

          <div className="border-2 border-solid border-orange-300 rounded-2xl p-6 mt-6 mb-6 space-y-4">
            <h3 className="text-3xl font-semibold text-orange-600">Category</h3>
            <p className="text-xl">{webinarData.category}</p>
          </div>

          {isPurchased && (
            <div className="border-2 border-solid border-orange-300 rounded-2xl p-6 mt-6 mb-8 space-y-8">
              {/* Zoom Meeting Link */}
              {webinarData.isOnline && webinarData.link.meetingLink && (
                <div className="space-y-4">
                  <h3 className="text-3xl font-semibold text-orange-600">
                    Zoom Meeting Link
                  </h3>
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://www.vectorlogo.zone/logos/zoomus/zoomus-icon.svg"
                      alt="Zoom logo"
                      className="w-12 h-12"
                    />
                    <a
                      href={webinarData.link.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-white"
                    >
                      {webinarData.link.meetingLink}
                    </a>
                  </div>
                  <h2 className="text-2xl font-semibold text-orange-600">
                    Meeting Password:
                    <span className="text-white font-semibold">
                      {" "}
                      {webinarData.link.meetingPassword}
                    </span>
                  </h2>
                  <h2 className="text-2xl font-semibold text-orange-600">
                    Meeting Id:
                    <span className="text-white font-semibold">
                      {webinarData.link.meetingId}
                    </span>{" "}
                  </h2>
                </div>
              )}

              {/* Google Meet Meeting Link */}
              {webinarData.isOnline && webinarData.link.platformLink && (
                <div className="space-y-4">
                  <h3 className="text-3xl font-semibold text-orange-600">
                    Google Meet Link
                  </h3>
                  <div className="flex items-center space-x-4">
                    {/* <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Google_Meet_logo_2020.svg"
            alt="Google Meet logo"
            className="w-8 h-8"
          /> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="60"
                      height="60"
                      viewBox="0 0 48 48"
                    >
                      <rect
                        width="10"
                        height="16"
                        x="12"
                        y="16"
                        fill="#fff"
                        transform="rotate(-90 20 24)"
                      ></rect>
                      <polygon
                        fill="#1e88e5"
                        points="3,17 3,31 8,32 13,31 13,17 8,16"
                      ></polygon>
                      <path
                        fill="#4caf50"
                        d="M37,24v14c0,1.657-1.343,3-3,3H13l-1-5l1-5h14v-7l5-1L37,24z"
                      ></path>
                      <path
                        fill="#fbc02d"
                        d="M37,10v14H27v-7H13l-1-5l1-5h21C35.657,7,37,8.343,37,10z"
                      ></path>
                      <path
                        fill="#1565c0"
                        d="M13,31v10H6c-1.657,0-3-1.343-3-3v-7H13z"
                      ></path>
                      <polygon
                        fill="#e53935"
                        points="13,7 13,17 3,17"
                      ></polygon>
                      <polygon
                        fill="#2e7d32"
                        points="38,24 37,32.45 27,24 37,15.55"
                      ></polygon>
                      <path
                        fill="#4caf50"
                        d="M46,10.11v27.78c0,0.84-0.98,1.31-1.63,0.78L37,32.45v-16.9l7.37-6.22C45.02,8.8,46,9.27,46,10.11z"
                      ></path>
                    </svg>
                    <a
                      href={webinarData.link.platformLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-white"
                    >
                      {webinarData.link.platformLink}
                    </a>
                  </div>
                </div>
              )}

              {/* Location for Offline Events */}
              {!webinarData.isOnline && webinarData.venue && (
                <div className="space-y-4">
                  <h3 className="text-3xl font-semibold text-orange-600 flex items-center space-x-3">
                    {/* Location Pin Icon */}

                    <span>Location</span>
                  </h3>
                  <div className="flex gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-8 h-8 text-orange-600"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 2C8.134 2 5 5.134 5 8c0 3 7 10 7 10s7-7 7-10c0-2.866-3.134-6-7-6z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 11c1.104 0 2-1.348 2-3s-.896-3-2-3-2 1.348-2 3 .896 3 2 3z"
                      />
                    </svg>
                    <p className="text-lg text-white font-bold">
                      {webinarData.venue}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Ticket Information */}
      <section className="mt-16">
        <h2 className="text-4xl font-semibold text-orange-600 mb-6">
          Ticket Information
        </h2>
        <div className="bg-gray-900 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6 border-2 border-solid border-orange-300 rounded-xl p-4 mt-4 mb-4">
          <div>
            <p className="text-lg">Ticket Type:</p>
            <p className="text-lg">Price:</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl text-center">
            <h3 className="text-2xl font-semibold text-orange-600">
              {" "}
              {webinarData.isPaid ? "Paid" : "Free"}
            </h3>
            <p className="text-lg font-bold">{webinarData.amount}</p>
          </div>
        </div>
      </section>

      {/* Enroll CTA */}
      <div className="mt-16 flex justify-center">
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
          className="bg-orange-600 px-8  mb-4 py-4 rounded-2xl text-white text-2xl font-semibold shadow-lg"
        >
          ENROLL FOR ₹{webinarData.amount}
        </button>
      </div>
      <PageFooter />
    </div>
  );
};

export default WebinarPages;
