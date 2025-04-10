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
        <div className="flex flex-col md:flex-row items-center md:space-x-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-4">About Us</h2>
            <p className="italic text-lg mb-6">
              Elevating creators to thrive and earn effortlessly.
            </p>
            <p className="leading-relaxed text-gray-300">
              At OnTop, we are focused on elevating creators by offering a
              platform that makes the path from passion to profit effortless.
              Our tools promote growth, inspire creativity, and cultivate trust
              within communities, all while maintaining a user-friendly and
              mobile-optimized experience.
            </p>
          </div>
          <div className="relative flex justify-center items-center">
            <div className="absolute w-[430px] h-[450px] [border-radius:50%_50%_40%_60%] rotate-[-180deg] overflow-hidden">
              <img
                src={AboutBackground}
                alt="Background Shape"
                className="w-full h-full object-cover"
              />
            </div>
            <img
              src={AboutImg}
              alt="About Us"
              className="w-[450px] h-[500px] object-cover relative z-30 rounded-full shadow-lg"
            />
          </div>
        </div>

        {/* Our Vision Section */}
        <div className="relative flex flex-col md:flex-row items-center mt-20">
          <div className="md:w-1/2 md:pr-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Our Vision</h2>
            <p className="leading-relaxed text-gray-300">
              We envision a world where creators have easy access to the tools
              they need to turn their passions into profit and scale their
              businesses, free from the constraints of complicated technology.
              OnTop is here to streamline that journey, enabling creators to
              take charge of their future.
            </p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 relative h-96">
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={Background} alt="" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center gap-4">
              <div className="relative w-full max-w-xl aspect-video  ">
                {/* <div className="absolute left-0 top-[-60px] w-52 p-4 bg-white rounded-lg shadow-lg">
                  <span className="block text-xs text-blue-500 font-medium mb-2">
                    Popular
                  </span>
                  <h4 className="font-semibold text-gray-800">
                    Design for how people think
                  </h4>
                  <p className="text-gray-600 my-2 text-sm">
                    Aliquam ut euismod condimentum elementum ultricies volutpat
                    sit non.
                  </p>
                  <button className="px-4 py-2 text-white bg-blue-500 rounded-full text-sm">
                    Take Lesson
                  </button>
                </div> */}

                <div className="absolute left-20 max-md:left-[-150px] max-md:mt-6 top-0 w-56">
                  <img
                    src={Vision3}
                    alt="Learning session"
                    className="absolute w-80 h-30 object-cover rounded-lg shadow-md  top-[10px]"
                  />
                  {/* <img
                    src={Vision4}
                    alt="Profile"
                    className="absolute top-[80px] right-[80px] w-12 h-12 rounded-full border-2 border-white"
                  /> */}
                </div>

                <div className="absolute max-lg:hidden max-md:block left-2 bottom-0  w-52 ">
                  <img
                    src={Vision1}
                    alt="Social interaction"
                    className="w-180 h-32 object-cover rounded-lg shadow-md mt-2 "
                  />
                </div>

                <div className="absolute  right-4 bottom-4 w-48">
                  <img
                    src={Vision2}
                    alt="Study session"
                    className="absolute w-80 h-30 object-cover rounded-lg shadow-md md:ml-[-80px] top-[-110px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explore our strategy Section */}
        <div className="text-center mt-24 mb-12">
          <h2 className="text-4xl font-bold mb-4">Explore our strategy</h2>
          <p className="text-lg text-gray-400">
            Unleash your potential with our all-inclusive range of creator
            services.
          </p>
        </div>

        {/* Strategy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {cardDetails.map((card, index) => (
            <StrategyCard
              key={index}
              image={card.image}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AboutUsPage;
