/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import Money from "../../../assets/money.png";
import Idea from "../../../assets/idea.png";
import NoMoney from "../../../assets/nomoney.png";
import { MdKeyboardArrowRight } from "react-icons/md";
import FlyingJatt from "../../../assets/cv3.png";
import ArrowDown from "../../../assets/arrowdown.png";
import { FaUpload } from "react-icons/fa";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StackedCard = () => {
  const [currentCard, setCurrentCard] = useState(1);
  const [selectedOption, setSelectedOption] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate();

  const breakpoints = [
    0, 10000, 25000, 50000, 100000, 250000, 500000, 750000, 1000000, 10000000,
  ];
  const labels = [
    "0",
    "10k",
    "25k",
    "50k",
    "1L",
    "2.5L",
    "5L",
    "7.5L",
    "10L",
    "1CR+",
  ];

  const followBreakpoints = [
    0, 10000, 25000, 50000, 100000, 250000, 500000, 750000, 1000000, 10000000,
  ];
  const followLabels = [
    "0",
    "10k",
    "25k",
    "50k",
    "100k",
    "250k",
    "500k",
    "750k",
    "1M",
    "10M+",
  ];

  const handleValueChange = (e) => {
    setCurrentIndex(parseInt(e.target.value));
  };

  const options = [
    { id: 1, label: "I've already started earning", icon: Money },
    { id: 2, label: "Creating but not earning yet", icon: Idea },
    { id: 3, label: "Haven't started creating yet", icon: NoMoney },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      uploadImage(file);
    }
  };

  const uploadImage = (file) => {
    console.log(file);

    setLoading(true);
    setUploadSuccess(false);

    setTimeout(() => {
      setLoading(false);
      setUploadSuccess(true);
    }, 2000);
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen flex flex-col justify-start"
      style={{
        backgroundImage:
          "url(https://d3qp9zvlyuxos1.cloudfront.net/Gradient+background.svg)",
      }}
    >
      <div className="min-h-screen flex justify-center items-center">
        <div className="relative w-full md:max-w-[50%] md:h-[62vh] h-[60vh]">
          {/* Card 1 */}
          <div
            className={`pt-8 px-10 absolute inset-0 transform rounded-xl transition-all duration-500 ease-in-out bg-white ${
              currentCard === 1
                ? "translate-y-0 scale-100 z-30"
                : "-translate-y-8 scale-95 z-20 opacity-50"
            }`}
          >
            <div className="flex flex-col">
              <h1 className="font-poppins font-semibold tracking-tight text-xl mb-2">
                Hey Manish, what best describes your creator journey?
              </h1>
              <p className="font-poppins text-sm text-gray-500 mb-3">
                Your story is essential to tailor your experience
              </p>
              <div className="flex gap-4">
                {/* Selected Options */}
                {options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`p-4 border rounded-lg gap-3 flex flex-col items-center cursor-pointer transition ${
                      selectedOption === option.id
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img src={option.icon} alt="" className="w-8 h-8" />
                    <div className="text-[12px] text-center font-poppins font-semibold">
                      {option.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Range Slider for Earnings */}
              <div className="py-8">
                {selectedOption === 1 && (
                  <div>
                    <div className="flex justify-between flex-col md:flex-row">
                      <h3 className="font-poppins font-semibold text-[13px] mb-2 text-gray-600">
                        🎉 Awesome! What does your average monthly earning look
                        like?
                      </h3>
                      <h3 className="font-poppins font-bold text-sm mb-2 tracking-tight">
                        ₹ {labels[currentIndex]} <span>/month</span>
                      </h3>
                    </div>

                    <div>
                      <input
                        type="range"
                        min="0"
                        max={breakpoints.length - 1}
                        value={currentIndex}
                        onChange={handleValueChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer custom-range-slider"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 ${
                            (currentIndex / (breakpoints.length - 1)) * 100
                          }%, #e5e7eb ${
                            (currentIndex / (breakpoints.length - 1)) * 100
                          }%)`,
                        }}
                      />
                      <div className="flex justify-between mt-2">
                        {labels.map((label, index) => (
                          <span
                            key={index}
                            className="text-gray-600 text-xs font-poppins font-semibold"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Range Slider for Followers */}
                {selectedOption === 2 && (
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-poppins font-semibold text-[13px] mb-2 text-gray-600">
                        😁Sounds good! How many followers/Subscribers do you
                        have?
                      </h3>
                      <h3 className="font-poppins font-bold text-sm mb-2 tracking-tight">
                        {followLabels[currentIndex]} <span></span>
                      </h3>
                    </div>

                    <div>
                      <input
                        type="range"
                        min="0"
                        max={followBreakpoints.length - 1}
                        value={currentIndex}
                        onChange={handleValueChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer custom-range-slider"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 ${
                            (currentIndex / (followBreakpoints.length - 1)) *
                            100
                          }%, #e5e7eb ${
                            (currentIndex / (followBreakpoints.length - 1)) *
                            100
                          }%)`,
                        }}
                      />
                      <div className="flex justify-between mt-2">
                        {followLabels.map((label, index) => (
                          <span
                            key={index}
                            className="text-gray-600 text-xs font-poppins font-semibold"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedOption === 3 && (
                  <div>
                    <div className="flex justify-center items-center md:px-32 relative">
                      <img src={FlyingJatt} alt="" className="w-24" />
                      <img
                        src={ArrowDown}
                        alt=""
                        className="absolute -top-2 md:right-24 right-5"
                      />
                      <div className="flex flex-col">
                        <h3 className="font-bold font-poppins tracking-tight text-md text-gray-700">
                          Super! You&lsquo;re at the right place
                        </h3>
                        <p className="font-poppins tracking-tight text-sm">
                          Let&#39;s take the first step towards building your
                          successful business, together!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Button and Steps */}
            </div>
            <div className="mt-5 flex justify-between items-center ">
              <p className="font-poppins font-bold text-sm tracking-tight text-gray-500">
                STEP {currentCard} of 2
              </p>
              <button
                className="px-5 py-2 bg-orange-600 text-white rounded-full font-poppins font-semibold text-sm flex items-center gap-2"
                onClick={() => setCurrentCard((prev) => (prev === 1 ? 2 : 1))}
              >
                Next
                <MdKeyboardArrowRight className="size-5" />
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className={`pt-8 px-10 absolute inset-0 transform rounded-xl transition-all duration-500 ease-in-out bg-white ${
              currentCard === 2
                ? "translate-y-0 scale-100 z-30"
                : "-translate-y-8 scale-95 z-20 opacity-50"
            }`}
          >
            <div className="flex flex-col h-full p-3">
              <div className="flex justify-between items-start">
                <div className="flex-grow flex flex-col items-start">
                  <h2 className="text-2xl font-bold text-right">
                    Lastly, let's set up your band!
                  </h2>
                  <p className="text-gray-600 text-right">
                    All your products will carry this branding. Don't worry, you
                    can change it later.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center flex-grow justify-center">
                <div className="mb-2">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center gap-2 w-32 h-32 bg-gray-200 shadow-md rounded-full cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="loader"></div>
                      </div>
                    ) : (
                      <>
                        {image ? (
                          <img
                            src={image}
                            alt="Preview"
                            className="w-32 h-32 rounded-full object-cover"
                          />
                        ) : (
                          <>
                            <FaUpload className="text-gray-600 text-2xl" />
                            <span className="text-center text-gray-600 text-sm ml-2">
                              Add your logo
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full max-w-[400px] mt-2 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="relative w-full max-w-[400px] mt-2">
                  <input
                    type="text"
                    placeholder="Domain"
                    className="w-full p-2 text-sm border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Check
                    size={16}
                    className="absolute right-2 top-2 text-orange-500"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mt-auto">
                <p className="font-poppins font-bold text-sm tracking-tight text-gray-500">
                  STEP {currentCard} of 2
                </p>
                <div className="flex flex-col md:flex-row space-x-0 md:space-x-2 mt-2 md:mt-0">
                  <button
                    className="w-full md:w-[85%] text-gray py-2 px-4 rounded-full text-sm transition duration-200"
                    onClick={() => setCurrentCard(1)}
                  >
                    Back
                  </button>
                  <button
                    className="w-full md:w-[85%] bg-orange-600 text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition duration-200"
                    onClick={() => navigate("/dashboard")}
                  >
                    Finish
                  </button>
                </div>
              </div>
            </div>
            {uploadSuccess && (
              <div className="mt-4 text-green-600">
                <p>Image uploaded successfully!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackedCard;
