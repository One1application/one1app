/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import Navbar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";
import personImage from "../../../assets/Student.png";
import AboutImg from "../../../assets/aboutImg.png";
import TestimonialImg from "../../../assets/User.png";
import FeatureImg from "../../../assets/effortless monetizw.webp";
import FeatureImg2 from "../../../assets/Bost Engagement.webp";
import FeatureImg3 from "../../../assets/Flexible scheduling.jpg";
import FeatureImg4 from "../../../assets/advanced analyticss.jpg";
import FeatureImg5 from "../../../assets/secure paument.avif";
import FeatureImg6 from "../../../assets/User-friendly design.jpeg";
// import LetStartImg1 from "../../../assets/Started1.png";
// import LetStartImg2 from "../../../assets/started2.png";
// import LetStartImg3 from "../../../assets/started3.png";
// import LetStartImg4 from "../../../assets/started4.png";

import { testimonials, faqData } from "../HomePage/HomeConfig.js";
import { useNavigate } from "react-router-dom";
import Animation from "./Animation.jsx";
import BackgroundImg from "../../../assets/letsstartbackground.webp";
import Animation1 from "../../../assets/Animation2.json";
import { Player } from "@lottiefiles/react-lottie-player";

const HeroSection = ({ email, setEmail }) => (
  <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 pt-8 md:pt-16 w-full h-full relative -mt-8">
    <div className="w-full md:w-1/2 space-y-6 z-10 md:pl-16 lg:pl-32">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight font-arima">
        Manage & Monetize your{" "}
        <span className="italic text-orange-500">Content</span>
      </h1>
      <p className="text-gray-400 text-base md:text-lg">
        Launch your paid subscriptions, events, courses, payment pages, <br />{" "}
        and many more for your audience.
      </p>
      <div className="flex items-center gap-0 border border-orange-500 rounded-full p-1 bg-[#191919] w-full md:w-4/5 lg:w-3/4">
        <input
          type="email"
          placeholder="name@email.com"
          className=" flex-grow bg-[#191919] text-white text-base placeholder-gray-400 focus:outline-none rounded-l-full "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-orange-500 p-2 text-base text-white rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
          Get notified
        </button>
      </div>
    </div>

    <div className="relative w-full md:w-1/2 mt-8 h-80 md:h-[500px] flex justify-center items-center overflow-hidden">
      <Animation />
    </div>
  </div>
);

// About Section Component
const AboutSection = () => (
  <div className="bg-black text-white py-16 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between">
    <div className="w-full md:w-1/2 space-y-4 md:pl-16 lg:pl-32">
      <p className="text-orange-500 font-semibold tracking-wide uppercase text-sm">
        Discover
      </p>
      <h1 className="text-3xl md:text-5xl font-bold leading-snug">
        One App <span className="relative inline-block">Technology</span>
        :<br /> Your One-Stop Solution Platform
      </h1>
      <p className="text-gray-400 text-sm md:text-base">
        One App Technology is a revolutionary platform that combines multiple
        functionalities into a single, user-friendly application, redefining
        convenience, efficiency, and accessibility.
      </p>
      <button className="text-white text-base flex items-center group hover:text-orange-500">
        Discover Ideas
        <span className="ml-2 transition-transform transform group-hover:translate-x-1">
          →
        </span>
      </button>
    </div>

    <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
      <img
        src={personImage}
        alt="Person with device"
        className="w-72 md:w-80 h-auto object-cover"
      />
    </div>
  </div>
);

// What is One App Section
const WhatIsOneAppSection = () => (
  <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-12 md:py-16">
    <div className="w-full md:w-1/2 space-y-6 md:pl-20 lg:pl-32">
      <p className="text-orange-500 font-semibold tracking-wide uppercase text-sm">
        About
      </p>
      <h1 className="text-3xl md:text-5xl font-bold leading-snug">
        What is One App Technology?
      </h1>
      <p className="text-gray-400 text-sm md:text-base leading-relaxed">
        One App Technology is an all-in-one platform that integrates tools and
        services to streamline tasks for businesses, freelancers, and
        individuals.
      </p>
    </div>

    <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
      <img
        src={AboutImg}
        alt="About Section Illustration"
        className="w-96 md:w-[500px] lg:w-[600px] h-auto object-contain"
      />
    </div>
  </section>
);

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsPerPage = 3;

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + testimonialsPerPage < testimonials.length
        ? prevIndex + testimonialsPerPage
        : 0
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - testimonialsPerPage >= 0
        ? prevIndex - testimonialsPerPage
        : Math.floor(testimonials.length / testimonialsPerPage) *
          testimonialsPerPage
    );
  };

  const currentTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + testimonialsPerPage
  );

  return (
    <section className="bg-black text-white px-8 md:px-16 py-16">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-4 md:px-24">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-0">
            What everyone says
          </h2>

          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrev}
              className="p-3 border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition rounded-full text-orange-500"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="p-3 border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition rounded-full text-orange-500"
            >
              →
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {currentTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#191919] p-6 rounded-lg shadow-lg text-center flex flex-col space-y-4 w-full sm:w-[300px] md:w-[350px]"
            >
              <p className="text-gray-300 leading-relaxed text-sm mb-4">
                {testimonial.text}
              </p>

              <div className="flex items-center justify-center space-x-4">
                <img
                  src={TestimonialImg}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <h3 className="text-white font-semibold text-sm">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-400 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      img: FeatureImg,
      title: "Effortlessly Monetize",
      description:
        "Turn your expertise into income with hassle-free digital products like courses, webinars, and sessions.",
    },
    {
      img: FeatureImg2,
      title: "Boost engagement",
      description:
        "Enhance community engagement with exclusive content and premium communication tools.",
    },
    {
      img: FeatureImg3,
      title: "Flexible scheduling",
      description:
        "Gain actionable insights with real-time analytics and enjoy the flexibility of customizable scheduling to drive engagement and growth.",
    },
    {
      img: FeatureImg4,
      title: "Advanced analytics",
      description:
        "Unlock powerful insights with advanced analytics, helping you effortlessly monetize your content from anywhere in the world.",
    },
    {
      img: FeatureImg5,
      title: "Secure payments",
      description:
        "Flexible and secure payment solutions that scale with your growth, from solo creators to large communities.",
    },
    {
      img: FeatureImg6,
      title: "User-friendly design",
      description:
        "Enjoy a seamless experience with an intuitive design optimized for any device, accessible anytime, anywhere.",
    },
  ];

  return (
    <div className="bg-black text-white py-16 px-8">
      <h2 className="text-5xl font-bold text-center mb-12">
        The features you were looking for
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ml-10">
        {features.map((feature, index) => (
          <div key={index} className="space-y-4">
            <img
              src={feature.img}
              alt="Feature"
              className="rounded-lg w-full"
            />
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const FAQSection = () => {
  return (
    <div className="bg-black text-white py-16 px-4 md:px-8">
      <h2 className="text-4xl md:text-6xl font-bold text-center mb-16">
        <span className="text-orange-500">FAQ</span>
        <span className="relative">
          {/* <span className="absolute -top-8 right-0 text-xs text-orange-500">
            frequently asked questions
          </span> */}
        </span>
      </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {faqData.map((faq, index) => (
          <div key={index} className="relative group">
            {/* Background shape */}
            <div className="absolute inset-0 bg-orange-500/10 transform -skew-x-6"></div>

            {/* Content container */}
            <div className="relative p-8 border-l-4 border-orange-500 hover:bg-orange-500/5 transition-all duration-300">
              {/* Question number */}
              <div className="absolute -right-2 -top-2 bg-orange-500 text-black h-8 w-8 flex items-center justify-center font-mono">
                {(index + 1).toString().padStart(2, "0")}
              </div>

              {/* Question */}
              <h3 className="text-xl md:text-2xl font-bold text-orange-500 mb-4">
                {faq.question}
              </h3>

              {/* Answer */}
              <div className="text-gray-300 relative">
                <div className="absolute -left-8 top-0 h-full w-px bg-orange-500/30"></div>
                {faq.answer}
              </div>

              {/* Decorative corner */}
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-orange-500/30"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Get Started Section Component
const GetStartedSection = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative text-center px-6 py-16 bg-black overflow-hidden"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${BackgroundImg})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
          opacity: 0.6,
        }}
      />

      {/* Animation 1: Middle Left */}
      <div
        className="absolute lg:block hidden"
        style={{
          top: "40%",
          left: "15%",
          transform: "translateY(-50%)",
          width: "150px", // Increased size
          height: "150px",
        }}
      >
        <Player
          autoplay
          loop
          src={Animation1}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Animation 2: Middle Right */}
      <div
        className="absolute lg:block hidden"
        style={{
          top: "40%",
          right: "15%",
          transform: "translateY(-50%)",
          width: "150px", // Increased size
          height: "150px",
        }}
      >
        <Player
          autoplay
          loop
          src={Animation1}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">
          Let&apos;s get started..
        </h1>
        <p className="text-gray-300 mb-6 drop-shadow-lg">
          Walk a successful creator journey with OneApp. Like a pro!{" "}
          <span role="img" aria-label="victory">
            ✌️
          </span>
        </p>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

const HomePages = () => {
  const [email, setEmail] = useState("");
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar scrollToFeatures={scrollToFeatures} />

      <HeroSection email={email} setEmail={setEmail} />
      <AboutSection />
      <WhatIsOneAppSection />
      <TestimonialsSection />
      {/* <FeaturesSection /> */}
      <div ref={featuresRef}>
        <FeaturesSection />
      </div>
      <FAQSection />
      <GetStartedSection />
      <Footer />
    </div>
  );
};

export default HomePages;
