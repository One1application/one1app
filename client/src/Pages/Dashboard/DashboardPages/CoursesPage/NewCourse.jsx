import * as Icons from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import oneApp from "../../../../assets/oneapp.jpeg";
import SigninModal from "../../../../components/Modal/SigninModal";
import { useAuth } from "../../../../context/AuthContext";
import { fetchCourse } from "../../../../services/auth/api.services";
import PageFooter from "../PayingUpPage/PageFooter";
import { courseConfig } from "./courseConfig";
import HeaderImage from "../../../../components/SellingPageShare/HeaderImage";
import CreatorInfo from "../../../../components/SellingPageShare/CreatorInfo";
import BackGroundCard from "../../../../components/SellingPageShare/BackGroundCard";
import OverViewExploreData from "../../../../components/SellingPageShare/OverViewExploreData";
import TestiMonials from "../../../../components/SellingPageShare/TestiMonials";
import TextBox from "../../../../components/SellingPageShare/TextBox";
import PaymentSignUpModel from "../../../../components/Modal/PaymentSignUpModel";
import { getInitials } from "../../../../utils/constants/nameCutter.js";
import InfoSections from "../../../../components/InfoSections.jsx";
import ThreeinOne from "./ThreeinOne.jsx";

const NewCourse = () => {
  const { userDetails } = useAuth();
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

  const getValidityDetails = (validity) => {
    switch (validity) {
      case "Weekly":
        return {
          icon: <Icons.RefreshCw size={20} className="text-blue-500" />,
          text: "7-day access",
          style: "bg-blue-50 text-blue-600 border-blue-200",
        };
      case "Monthly":
        return {
          icon: <Icons.Calendar size={20} className="text-green-500" />,
          text: "30-day access",
          style: "bg-green-50 text-green-600 border-green-200",
        };
      case "Yearly":
        return {
          icon: <Icons.Star size={20} className="text-amber-500" />,
          text: "1-year access",
          style: "bg-amber-50 text-amber-600 border-amber-200",
        };
      case "Lifetime":
        return {
          icon: <Icons.Crown size={20} className="text-purple-500" />,
          text: "Forever access",
          style: "bg-purple-50 text-purple-600 border-purple-200",
        };
      default:
        return {
          icon: <Icons.HelpCircle size={20} className="text-gray-500" />, // Fallback icon
          text: "Unknown plan",
          style: "bg-gray-50 text-gray-600 border-gray-200",
        };
    }
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
    setShowSignupModal(false);
    toast.success("Email updated successfully!");
    navigate("/app/payment", {
      state: {
        id: courseId,
        title: courseDetails.title,
        baseAmount: courseDetails.price,
        courseType: "course",
        createdBy: courseDetails.creator.name,
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
          createdBy: courseDetails.creator.name,
        },
      });
    }
  };

  console.log("courseDetails", courseDetails);
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
          createdBy: courseDetails?.creator?.name,
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
            <HeaderImage imageurl={"payingUpDetails.coverImage.value"} />
          </div>
          <CreatorInfo />
        </div>
        <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4">
          About the Course
        </div>
        <div className="px-10">
          <BackGroundCard
            childrenCom={
              <div className="mt-4 flex flex-col gap-8">
                <OverViewExploreData />
                <OverViewExploreData />
                <OverViewExploreData />
              </div>
            }
          />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col w-full justify-center items-center">
            <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4">
              Features
            </div>

            <div>
              <BackGroundCard childrenCom={"data"} />
            </div>
          </div>
          <div className="flex flex-col w-full justify-center items-center">
            <div className="flex justify-center items-center w-full text-[#EC5D0E] text-xl font-semibold pb-4">
              Course Linked
            </div>
            <div>
              <BackGroundCard childrenCom={"data"} />
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
            <BackGroundCard
              childrenCom={<TextBox dtype={""} color="orange" />}
            />
            <BackGroundCard
              childrenCom={<TextBox dtype={""} color="orange" />}
            />
          </div>
        </div>
        No course data available
      </div>
    );
  }

  return (
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

      {courseDetails?.coverImage?.isActive && (
        <section className="">
          <div className="w-full mx-auto">
            <div className="relative overflow-hidden rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-orange-500/30 group transition-all duration-300 hover:shadow-[0_10px_40px_rgba(255,90,0,0.2)]">
              <img
                src={courseDetails?.coverImage?.value}
                alt="Course Cover"
                className="w-full h-[180px] sm:h-[220px] md:h-[280px] object-cover transition-transform duration-500 group-hover:scale-102"
              />
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-orange-900/70 mt-1 p-4 shadow-lg border border-white/10 backdrop-blur-sm">
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-4 px-5">
                  {/* Avatar or Initials */}
                  <div className="flex items-center gap-4">
                    {userDetails?.avatar ? (
                      <img
                        className="w-12 h-12 rounded-full border-2 border-white/80 shadow-sm"
                        src={userDetails.avatar}
                        alt="Creator Avatar"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-600/90 flex items-center justify-center border-2 border-white/80">
                        <span className="text-lg font-bold text-white">
                          {getInitials(courseDetails?.creator?.name)}
                        </span>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-gray-300 uppercase tracking-wider">
                        Created by
                      </p>
                      <h2 className="text-base font-semibold text-white">
                        {courseDetails.creator.name}
                      </h2>
                    </div>
                  </div>

                  {/* Title & Badge */}

                  <div className="text-right flex flex-col  items-center gap-1">
                    <div className="flex">
                      <div className="flex items-center  gap-3 group">
                        <span
                          className="
    inline-block px-2.5 py-1 text-xs font-bold 
    bg-orange-500/90 text-white rounded-full 
    transition-all duration-200
    group-hover:bg-orange-400/90 group-hover:scale-105
    shadow-[0_2px_5px_rgba(249,115,22,0.3)]
  "
                        >
                          COURSE
                        </span>

                        <h1
                          className="
    text-xl font-bold text-white 
    max-w-[200px] truncate
    transition-all duration-200
    group-hover:text-orange-100
    relative after:content-[''] after:absolute after:bottom-0 after:left-0 
    after:w-0 after:h-[2px] after:bg-orange-400
    after:transition-all after:duration-300
    group-hover:after:w-full
  "
                        >
                          {courseDetails?.title}
                        </h1>
                      </div>

                      <div>
                        {(() => {
                          const validity = getValidityDetails(
                            courseDetails?.validity
                          );
                          return (
                            <div className="p-3 rounded-lg  flex items-center gap-2">
                              {validity.icon}
                              <span className="text-sm font-medium text-green-500">
                                {validity.text}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-end justify-end w-full gap-2">
                      {courseDetails?.language?.value.map((lang, index) => {
                        const colors = [
                          "bg-blue-500/90",
                          "bg-purple-500/90",
                          "bg-emerald-500/90",
                          "bg-amber-500/90",
                          "bg-rose-500/90",
                          "bg-indigo-500/90",
                          "bg-teal-500/90",
                          "bg-orange-500/90",
                        ];
                        const colorIndex = lang.charCodeAt(0) % colors.length;
                        const bgColor = colors[colorIndex];

                        return (
                          <span
                            key={index}
                            className={`px-3 py-1 text-xs font-semibold text-white ${bgColor} rounded-full hover:scale-105 transition-transform`}
                          >
                            {lang}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Lessons Section - Moved to top and modified */}
      {/* 
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
      </section> */}

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="relative p-8 sm:p-12 rounded-3xl border border-orange-500/30 bg-gray-900/60 backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-orange-600/10">
            {/* Gradient border accent ring */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-500/10 to-orange-700/10 rounded-3xl blur-md opacity-25"></div>

            {/* Header */}
            <div className="relative z-10 mb-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-3">
                About the Course
              </h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full"></div>
            </div>

            {/* Description */}
            <div
              className="relative z-10 text-gray-300 leading-relaxed text-[17px] sm:text-lg space-y-6 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: courseDetails.aboutThisCourse.description,
              }}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {courseDetails.testimonials.isActive && (
        <section className="py-10 px-4">
          <div className="max-w-6xl  mx-auto">
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
              <div className="grid grid-cols-1 px-8 md:grid-cols-3 gap-6">
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
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                {courseDetails.gallery.title || "Course Gallery"}
              </h2>
              <div className="h-1.5 w-20 mx-auto mt-3 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full"></div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courseDetails.gallery.imageMetaData.map(
                (image, index) =>
                  image.name && (
                    <div
                      key={index}
                      className="relative group rounded-2xl overflow-hidden shadow-lg border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300"
                    >
                      <img
                        src={image.image || oneApp}
                        alt={image.name}
                        className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Optional caption */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-sm text-white font-medium truncate">
                          {image.name}
                        </p>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      {courseDetails?.products?.[0]?.isActive &&
      courseDetails.products[0].productMetaData?.length > 0 ? (
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-10 text-center text-orange-500">
              {courseDetails.products[0].title || "Our Products"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courseDetails.products[0].productMetaData.map((product, index) =>
                product?.name ? (
                  <a
                    key={index}
                    href={product.productLink || "#"}
                    className="group bg-gray-900 rounded-2xl p-5 border border-orange-500/20 hover:border-orange-400 transition-all duration-300 shadow-lg hover:shadow-xl relative"
                  >
                    {/* Top Row: Name and Price */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white truncate max-w-[70%]">
                        {product.name}
                      </h3>
                      <div className="flex items-center text-green-400 text-base font-medium">
                        {CurrencyIcon && (
                          <CurrencyIcon className="w-4 h-4 mr-1" />
                        )}
                        {product.price || "N/A"}
                      </div>
                    </div>

                    {/* Bottom Icon (optional) */}
                    <Icons.ArrowRight className="w-5 h-5 text-orange-400 absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                ) : null
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="py-10 text-center text-gray-500">
          No products available
        </div>
      )}

      <ThreeinOne courseDetails={courseDetails} />

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

      <div className="flex justify-center mb-5 mt-8">
        {!isPurchased ? (
          <button
            onClick={() => {
              if (!currentUserId) {
                setShowSignupModal(true);
              } else {
                navigate("/app/payment", {
                  state: {
                    id: courseId,
                    title: courseDetails.title,
                    baseAmount: courseDetails.price,
                    courseType: "course",
                    createdBy: courseDetails.creator.name,
                  },
                });
              }
            }}
            className="bg-orange-600 text-white py-4 px-6 rounded-lg font-bold hover:bg-gray-900 transition-colors duration-300 shadow-xl inline-flex items-center justify-center space-x-3 text-lg"
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
          <a
            href="http://localhost:5174/dashboard"
            className="bg-green-600 text-white py-3 px-6 rounded-lg inline-flex items-center font-medium hover:bg-green-700 transition-colors duration-300"
          >
            <Icons.LayoutDashboard className="w-5 h-5 mr-2" />
            <span>Go to Dashboard</span>
          </a>
        )}
      </div>

      <PageFooter />
    </div>
  );
};

export default NewCourse;
