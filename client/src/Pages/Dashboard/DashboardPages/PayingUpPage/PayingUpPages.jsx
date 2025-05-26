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
import HeaderImage from "../../../../components/SellingPageShare/HeaderImage";
import CreatorInfo from "../../../../components/SellingPageShare/CreatorInfo";
import OverView from "../../../../components/SellingPageShare/OverView";
import TestiMonials from "../../../../components/SellingPageShare/TestiMonials";
import DropDown from "../../../../components/SellingPageShare/DropDown";
import BackGroundCard from "../../../../components/SellingPageShare/BackGroundCard";
import TextBox from "../../../../components/SellingPageShare/TextBox";

const PayingUpPages = () => {
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

  const { currentUserId } = useAuth();

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
  }, [payingUpId]);

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  // }, []);

  const nextSlide = () => {
    setCurrentTestimonialIndex((prevIndex) =>
      Math.min(
        prevIndex + 1,
        payingUpDetails.testimonials.testimonialsMetaData.length - itemsPerView
      )
    );
  };

  const prevSlide = () => {
    setCurrentTestimonialIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

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

  const handlePayment = async () => {
    try {
      const response = await purchasePayingUp(payingUpId);
      window.location.href = response.data.payload.redirectUrl;
      // var options = {
      //   key: import.meta.env.VITE_RAZORPAY_KEY,
      //   amount: orderDetails.amount,
      //   currency: orderDetails.currency,
      //   name: "One App",
      //   description: "Complete Your Purchase",
      //   order_id: orderDetails.orderId,
      //   handler: async function (response) {
      //     console.log("payment");
      //     const body = {
      //       razorpay_order_id: response.razorpay_order_id,
      //       razorpay_payment_id: response.razorpay_payment_id,
      //       razorpay_signature: response.razorpay_signature,
      //       webinarId: orderDetails.webinarId ? orderDetails.webinarId : null,
      //       courseId: orderDetails.courseId ? orderDetails.courseId : null,
      //       payingUpId: orderDetails.payingUpId
      //         ? orderDetails.payingUpId
      //         : null,
      //     };

      //     try {
      //       setIsPaymentVerifying(true);
      //       const response = await verifyPayment(body);
      //       if (
      //         response.data &&
      //         response.data.payload &&
      //         response.data.payload.urls
      //       ) {
      //         setPaymentUrl(response.data.payload.urls);
      //         setIsPurchased(true);
      //         toast.success("Payment successful!");
      //       }
      //     } catch (error) {
      //       console.error("Error while verifying payment.", error);
      //       toast("Payment Failed");
      //     } finally {
      //       setIsPaymentVerifying(false);
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
      if (!handleAuthError(error)) {
        toast.error("Error during payment of paying up.", error);
      }
    }
  };

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

  return (
    <div className="min-h-screen bg-black scrollbar-hide overflow-y-scroll ">

      <div className="px-5">
        <HeaderImage imageurl={payingUpDetails.coverImage.value}/>
        <CreatorInfo />
      </div>

      <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4">
        OverView
      </div>

      <div className="px-10">
        <OverView />
      </div>

      <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4 mt-12">
        TestiMonials
      </div>
      <div className="flex w-full justify-center items-center">
        <div className="grid md:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-8 justify-center items-center px-10">
          <TestiMonials />
          <TestiMonials />
          <TestiMonials />
          <TestiMonials />
          <TestiMonials />
          <TestiMonials />
        </div>
      </div>

      <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4 mt-12">
        Frequently Asked Questions
      </div>
      <div className="flex justify-center items-center">
        <div className=" grid grid-cols-2  justify-center items-center gap-4">
          <BackGroundCard childrenCom={<DropDown />} />
          <BackGroundCard childrenCom={<DropDown />} />
          <BackGroundCard childrenCom={<DropDown />} />
        </div>
      </div>

      <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4 mt-12">
        Refunds Policies
      </div>
      <div className="flex justify-center items-center">
        <div className=" grid grid-cols-2  justify-center items-center gap-4">
          <BackGroundCard childrenCom={<TextBox dtype={''} color='normal' />} />
          <BackGroundCard childrenCom={<TextBox dtype={''} color='normal' />} />
          <BackGroundCard childrenCom={<TextBox dtype={''} color='normal' />} />
        </div>
      </div>
      
      <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4 mt-12">
        Terms & Conditions
      </div>
      <div className="flex justify-center items-center">
        <div className=" grid grid-cols-2  justify-center items-center gap-4">
          <BackGroundCard childrenCom={<TextBox dtype={''} color='normal' />} />
          <BackGroundCard childrenCom={<TextBox dtype={''} color='normal' />} />
          <BackGroundCard childrenCom={<TextBox dtype={''} color='normal' />} />
        </div>
      </div>
      <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4 mt-12">
        Need Help
      </div>
      <div className="flex justify-center items-center">
        <div className=" grid grid-cols-2  justify-center items-center gap-4">
          <BackGroundCard childrenCom={<TextBox dtype={''} color='orange' />} />
          <BackGroundCard childrenCom={<TextBox dtype={''} color='orange' />} />
        </div>
      </div>


      <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4 mt-12">
        
      </div>
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
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
          
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-orange-500/20">
              <img
                src={payingUpDetails.coverImage.value}
                alt="Course Cover"
                className="w-full h-[450px] max-md:h-auto object-cover"
              />
            </div>
             <div className="bg-gradient-to-br from-orange-600/80 to-gray-900/60 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <img
            className="w-28 h-28 rounded-full border-4 border-white"
            src="https://placehold.co/120x120"
            alt="Creator Avatar"
          />
          <div>
            <p className="text-xl text-gray-300">Created by</p>
            <h2 className="text-3xl font-bold text-white">{payingUpDetails.createdBy.name}</h2>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-200">{payingUpDetails.title}</h1>
          <p className="text-2xl font-semibold text-gray-300">Paying Up</p>
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
          <h2 className="text-3xl font-bold mb-8  text-orange-500 text-center">Overview</h2>
          <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl border border-orange-500">
              {payingUpDetails.category.isActive && (
        <section className="py-10 px-4 ">
          <div className="max-w-6xl mx-auto">
           
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {payingUpDetails.category.categoryMetaData.map(
                (category, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-orange-500/20 bg-orange-500 text-center"
                  >
                    <span className="text-xl font-semibold text-white">
                      {category}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}
            <div
              className="text-gray-300 mb-6 leading-relaxed text-lg text-white"
              dangerouslySetInnerHTML={{ __html: payingUpDetails.description }}
            ></div>
          
        
      </div>
        </div>
      </section>

      

      {/* Categories Section */}
      

      {/* Testimonials */}
      {payingUpDetails.testimonials.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8  text-orange-500 text-center">
              {payingUpDetails.testimonials.title}
            </h2>
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                disabled={currentTestimonialIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-orange-500 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={nextSlide}
                disabled={
                  currentTestimonialIndex >=
                  payingUpDetails.testimonials.testimonialsMetaData.length -
                    itemsPerView
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-orange-500 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Testimonials Container */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {payingUpDetails.testimonials.testimonialsMetaData
    .slice(
      currentTestimonialIndex,
      currentTestimonialIndex + itemsPerView
    )
    .map((testimonial, index) => (
      <div
        key={index}
        className="p-6 bg-gradient-to-r from-orange-500 to-yellow-600 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white transform hover:scale-105"
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src={testimonial.profilePic || oneApp}
            alt={testimonial.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="text-center mt-4">
            <h3 className="font-semibold text-white text-2xl">{testimonial.name}</h3>
            <div className="flex justify-center mt-2 text-yellow-400 font-bold">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Icons.Star
                  key={i}
                  className="w-5 h-5 fill-current"
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-200 text-base text-center text-white font-semibold">{testimonial.statement}</p>
      </div>
    ))}
</div>

            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {payingUpDetails.faqs.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8  text-orange-500 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payingUpDetails.faqs.faQMetaData.map((faq, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-orange-500"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <h3 className="text-xl font-semibold mb-3 text-white flex justify-between items-center cursor-pointer">
                    {faq.question}
                    <Icons.ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </h3>
                  <div
                    className={`overflow-hidden transition-all ${
                      openFaq === index ? "block" : "hidden"
                    }`}
                  >
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Refund Policies */}
      {payingUpDetails.refundPolicies.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8  text-orange-500 text-center">
              Refund Policies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payingUpDetails.refundPolicies.refundPoliciesMetaData.map(
                (policy, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-orange-500"
                  >
                    <p className="text-gray-300">{policy}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Terms & Conditions */}
      {payingUpDetails.tacs.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8  text-orange-500 text-center">
              Terms & Conditions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payingUpDetails.tacs.termAndConditionsMetaData.map(
                (term, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-orange-500"
                  >
                    <p className="text-gray-300">{term}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Need Help */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8  text-orange-500 text-center">
            Need Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-white">
              <a
                href={`mailto:${payingUpDetails.paymentDetails.ownerEmail}`}
                className=" text-orange-500  rounded-lg font-bold   shadow-xl inline-flex items-center space-x-3 text-lg"
              >
                <Icons.Mail className="w-6 h-6" />
                <span>{payingUpDetails.paymentDetails.ownerEmail}</span>
              </a>
            </div>
            <div className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-white">
              <a
                href={`tel:${payingUpDetails.paymentDetails.ownerPhone}`}
                className=" text-orange-500  font-bold shadow-xl inline-flex items-center space-x-3 text-lg"
              >
                <Icons.Phone className="w-6 h-6" />
                <span>{payingUpDetails.paymentDetails.ownerPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-center">
       {!isPurchased ? ( <button
              onClick={handlePayment}
              disabled={!payingUpDetails.paymentDetails.paymentEnabled}
              className="bg-orange-500 text-white py-4 px-10 rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300 shadow-xl inline-flex items-center space-x-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed border border-white"
            >
              <span>{payingUpDetails.paymentDetails.paymentButtonTitle}</span>
              {CurrencyIcon && <CurrencyIcon className="w-6 h-6" />}
              <span>{payingUpDetails.paymentDetails.totalAmount}</span>
            </button>)
            :
           ( <div className="bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center">
              <Icons.CheckCircle className="w-5 h-5 mr-2" />
              <span>Already Purchased</span>
            </div>)
}
      </section>

      {/* Contact Footer */}

      <PageFooter />
      {/* <section className="py-12 px-4 bg-gradient-to-r from-orange-600 to-orange-500">

      </section> */}
    </div>
  );
};

export default PayingUpPages;
