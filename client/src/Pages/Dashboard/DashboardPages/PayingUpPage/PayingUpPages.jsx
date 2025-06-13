import * as Icons from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import oneApp from "../../../../assets/oneapp.jpeg";
import PaymentSignUpModel from "../../../../components/Modal/PaymentSignUpModel";
import SigninModal from "../../../../components/Modal/SigninModal";
import { useAuth } from "../../../../context/AuthContext";
import {
  fetchPayingUp,
  purchasePayingUp,
} from "../../../../services/auth/api.services";
import PageFooter from "./PageFooter";
import { payingUpConfig } from "./payingUpConfig";

import OverView from "../../../../components/SellingPageShare/OverView";
import TestiMonials from "../../../../components/SellingPageShare/TestiMonials";

import { useNavigate } from "react-router-dom";
import InfoSections from "../../../../components/InfoSections";
import { getInitials } from "../../../../utils/constants/nameCutter";

const PayingUpPages = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(-1);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentVerifying, setIsPaymentVerifying] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const itemsPerView = 3;
  const CurrencyIcon = Icons[payingUpConfig.paymentDetails.currencySymbol];
  const [params] = useSearchParams();
  const payingUpId = params.get("id");
  const token = localStorage.getItem("AuthToken");
  const [payingUpDetails, setPayingUpDetails] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const { currentUserId, userDetails } = useAuth();

  useEffect(() => {
    const payup = async () => {
      setIsLoading(true);
      try {
        const response = await fetchPayingUp(payingUpId);
        setPayingUpDetails(response.data.payload.payingUp);

        // Check if files exists in the response to determine if already purchased
        if (response.data.payload.payingUp.files) {
          setIsPurchased(true);
          // Handle both single and multiple file URLs
          const files = response.data.payload.payingUp.files.value;
          if (Array.isArray(files)) {
            setPaymentUrl(files.map((file) => file.url)); // Store array of file URLs
          } else {
            setPaymentUrl(files.url); // Store single file URL
          }
        }
      } catch (error) {
        console.error("Error while fetching paying up.", error);
        if (!handleAuthError(error)) {
          toast("Please try later.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    payup();
  }, [payingUpId, currentUserId]);

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  // }, []);

  // const nextSlide = () => {
  //   setCurrentTestimonialIndex((prevIndex) =>
  //     Math.min(
  //       prevIndex + 1,
  //       payingUpDetails.testimonials.testimonialsMetaData.length - itemsPerView
  //     )
  //   );
  // };

  // const prevSlide = () => {
  //   setCurrentTestimonialIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  // };

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

  const handleSaveEmail = (email) => {
    setUserEmail(email);
    toast.success("Email updated successfully!");
  };

  const handleSuccessfulSignup = (data) => {
    if (data.token) {
      localStorage.setItem("AuthToken", data.token);
      setShowSignupModal(false);
      toast.success("Signup successful!");
      navigate("/app/payment", {
        state: {
          id: payingUpId,
          title: payingUpDetails.title,
          baseAmount: payingUpDetails.paymentDetails.totalAmount,
          courseType: "payingUp",
          createdBy: payingUpDetails.createdBy.name,
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
          id: payingUpId,
          title: payingUpDetails.title,
          baseAmount: payingUpDetails.paymentDetails.totalAmount,
          courseType: "payingUp",
          createdBy: payingUpDetails.createdBy.name,
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

  // const handlePayment = async () => {
  //   try {
  //     const response = await purchasePayingUp(payingUpId);
  //     window.location.href = response.data.payload.redirectUrl;
  //     // var options = {
  //     //   key: import.meta.env.VITE_RAZORPAY_KEY,
  //     //   amount: orderDetails.amount,
  //     //   currency: orderDetails.currency,
  //     //   name: "One App",
  //     //   description: "Complete Your Purchase",
  //     //   order_id: orderDetails.orderId,
  //     //   handler: async function (response) {
  //     //     console.log("payment");
  //     //     const body = {
  //     //       razorpay_order_id: response.razorpay_order_id,
  //     //       razorpay_payment_id: response.razorpay_payment_id,
  //     //       razorpay_signature: response.razorpay_signature,
  //     //       webinarId: orderDetails.webinarId ? orderDetails.webinarId : null,
  //     //       courseId: orderDetails.courseId ? orderDetails.courseId : null,
  //     //       payingUpId: orderDetails.payingUpId
  //     //         ? orderDetails.payingUpId
  //     //         : null,
  //     //     };

  //     //     try {
  //     //       setIsPaymentVerifying(true);
  //     //       const response = await verifyPayment(body);
  //     //       if (
  //     //         response.data &&
  //     //         response.data.payload &&
  //     //         response.data.payload.urls
  //     //       ) {
  //     //         setPaymentUrl(response.data.payload.urls);
  //     //         setIsPurchased(true);
  //     //         toast.success("Payment successful!");
  //     //       }
  //     //     } catch (error) {
  //     //       console.error("Error while verifying payment.", error);
  //     //       toast("Payment Failed");
  //     //     } finally {
  //     //       setIsPaymentVerifying(false);
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
  //     if (!handleAuthError(error)) {
  //       toast.error("Error during payment of paying up.", error);
  //     }
  //   }
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!payingUpDetails) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        No data available
      </div>
    );
  }

  console.log(payingUpDetails);

  return (
    <div className="min-h-screen bg-gray-950 scrollbar-hide overflow-y-scroll ">
      <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold"></div>
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
        onSuccessfulLogin={handleSuccessfulSignIn}
        onSave={handleSaveEmail}
        onSwitchToSignup={handleSwitchToSignup}
      />

      {/* Payment Verification Loading Overlay */}
      {isPaymentVerifying && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-white text-lg">Verifying payment...</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      {/* Cover Image Section */}
      {payingUpDetails.coverImage.isActive && (
        <section className="">
          <div className="w-full mx-auto">
            <div className="relative overflow-hidden rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-orange-500/30 group transition-all duration-300 hover:shadow-[0_10px_40px_rgba(255,90,0,0.2)]">
              <img
                src={payingUpDetails.coverImage.value}
                alt="Course Cover"
                className="w-full h-[180px] sm:h-[220px] md:h-[280px] object-cover transition-transform duration-500 group-hover:scale-102"
              />
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-orange-900/70 mt-1 p-4 shadow-lg border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4 px-5">
                {/* Avatar or Initials */}
                <div className="flex items-center gap-4">
                  {userDetails?.userImage ? (
                    <img
                      className="w-12 h-12 rounded-full border-2 border-white/80 shadow-sm"
                      src={userDetails.userImage}
                      alt="Creator Avatar"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-600/90 flex items-center justify-center border-2 border-white/80">
                      <span className="text-lg font-bold text-white">
                        {getInitials(payingUpDetails.createdBy.name)}
                      </span>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-300 uppercase tracking-wider">
                      Created by
                    </p>
                    <h2 className="text-base font-semibold text-white">
                      {payingUpDetails.createdBy.name}
                    </h2>
                  </div>
                </div>

                {/* Title & Badge */}
                <div className="text-right flex flex-col items-center">
                  <h1 className="text-xl font-bold text-white truncate max-w-[180px]">
                    {payingUpDetails.title}
                  </h1>
                  <span className="inline-block px-2 py-1 text-xs font-bold bg-orange-500/90 text-white rounded-full">
                    PAYING UP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Payment Data URL Section */}
      {isPurchased && paymentUrl && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8  text-orange-500 text-center">
              Your Files
            </h2>
            <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl border border-orange-500">
              <div className="space-y-4">
                {Array.isArray(paymentUrl) ? (
                  paymentUrl.map((file, index) => (
                    <div key={index} className="text-center">
                      {console.log(file)}
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-400 underline text-xl break-all flex items-center justify-center gap-2"
                      >
                        <Icons.FileDown className="w-6 h-6" />
                        Download File {index + 1}
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    <a
                      href={paymentUrl}
                      target="_blank"
                      // rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400 underline text-xl break-all flex items-center justify-center gap-2"
                    >
                      <Icons.FileDown className="w-6 h-6" />
                      Download File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Description Section */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8  text-orange-500 text-center">
            Overview
          </h2>

          <OverView
            category={payingUpDetails.category.categoryMetaData.map(
              (category) => category
            )}
            description={payingUpDetails.description}
          />
        </div>
      </section>

      {/* Categories Section */}

      {/* Testimonials */}

      {payingUpDetails.testimonials.isActive && (
        <TestiMonials
          title={payingUpDetails.testimonials.title}
          testimonialsData={payingUpDetails.testimonials.testimonialsMetaData}
          defaultProfilePic={oneApp} // Pass your default profile picture
        />
      )}

      <div>
        <div className="flex flex-col relative">
          <InfoSections payingUpDetails={payingUpDetails} />

          <section className="flex justify-center absolute bottom-10 left-0 right-0">
            {!isPurchased ? (
              <button
                onClick={() => {
                  if (!currentUserId) {
                    setShowSignupModal(true);
                  } else {
                    navigate("/app/payment", {
                      state: {
                        id: payingUpId,
                        title: payingUpDetails.title,
                        baseAmount: payingUpDetails.paymentDetails.totalAmount,
                        courseType: "payingUp",
                        createdBy: payingUpDetails.createdBy.name,
                      },
                    });
                  }
                }}
                disabled={!payingUpDetails.paymentDetails.paymentEnabled}
                className="bg-orange-500 text-white py-4 px-10 rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300 shadow-xl inline-flex items-center space-x-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed border border-white"
              >
                <span>{payingUpDetails.paymentDetails.paymentButtonTitle}</span>
                {CurrencyIcon && <CurrencyIcon className="w-6 h-6" />}
                <span>{payingUpDetails.paymentDetails.totalAmount}</span>
              </button>
            ) : payingUpDetails.createdById === currentUserId ? (
              <div className="bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center">
                <Icons.CheckCircle className="w-5 h-5 mr-2" />
                <span>You Created This</span>
              </div>
            ) : (
              <a
                href="http://localhost:5174/dashboard"
                className="bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center font-medium hover:bg-green-700 transition-colors duration-300"
              >
                <Icons.LayoutDashboard className="w-5 h-5 mr-2" />
                <span>Go to Dashboard</span>
              </a>
            )}
          </section>
        </div>
      </div>

      {/* Contact Footer */}

      <PageFooter />
      {/* <section className="py-12 px-4 bg-gradient-to-r from-orange-600 to-orange-500">

      </section> */}
    </div>
  );
};

export default PayingUpPages;
