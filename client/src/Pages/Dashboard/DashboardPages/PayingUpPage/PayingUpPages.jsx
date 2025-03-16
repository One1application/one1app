import { useState } from "react";
import * as Icons from "lucide-react";
import { payingUpConfig } from "./payingUpConfig";
import oneApp from "../../../../assets/oneapp.jpeg";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPayingUp, purchasePayingUp, verifyPayment } from "../../../../services/auth/api.services";
import { toast } from "react-toastify";
import SignupModal from "../../../../components/Modal/SignupModal";
import SigninModal from "../../../../components/Modal/SigninModal";

const PayingUpPages = () => {
  const [openFaq, setOpenFaq] = useState(-1);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentVerifying, setIsPaymentVerifying] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const itemsPerView = 3;
  const CurrencyIcon = Icons[payingUpConfig.paymentDetails.currencySymbol];
  const [params] = useSearchParams();
  const payingUpId = params.get('id');
  const token = localStorage.getItem('AuthToken')
  const [payingUpDetails, setPayingUpDetails] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const payup = async() => {
      setIsLoading(true);
      try {
        const response = await fetchPayingUp(payingUpId)
        // console.log(response);
        setPayingUpDetails(response.data.payload.payingUp)
      } catch (error) {
        console.error("Error while fetching paying up.", error);
        if (!handleAuthError(error)) {
          toast("Please try later.")
        }
      } finally {
        setIsLoading(false);
      }
    }
    payup()
  }, [payingUpId])

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  
  

  const nextSlide = () => {
    setCurrentTestimonialIndex((prevIndex) => 
      Math.min(prevIndex + 1, payingUpDetails.testimonials.testimonialsMetaData.length - itemsPerView)
    );
  };

  const prevSlide = () => {
    setCurrentTestimonialIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleAuthError = (error) => {
    if (error?.response?.data?.message === "Token not found, Access Denied!" || 
        error?.message === "Token not found, Access Denied!") {
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
      const orderDetails = response.data.payload

      var options = {
        "key": import.meta.env.VITE_RAZORPAY_KEY,
        "amount": orderDetails.amount,
        "currency": orderDetails.currency,
        "name": "One App",
        "description": "Complete Your Purchase",
        "order_id": orderDetails.orderId,
        "handler": async function (response) {
          console.log("payment");
          const body = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            webinarId: orderDetails.webinarId? orderDetails.webinarId : null,
            courseId: orderDetails.courseId? orderDetails.courseId : null,
            payingUpId: orderDetails.payingUpId? orderDetails.payingUpId : null,
          }; 

          try {
            setIsPaymentVerifying(true);
            const response = await verifyPayment(body);
            if (response.data && response.data.payload && response.data.payload.urls) {
              setPaymentUrl(response.data.payload.urls);
              setIsPurchased(true);
              toast.success("Payment successful!");
            }
          } catch (error) {
            console.error("Error while verifying payment.", error);
            toast("Payment Failed")
          } finally {
            setIsPaymentVerifying(false);
          }
        },
        "prefill": {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "contact": "9999999999"
        },
        "theme": {
            "color": "#F37254"
        }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open()
      
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
    <div className="min-h-screen bg-black scrollbar-hide overflow-y-scroll">
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
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-8 text-white">
            {payingUpDetails.title}
          </h1>
          {!isPurchased ? (
            <button
              onClick={handlePayment}
              disabled={!payingUpDetails.paymentDetails.paymentEnabled}
              className="bg-black text-orange-500 py-4 px-10 rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300 shadow-xl inline-flex items-center space-x-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{payingUpDetails.paymentDetails.paymentButtonTitle}</span>
              {CurrencyIcon && <CurrencyIcon className="w-6 h-6" />}
              <span>{payingUpDetails.paymentDetails.totalAmount}</span>
            </button>
          ) : (
            <div className="bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center">
              <Icons.CheckCircle className="w-5 h-5 mr-2" />
              <span>Payed</span>
            </div>
          )}
        </div>
      </section>

      {/* Payment Data URL Section */}
      {paymentUrl && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              Your Data
            </h2>
            <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl border border-orange-500/20">
              <div className="text-center">
                <a 
                  href={paymentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400 underline text-xl break-all"
                >
                  {paymentUrl}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Description Section */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              Overview
            </h2>
          <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl border border-orange-500/20">
            <div className="text-gray-300 mb-6 leading-relaxed text-lg" 
              dangerouslySetInnerHTML={{ __html: payingUpDetails.description }}>
            </div>
          </div>
        </div>
      </section>

   

      {/* Cover Image Section */}
      {payingUpDetails.coverImage.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              Cover Image
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-orange-500/20">
              <img
                src={payingUpDetails.coverImage.value}
                alt="Course Cover"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </section>
      )}

         {/* Categories Section */}
         {payingUpDetails.category.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {payingUpDetails.category.categoryMetaData.map((category, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-orange-500/20"
                >
                  <span className="text-xl font-semibold text-white">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {payingUpDetails.testimonials.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
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
                disabled={currentTestimonialIndex >= payingUpDetails.testimonials.testimonialsMetaData.length - itemsPerView}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-orange-500 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Testimonials Container */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {payingUpDetails.testimonials.testimonialsMetaData
                  .slice(currentTestimonialIndex, currentTestimonialIndex + itemsPerView)
                  .map((testimonial, index) => (
                    <div
                      key={index}
                      className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-orange-500/20"
                    >
                      <div className="flex items-center mb-4">
                        <img
                          src={testimonial.profilePic || oneApp}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-orange-500"
                        />
                        <div className="ml-4">
                          <h3 className="font-semibold text-white text-lg">
                            {testimonial.name}
                          </h3>
                          <div className="flex text-orange-500">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Icons.Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300">{testimonial.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rest of the sections remain the same... */}
      {/* FAQ Section */}
      {payingUpDetails.faqs.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payingUpDetails.faqs.faQMetaData.map((faq, index) => (
                <div 
                  key={index} 
                  className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-orange-500/20"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <h3 className="text-xl font-semibold mb-3 text-white flex justify-between items-center cursor-pointer">
                    {faq.question}
                    <Icons.ChevronDown
                      className={`w-5 h-5 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                    />
                  </h3>
                  <div className={`overflow-hidden transition-all ${openFaq === index ? "block" : "hidden"}`}>
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
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              Refund Policies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payingUpDetails.refundPolicies.refundPoliciesMetaData.map((policy, index) => (
                <div key={index} className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-orange-500/20">
                  <p className="text-gray-300">{policy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Terms & Conditions */}
      {payingUpDetails.tacs.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              Terms & Conditions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payingUpDetails.tacs.termAndConditionsMetaData.map((term, index) => (
                <div key={index} className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-orange-500/20">
                  <p className="text-gray-300">{term}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Footer */}
      <section className="py-12 px-4 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">
            Need Help?
          </h2>
          <div className="flex justify-center gap-8">
            <a
              href={`mailto:${payingUpDetails.paymentDetails.ownerEmail}`}
              className="bg-black text-orange-500 py-4 px-10 rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300 shadow-xl inline-flex items-center space-x-3 text-lg"
            >
              <Icons.Mail className="w-6 h-6" />
              <span>{payingUpDetails.paymentDetails.ownerEmail}</span>
            </a>
            <a
              href={`tel:${payingUpDetails.paymentDetails.ownerPhone}`}
              className="bg-black text-orange-500 py-4 px-10 rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300 shadow-xl inline-flex items-center space-x-3 text-lg"
            >
              <Icons.Phone className="w-6 h-6" />
              <span>{payingUpDetails.paymentDetails.ownerPhone}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PayingUpPages;