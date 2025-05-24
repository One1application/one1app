/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import Navbar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";
import personImage from "../../../assets/Student.png";
import AboutImg from "../../../assets/aboutImg.png";
import TestimonialImg from "../../../assets/user.png";
import FeatureImg from "../../../assets/effortless monetizw.webp";
import FeatureImg2 from "../../../assets/Bost Engagement.webp";
import FeatureImg3 from "../../../assets/Flexible scheduling.jpg";
import FeatureImg4 from "../../../assets/advanced analyticss.jpg";
import FeatureImg5 from "../../../assets/secure paument.avif";
import FeatureImg6 from "../../../assets/User-friendly design.jpeg";
import playstoreLogo from "../../../assets/playstore.png";
// import LetStartImg1 from "../../../assets/Started1.png";
// import LetStartImg2 from "../../../assets/started2.png";
// import LetStartImg3 from "../../../assets/started3.png";
// import LetStartImg4 from "../../../assets/started4.png";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { testimonials, faqData } from "../HomePage/HomeConfig.js";

import Animation from "./Animation.jsx";
import BackgroundImg from "../../../assets/letsstartbackground.webp";
import Animation1 from "../../../assets/Animation2.json";
import { Player } from "@lottiefiles/react-lottie-player";
import { subscribeNewsLetter } from "../../../services/auth/api.services.js";

import {
  Rocket,
  DollarSign,
  Video,
  ChevronRight,
  Bot,
  Loader,
} from "lucide-react";

const HeroSection = ({ email, setEmail, submit, loading }) => (
  <div className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-16 pt-8 md:pt-16 w-full h-full relative">
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full md:w-1/2 space-y-6 z-10 md:pl-8 lg:pl-16 xl:pl-24"
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight font-arima text-white">
        Manage & Monetize your{" "}
        <span className="italic text-orange-500 mt-5">Content</span>
      </h1>

      <p className="text-gray-200 text-sm md:text-base mt-2">
        Launch your paid subscriptions, events, courses, payment pages, and more
        for your audience.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {[
          {
            icon: <Rocket className="w-4 h-4" />,
            text: "Fast Setup",
            color: "from-orange-500/20 to-orange-600/10",
          },
          {
            icon: <DollarSign className="w-4 h-4" />,
            text: "Digital Products",
            color: "from-emerald-500/20 to-emerald-600/10",
          },
          {
            icon: <Video className="w-4 h-4" />,
            text: "Live Hosting",
            color: "from-blue-500/20 to-blue-600/10",
          },
          {
            icon: <Bot className="w-4 h-4" />,
            text: "Automation",
            color: "from-purple-500/20 to-purple-600/10",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{
              y: -4,
              scale: 1.03,
              backgroundColor: "rgba(39, 39, 42, 0.7)",
              boxShadow: "0 8px 20px rgba(249, 115, 22, 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center gap-3 bg-gray-800/40 backdrop-blur-sm rounded-xl p-3.5 border border-gray-700/50 cursor-pointer overflow-hidden transition-all duration-300 hover:border-orange-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 via-transparent from-transparent to-orange-500/5" />

            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-orange-500/20 transition-all duration-500 pointer-events-none" />

            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className={`p-2 bg-gradient-to-br ${item.color} rounded-lg backdrop-blur-sm`}
            >
              {item.icon}
            </motion.div>

            <div className="flex-1">
              <span className="text-sm font-medium text-white/90">
                {item.text}
              </span>
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-0.5 bg-gradient-to-r from-orange-500 to-transparent mt-1"
              />
            </div>

            {/* Animated chevron */}
            <motion.div
              initial={{ x: -5, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-orange-500"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>

            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 rounded-xl border border-orange-500/30 animate-ping-slow pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center max-w-md border border-orange-500/60 rounded-full p-1 bg-gray-900 backdrop-blur-sm">
        <input
          type="email"
          placeholder="Your email address"
          className="flex-grow bg-transparent text-white text-sm placeholder-gray-400/70 focus:outline-none px-4 py-2.5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="new-email"
        />
        <button
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm rounded-full px-4 py-2 flex items-center gap-1.5 transition-all duration-200 hover:scale-[1.03] active:scale-95"
          onClick={submit}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>
            {loading ? (
              <Loader className="w-3.5 h-3.5 animate-spin" />
            ) : (
              " Notify Me"
            )}
          </span>
        </button>
      </div>
      <div className="relative inline-block">
        <div className="group">
          <img
            src={playstoreLogo}
            alt="Play Store"
            className="h-20 w-auto object-contain cursor-pointer group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute top-full mt-2 left-0 ml-3 w-max max-w-xs bg-orange-600 text-white text-sm px-4 py-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            Application in trial period. We appreciate your patience.
          </div>
        </div>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full md:w-1/2 mt-12 md:mt-0 h-80 md:h-[500px] flex justify-center items-center"
    >
      <Animation />
    </motion.div>
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

import { Star, ChevronLeft, MessageSquare } from "lucide-react";

const TestimonialsSection = ({ review = [], navigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsPerPage = 3;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + testimonialsPerPage;
      return nextIndex >= review.length ? 0 : nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const prevIndexNew = prevIndex - testimonialsPerPage;
      return prevIndexNew < 0
        ? Math.max(0, Math.floor((review.length - 1) / testimonialsPerPage)) *
            testimonialsPerPage
        : prevIndexNew;
    });
  };

  const currentTestimonials = review.slice(
    currentIndex,
    currentIndex + testimonialsPerPage
  );

  const StarRating = ({ rating }) => (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "fill-orange-500 text-orange-500" : "text-gray-500"
          }`}
        />
      ))}
    </div>
  );

  return (
    <section className="bg-black text-white px-8 md:px-16 py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-orange-500/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-orange-500/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-4 md:px-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 md:mb-0 bg-white bg-clip-text text-transparent"
          >
            What everyone says
          </motion.h2>

          {review.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <button
                onClick={handlePrev}
                className="p-3 border-2 border-white hover:bg-orange-500/20 transition rounded-full text-orange-500 hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 border-2 border-white hover:bg-orange-500/20 transition rounded-full text-orange-500 hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>

        {review.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-8"
          >
            {currentTestimonials.map(
              ({ userimage, username, role, review, rating }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-b from-gray-900/80 to-gray-800/50 p-6 rounded-xl shadow-lg flex flex-col w-full sm:w-[370px] border border-gray-800 hover:border-orange-500/30 transition-all duration-300"
                >
                  <div className="flex-1 mb-4">
                    <p className="text-white text-base leading-relaxed italic relative pl-4 min-h-[120px]">
                      <span className="absolute left-0 top-0 text-orange-500 text-2xl">
                        "
                      </span>
                      {review}
                    </p>
                  </div>

                  <div className="mb-4">
                    <StarRating rating={rating} />
                  </div>

                  <div className="flex items-center space-x-4 mt-auto">
                    <div className="relative">
                      <img
                        src={userimage}
                        alt={username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/50"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1">
                        <MessageSquare className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-semibold text-sm">
                        {username}
                      </h3>
                      <p className="text-gray-400 text-xs">{role}</p>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Be the first to share your experience! Our community would love to
              hear what you think.
            </p>
            <button
              className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-orange-500/20 transition-all"
              onClick={() => navigate("/signin")}
            >
              Share Your Feedback
            </button>
          </motion.div>
        )}
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
        "Gain actionable insights with real-time analytics and enjoy the flexibility of customizable scheduling.",
    },
    {
      img: FeatureImg4,
      title: "Advanced analytics",
      description:
        "Unlock powerful insights with advanced analytics, helping you effortlessly monetize your content.",
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
    <div className="bg-black text-white py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          The features you were looking for
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg"
              whileHover={{
                scale: 1.03,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                transition: {
                  duration: 0.2,
                },
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: index * 0.1,
                },
              }}
              viewport={{ once: true }}
            >
              <div className="relative h-40 overflow-hidden">
                <motion.img
                  src={feature.img}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  whileHover={{
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-blue-400 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
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
  const { reviews } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNotify = () => {
    try {
      setLoading(true);
      subscribeNewsLetter(email.trim());
      setEmail("");
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar scrollToFeatures={scrollToFeatures} />

      <HeroSection
        email={email}
        setEmail={setEmail}
        submit={handleNotify}
        loading={loading}
      />
      <AboutSection />
      <WhatIsOneAppSection />
      <TestimonialsSection review={reviews} navigate={navigate} />
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
