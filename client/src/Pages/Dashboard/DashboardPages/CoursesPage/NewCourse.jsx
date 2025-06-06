import * as Icons from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import oneApp from "../../../../assets/oneapp.jpeg";
import SigninModal from "../../../../components/Modal/SigninModal";
import { useAuth } from "../../../../context/AuthContext";
import {
  fetchCourse,

} from "../../../../services/auth/api.services";
import PageFooter from "../PayingUpPage/PageFooter";
import { courseConfig } from "./courseConfig";
import HeaderImage from "../../../../components/SellingPageShare/HeaderImage";
import CreatorInfo from "../../../../components/SellingPageShare/CreatorInfo";
import BackGroundCard from "../../../../components/SellingPageShare/BackGroundCard";
import OverViewExploreData from "../../../../components/SellingPageShare/OverViewExploreData";
import TestiMonials from "../../../../components/SellingPageShare/TestiMonials";
import TextBox from "../../../../components/SellingPageShare/TextBox";
import PaymentSignUpModel from "../../../../components/Modal/PaymentSignUpModel";

const NewCourse = () => {
  const [openFaq, setOpenFaq] = useState(-1);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentVerifying, setIsPaymentVerifying] = useState(false);
  const itemsPerView = 3;
  const CurrencyIcon = Icons[courseConfig.currencySymbol];
  const [params] = useSearchParams();
  const courseId = params.get("id");
  const [courseDetails, setCourseDetails] = useState(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isPurchased, setIsPurchased] = useState(false);
  const navigate = useNavigate();
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

  const handleSaveEmail = (email) => {
    setUserEmail(email);
    setShowSignupModal(false);
    toast.success("Email updated successfully!");
    navigate("/app/payment", {
      state: {
        id: courseId,
        title: courseDetails.title,
        baseAmount: courseDetails.price,
        courseType: "course",
        createdBy: courseDetails.creator.name
      },
    });
  };

  const handleSuccessfulSignup = (data) => {
    if (data.token) {
      localStorage.setItem("AuthToken", data.token);
      setShowSignupModal(false);
      toast.success("Signup successful!");
      navigate("/app/payment", {
        state: {
          id: courseId,
          title: courseDetails.title,
          baseAmount: courseDetails.price,
          courseType: "course",
           createdBy: courseDetails.creator.name
        },
      });
    }
  };

  console.log("courseDetails", courseDetails)
  const handleSuccessfulSignIn = (data) => {
    if (data.token) {
      localStorage.setItem("AuthToken", data.token);
      setShowSigninModal(false);
      toast.success("SignIn successful!");
      navigate("/app/payment", {
        state: {
          id: courseId,
          title: courseDetails.title,
          baseAmount: courseDetails.price,
          courseType: "course",
           createdBy: courseDetails?.creator?.name
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

  useEffect(() => {
    const getCourse = async () => {
      setIsLoading(true);
      try {
        const response = await fetchCourse(courseId);
        setCourseDetails(response.data.payload.course);

        // Check if the course has been purchased
        if (
          response.data.payload.course.lessons ||
          response.data.payload.course.createdBy === currentUserId
        ) {
          setIsPurchased(true);
        }
      } catch (error) {
        console.error("Error while fetching course.", error);
        if (!handleAuthError(error)) {
          toast("Please try later.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    getCourse();
  }, [courseId, currentUserId]);

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
        courseConfig.testimonials.testimonialsMetaData.length - itemsPerView
      )
    );
  };

  const prevSlide = () => {
    setCurrentTestimonialIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  // const handlePayment = async () => {
  //   try {
  //     const response = await purchaseCourse(courseId);
  //     window.location.href = response.data.payload.redirectUrl;
  //     // const orderDetails = response.data.payload;

  //     // var options = {
  //     //   "key": import.meta.env.VITE_RAZORPAY_KEY,
  //     //   "amount": orderDetails.amount,
  //     //   "currency": orderDetails.currency,
  //     //   "name": "One App",
  //     //   "description": "Complete Your Course Purchase",
  //     //   "order_id": orderDetails.orderId,
  //     //   "handler": async function (response) {
  //     //     const body = {
  //     //       razorpay_order_id: response.razorpay_order_id,
  //     //       razorpay_payment_id: response.razorpay_payment_id,
  //     //       razorpay_signature: response.razorpay_signature,
  //     //       courseId: orderDetails.courseId
  //     //     };

  //     //     try {
  //     //       setIsPaymentVerifying(true);
  //     //       const verifyResponse = await verifyPayment(body);
  //     //       if (verifyResponse.data.success) {
  //     //         setIsPurchased(true);

  //     //         toast.success("Payment successful!");
  //     //         window.location.href = `/app/course/lessons?courseid=${courseId}`;
  //     //       }
  //     //     } catch (error) {
  //     //       console.error("Error while verifying payment.", error);
  //     //       toast.error("Payment Failed");
  //     //     } finally {
  //     //       setIsPaymentVerifying(false);
  //     //     }
  //     //   },
  //     //   "prefill": {
  //     //     "name": "John Doe",
  //     //     "email": "john.doe@example.com",
  //     //     "contact": "9999999999"
  //     //   },
  //     //   "theme": {
  //     //     "color": "#F37254"
  //     //   }
  //     // };

  //     // const rzp1 = new window.Razorpay(options);
  //     // rzp1.open();
  //   } catch (error) {
  //     if (!handleAuthError(error)) {
  //       console.log("Error during course payment.", error);
  //       toast("Payment initiation failed");
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

  if (!courseDetails) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="px-5">
          <div className="bg-gray-700">
            <HeaderImage imageurl={'payingUpDetails.coverImage.value'} />
          </div>
          <CreatorInfo />
        </div>

        <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4">
          About the Course
        </div>

        <div className="px-10">
          <BackGroundCard childrenCom={<div className="mt-4 flex flex-col gap-8">
            <OverViewExploreData />
            <OverViewExploreData />
            <OverViewExploreData />
          </div>} />
        </div>

        <div className="flex justify-between">

          <div className="flex flex-col w-full justify-center items-center">
            <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4">
              Features
            </div>

            <div>
              <BackGroundCard childrenCom={'data'} />
            </div>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4">
              Course Linked
            </div>
            <div>
              <BackGroundCard childrenCom={'data'} />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4">
          Course Benefits
        </div>
        <div className="flex w-full justify-center items-center mb-5">
          <div className="grid md:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-8 justify-center items-center px-10">
            <BackGroundCard childrenCom={<div>Data</div>} />
            <BackGroundCard childrenCom={<div>Data</div>} />
            <BackGroundCard childrenCom={<div>Data</div>} />
            <BackGroundCard childrenCom={<div>Data</div>} />
            <BackGroundCard childrenCom={<div>Data</div>} />
            <BackGroundCard childrenCom={<div>Data</div>} />
            <BackGroundCard childrenCom={<div>Data</div>} />
          </div>
        </div>

        <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4">
          Products
        </div>
        <div className="flex w-full justify-center items-center mb-5">
          <div className="grid md:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-8 justify-center items-center px-10">
            <BackGroundCard childrenCom={<div>Data</div>} />
            <BackGroundCard childrenCom={<div>Data</div>} />
            <BackGroundCard childrenCom={<div>Data</div>} />
            <BackGroundCard childrenCom={<div>Data</div>} />
            <BackGroundCard childrenCom={<div>Data</div>} />
            <BackGroundCard childrenCom={<div>Data</div>} />
            <BackGroundCard childrenCom={<div>Data</div>} />
          </div>
        </div>

        <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4">
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

        <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4">
          Frequently Asked Questions
        </div>
        <div className="flex justify-center items-center">
          <div className=" grid grid-cols-2  justify-center items-center gap-4">
            <BackGroundCard childrenCom={<TextBox dtype={''} color='orange' />} />
            <BackGroundCard childrenCom={<TextBox dtype={''} color='orange' />} />
          </div>
        </div>
        No course data available
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
        onSuccessfulLogin={handleSuccessfulSignIn}
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
          {!isPurchased ? (
            <button
              onClick={() => {
                //first check if user is authenticated
                if (!currentUserId) {
                  setShowSignupModal(true);
                } else {
                  navigate("/app/payment", {
                    state: {
                      id: courseId,
                      title: courseDetails.title,
                      baseAmount: courseDetails.price,
                      courseType: "course",
                       createdBy: courseDetails.creator.name
                    },
                  });
                }
              }}
              className="bg-black text-orange-500 py-4 px-10 rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300 shadow-xl inline-flex items-center space-x-3 text-lg"
            >
              <span>Enroll for</span>
              {CurrencyIcon && <CurrencyIcon className="w-6 h-6" />}
              <span>{courseDetails.price}</span>
            </button>
          ) : courseDetails.createdBy === currentUserId ? (
            <div className="bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center">
              <Icons.CheckCircle className="w-5 h-5 mr-2" />
              <span>You Created This</span>
            </div>
          ) : (
            <div className="bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center">
              <Icons.CheckCircle className="w-5 h-5 mr-2" />
              <span>Already Purchased</span>
            </div>
          )}
        </div>
      </section>

      {/* Lessons Section - Moved to top and modified */}

      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center text-orange-500">
            Course Content
          </h2>
          <div className="flex justify-center">
            {isPurchased ? (
              <button
                onClick={() =>
                  navigate(`/app/course/lessons?courseid=${courseId}`)
                }
                className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-10 rounded-lg font-bold transition-colors duration-300 shadow-xl inline-flex items-center space-x-3 text-lg"
              >
                <Icons.BookOpen className="w-6 h-6 mr-2" />
                <span>Go to Course Lessons</span>
              </button>
            ) : (
              <div className="p-6 bg-gray-900 rounded-xl shadow-xl border border-orange-500/20 text-center">
                <Icons.Lock className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Course Content Locked
                </h3>
                <p className="text-gray-300">
                  Purchase this course to access all lessons and materials
                </p>
              </div>
            )}
          </div>
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
              dangerouslySetInnerHTML={{
                __html: courseDetails.aboutThisCourse.description,
              }}
            />
            {courseDetails.validity && (
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3 text-orange-500">
                  Course Validity :{" "}
                  <span className="text-white text-xl">
                    {" "}
                    {courseDetails.validity}{" "}
                  </span>{" "}
                </h3>
              </div>
            )}
            <h3 className="text-2xl font-semibold mb-3 text-orange-500">
              {" "}
              Features :{" "}
            </h3>

            <ul className="space-y-4">
              {courseDetails.aboutThisCourse.features.map(
                (feature, index) =>
                  feature && (
                    <li
                      key={index}
                      className="flex items-center space-x-4 text-gray-200"
                    >
                      <Icons.CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                      <span className="text-lg">{feature}</span>
                    </li>
                  )
              )}
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
                (benefit, index) =>
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
              {courseDetails.gallery.imageMetaData.map(
                (image, index) =>
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
              )}
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
              {courseDetails.products[0].productMetaData.map(
                (product, index) =>
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
                        {CurrencyIcon && (
                          <CurrencyIcon className="w-5 h-5 mr-1" />
                        )}
                        <span>{product.price}</span>
                      </div>
                      <Icons.ArrowRight className="w-6 h-6 text-orange-500 absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  )
              )}
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
              {courseDetails.faqs.faQMetaData.map(
                (faq, index) =>
                  faq.question && (
                    <div
                      key={index}
                      className="p-6 bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-orange-500/20"
                      onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    >
                      <h3 className="text-xl font-semibold mb-3 text-white flex justify-between items-center cursor-pointer">
                        {faq.question}
                        <Icons.ChevronDown
                          className={`w-5 h-5 transition-transform ${openFaq === index ? "rotate-180" : ""
                            }`}
                        />
                      </h3>
                      <div
                        className={`overflow-hidden transition-all ${openFaq === index ? "block" : "hidden"
                          }`}
                      >
                        <p className="text-gray-300">{faq.answer}</p>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      {/* <section className="py-12 px-4 bg-gradient-to-r from-orange-600 to-orange-500">
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
      </section> */}

      {/* page footer */}
      <PageFooter />
    </div>
  );
};

export default NewCourse;
