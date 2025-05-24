import Navbar from "../../../components/NavBar/NavBar";
import AboutImg from "../../../assets/about.png";
import AboutBackground from "../../../assets/background1.png";
import StrategyCard from "../../../components/Cards/StrategyCard";
import Background from "../../../assets/background.png";
import Vision1 from "../../../assets/vision1.jpeg";
import Vision2 from "../../../assets/vision2.jpeg";
import Vision3 from "../../../assets/vision3.jpeg";
import Vision4 from "../../../assets/vision4.jpeg";
import Footer from "../../../components/Footer/Footer";
import { aboutusConfig } from "./aboutusConfig";
import { useRef } from "react";
import { motion } from "framer-motion";

import PaymentInterface from "../../../newPurchase/PaymentInterface";
const AboutUsPage = () => {
  const { cardDetails } = aboutusConfig;
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar scrollToFeatures={scrollToFeatures} />

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        {/* First About Us Section */}
        <div className="py-24 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 opacity-10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-purple-500 opacity-10 rounded-full filter blur-3xl"></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-teal-500 opacity-10 rounded-full filter blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center md:space-x-12">
            <motion.div
              className="md:w-1/2 mb-12 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="relative mb-4">
                <h2 className="text-5xl font-bold relative z-10">
                  About <span className="text-orange-500">Us</span>
                </h2>
              </div>

              <motion.p
                className="italic text-xl mb-8 text-blue-400 font-medium"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Elevating creators to thrive and earn effortlessly.
              </motion.p>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="leading-relaxed text-gray-300 text-lg">
                  At One1App, we are focused on elevating creators by offering a
                  platform that makes the path from passion to profit
                  effortless.
                </p>
                <p className="leading-relaxed text-gray-300 text-lg">
                  Our tools promote growth, inspire creativity, and cultivate
                  trust within communities, all while maintaining a
                  user-friendly and mobile-optimized experience.
                </p>
              </motion.div>

              <div className="mt-10 flex items-center space-x-4">
                <motion.div
                  className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                <motion.div
                  className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </motion.div>
                <motion.div
                  className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="relative flex justify-center items-center">
                <motion.div
                  className="absolute w-[430px] h-[450px] [border-radius:50%_50%_40%_60%] overflow-hidden"
                  animate={{
                    borderRadius: [
                      "50% 50% 40% 60%",
                      "60% 40% 60% 40%",
                      "40% 60% 50% 50%",
                      "50% 50% 40% 60%",
                    ],
                    rotate: [0, 15, -15, 0],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30"></div>
                  <img
                    src={AboutBackground}
                    alt="Background Shape"
                    className="w-full h-full object-cover mix-blend-overlay opacity-80"
                  />
                </motion.div>

                <motion.div
                  className="relative z-30"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <img
                    src={AboutImg}
                    alt="About Us"
                    className="w-[450px] h-[500px] object-cover rounded-3xl shadow-2xl"
                  />

                  <motion.div
                    className="absolute -top-6 -right-6 w-16 h-16 bg-blue-500 rounded-full opacity-80"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  ></motion.div>

                  <motion.div
                    className="absolute -bottom-4 -left-4 w-8 h-8 bg-purple-500 rounded-full opacity-70"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  ></motion.div>

                  <div className="absolute inset-0 rounded-3xl shadow-lg shadow-blue-500/20"></div>

                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white opacity-60 rounded-tl-lg"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white opacity-60 rounded-br-lg"></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Our Vision Section */}
        <div className="relative flex flex-col md:flex-row-reverse items-center py-20 overflow-hidden">
          <div className="md:w-1/2 md:pl-12 z-10">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                <span className="text-orange-600">Our</span> Vision
              </h2>
              <p className="leading-relaxed text-gray-300 text-lg">
                We envision a world where creators have easy access to the tools
                they need to turn their passions into profit and scale their
                businesses, free from the constraints of complicated technology.
              </p>
              <p className="leading-relaxed text-gray-300 text-lg mt-4">
                OnTop is here to streamline that journey, enabling creators to
                take charge of their future.
              </p>

              <motion.button
                className="mt-8 px-6 py-3 bg-orange-500 text-white rounded-full font-medium flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </div>

          <div className="md:w-1/2 mt-12 md:mt-0 relative h-96 md:h-[500px]">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-64 h-64 bg-blue-500 opacity-20 rounded-full filter blur-3xl"></div>
            <div className="absolute right-20 bottom-0 w-40 h-40 bg-purple-500 opacity-20 rounded-full filter blur-3xl"></div>

            <div className="absolute inset-0 opacity-10">
              <img
                src={Background}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative w-full h-full">
              <motion.div
                className="absolute top-0 left-0 md:left-8 w-56 md:w-64"
                initial={{ opacity: 0, y: -50, rotate: -5 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
              >
                <img
                  src={Vision3}
                  alt="Learning session"
                  className="w-full h-auto object-cover rounded-lg shadow-lg border-2 border-gray-800"
                />
              </motion.div>

              <motion.div
                className="absolute bottom-8 left-4 md:left-16 w-48 md:w-56"
                initial={{ opacity: 0, y: 50, rotate: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
              >
                <img
                  src={Vision1}
                  alt="Social interaction"
                  className="w-full h-auto object-cover rounded-lg shadow-lg border-2 border-gray-800"
                />
              </motion.div>

              <motion.div
                className="absolute top-1/4 right-0 md:right-4 w-44 md:w-52"
                initial={{ opacity: 0, x: 50, rotate: 8 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
              >
                <img
                  src={Vision2}
                  alt="Study session"
                  className="w-full h-auto object-cover rounded-lg shadow-lg border-2 border-gray-800"
                />
              </motion.div>

              <div className="absolute right-12 top-1/2 w-6 h-6 bg-blue-500 rounded-full opacity-80"></div>
              <div className="absolute left-1/3 bottom-4 w-4 h-4 bg-purple-500 rounded-full opacity-80"></div>
              <div className="absolute left-1/4 top-1/3 w-8 h-8 border-2 border-gray-400 rounded-full opacity-40"></div>

              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100,100 C150,120 200,180 250,220"
                  stroke="rgba(99, 102, 241, 0.4)"
                  strokeWidth="1"
                  strokeDasharray="5 5"
                />
                <path
                  d="M250,220 C200,250 150,200 100,250"
                  stroke="rgba(99, 102, 241, 0.4)"
                  strokeWidth="1"
                  strokeDasharray="5 5"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center mt-24 mb-12">
          <h2 className="text-4xl font-bold mb-4">Explore our strategy</h2>
          <p className="text-lg text-gray-400">
            Unleash your potential with our all-inclusive range of creator
            services.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
          {cardDetails.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl shadow-lg hover:shadow-xl p-4 transition-transform duration-300"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-400 text-sm">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      {/* <PaymentInterface/> */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;
