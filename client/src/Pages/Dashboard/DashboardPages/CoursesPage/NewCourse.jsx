import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { courseConfig } from "./courseConfig";
import oneApp from "../../../../assets/oneapp.jpeg";
import { useSearchParams } from "react-router-dom";
import { fetchCourse, purchaseCourse, verifyPayment } from "../../../../services/auth/api.services";
import { toast } from "react-toastify";
import SignupModal from "../../../../components/Modal/SignupModal";
import SigninModal from "../../../../components/Modal/SigninModal";

const NewCourse = () => {
  const [openFaq, setOpenFaq] = useState(-1);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentVerifying, setIsPaymentVerifying] = useState(false);
  const itemsPerView = 3;
  const CurrencyIcon = Icons[courseConfig.currencySymbol];
  const [params] = useSearchParams();
  const courseId = params.get('id');
  const [courseDetails, setCourseDetails] = useState(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

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

  useEffect(() => {
    const getCourse = async() => {
      setIsLoading(true);
      try {
        const response = await fetchCourse(courseId);
        console.log(response);
        setCourseDetails(response.data.payload.course);
      } catch (error) {
        console.error("Error while fetching course.", error);
        if (!handleAuthError(error)) {
          toast("Please try later.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    getCourse();
  }, [courseId]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const nextSlide = () => {
    setCurrentTestimonialIndex((prevIndex) =>
      Math.min(
        prevIndex + 1,
        courseConfig.testimonials.testimonialsMetaData.length - itemsPerView
      )
    );
  };

  const prevSlide = () => {
    setCurrentTestimonialIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handlePayment = async () => {
    try {
      const response = await purchaseCourse(courseId);
      console.log(response);
      const orderDetails = response.data.payload;

      var options = {
        "key": import.meta.env.VITE_RAZORPAY_KEY,
        "amount": orderDetails.amount,
        "currency": orderDetails.currency,
        "name": "One App",
        "description": "Complete Your Course Purchase",
        "order_id": orderDetails.orderId,
        "handler": async function (response) {
          const body = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId: orderDetails.courseId
          };

          try {
            setIsPaymentVerifying(true);
            await verifyPayment(body);
            toast("Payment successful!");
          } catch (error) {
            console.error("Error while verifying payment.", error);
            toast("Payment Failed");
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
      rzp1.open();
    } catch (error) {
      if (!handleAuthError(error)) {
        console.log("Error during course payment.", error);
        toast("Payment initiation failed");
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

  if (!courseDetails) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">
      No course data available
    </div>;
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

      {/* Add Payment Verification Loading Overlay */}
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
            {courseDetails.title}
          </h1>
          <button
            onClick={handlePayment}
            className="bg-black text-orange-500 py-4 px-10 rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300 shadow-xl inline-flex items-center space-x-3 text-lg"
          >
            <span>Enroll for</span>
            {CurrencyIcon && <CurrencyIcon className="w-6 h-6" />}
            <span>{courseDetails.price}</span>
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="p-8 bg-gray-900 rounded-2xl shadow-2xl border border-orange-500/20">
            <h2 className="text-4xl font-bold mb-6 text-orange-500">
              About the Course
            </h2>
            <div 
              className="text-gray-300 mb-6 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: courseDetails.aboutThisCourse.description }}
            />
            <ul className="space-y-4">
              {courseDetails.aboutThisCourse.features.map((feature, index) => (
                feature && (
                  <li
                    key={index}
                    className="flex items-center space-x-4 text-gray-200"
                  >
                    <Icons.CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <span className="text-lg">{feature}</span>
                  </li>
                )
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Cover Image Section */}
      {courseDetails.coverImage.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-orange-500/20">
              <img
                src={courseDetails.coverImage.value}
                alt={courseDetails.coverImage.altText}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Language Section */}
      {courseDetails.language.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              {courseDetails.language.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {courseDetails.language.value.map((language, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-orange-500/20"
                >
                  <span className="text-xl font-semibold text-white">
                    {language}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Course Benefits */}
      {courseDetails.courseBenefits.benefitsActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              {courseDetails.courseBenefits.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courseDetails.courseBenefits.benefitsMetaData.map(
                (benefit, index) => (
                  benefit.title && (
                    <div
                      key={index}
                      className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-orange-500/20"
                    >
                      <div className="text-xl font-semibold text-white">
                        <span className="mr-2">{benefit.emoji}</span>
                        {benefit.title}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {courseDetails.testimonials.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              {courseDetails.testimonials.title}
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
                  courseDetails.testimonials.testimonialsMetaData.length -
                    itemsPerView
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-orange-500 p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Testimonials Container */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courseDetails.testimonials.testimonialsMetaData
                  .slice(
                    currentTestimonialIndex,
                    currentTestimonialIndex + itemsPerView
                  )
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
                              <Icons.Star
                                key={i}
                                className="w-4 h-4 fill-current"
                              />
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

      {/* Gallery Section */}
      {courseDetails.gallery.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              {courseDetails.gallery.title}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {courseDetails.gallery.imageMetaData.map((image, index) => (
                image.name && (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-orange-500/20"
                  >
                    <img
                      src={image.image || oneApp}
                      alt={image.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      {courseDetails.products?.[0]?.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              {courseDetails.products[0].title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courseDetails.products[0].productMetaData.map((product, index) => (
                product.name && (
                  <a
                    key={index}
                    href={product.productLink}
                    className="block p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 relative group border border-orange-500/20"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      {product.name}
                    </h3>
                    <div className="flex items-center text-orange-500 font-semibold">
                      {CurrencyIcon && <CurrencyIcon className="w-5 h-5 mr-1" />}
                      <span>{product.price}</span>
                    </div>
                    <Icons.ArrowRight className="w-6 h-6 text-orange-500 absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lessons Section */}
      {courseDetails.lessons?.[0]?.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              Lessons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courseDetails.lessons[0].lessonData.map((lesson, index) => (
                lesson.lessonName && (
                  <div
                    key={index}
                    className="block p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 relative group border border-orange-500/20"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-white">
                      {lesson.lessonName}
                    </h3>
                    <div className="space-y-2">
                      {lesson.videos.map((video, vIndex) => (
                        video && (
                          <a
                            key={vIndex}
                            href={video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-300 hover:text-orange-500"
                          >
                            <Icons.Play className="w-5 h-5 mr-2" />
                            <span>Watch Video {vIndex + 1}</span>
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {courseDetails.faqs.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
              {courseDetails.faqs.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courseDetails.faqs.faQMetaData.map((faq, index) => (
                faq.question && (
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
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-12 px-4 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">
            Ready to Transform Your Skills?
          </h2>
          <button
            onClick={handlePayment}
            className="bg-black text-orange-500 py-4 px-10 rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300 shadow-xl inline-flex items-center space-x-3 text-lg"
          >
            <span>Enroll Now for</span>
            {CurrencyIcon && <CurrencyIcon className="w-6 h-6" />}
            <span>{courseDetails.price}</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default NewCourse;
