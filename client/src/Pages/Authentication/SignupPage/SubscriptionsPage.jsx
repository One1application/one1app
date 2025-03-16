import { useState } from "react";
import {
  Video,
  GraduationCap,
  Package,
  Check,
  Lightbulb,
} from "lucide-react";
import StackedCard from "./StackedCardPage";
import logo from "../../../assets/oneapp.png"

const SubscriptionPage = () => {
  const [activePlan, setActivePlan] = useState("monthly");
  const [showStackedCard, setShowStackedCard] = useState(false);


  const planDetails = {
    monthly: {
      price: "₹999/month",
      billing: "Billed Monthly",
      saveText: "",
    },
    halfYearly: {
      price: "₹899/month",
      billing: "Billed Half-Yearly",
    },
    yearly: {
      price: "₹833/month",
      billing: "Billed Yearly",
      saveText: "Save 50%",
    },
  };

  if (showStackedCard) {
    // Conditionally render the StackedCard component
    return <StackedCard />;
  }

  return (
    <div
      className="bg-cover bg-center min-h-screen flex flex-col justify-start"
      style={{
        backgroundImage:
          "url(https://d3qp9zvlyuxos1.cloudfront.net/Gradient+background.svg)",
      }}
    >
      <div className="flex justify-center items-start min-h-screen pt-8 px-4 sm:px-8">
        <div className="shadow-xl flex flex-col lg:flex-row bg-white rounded-[24px] w-full max-w-[1000px] relative overflow-hidden">
          <div className="flex-1 p-6 sm:p-10">
            <div className="flex flex-col items-center justify-center">
              <div className=" flex items-center justify-center mb-4">
                
                <img className="h-12 w-15" src={logo} alt="logo"/>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
                A super subscription to start and scale your creator journey
              </h2>

              <div className="flex w-full mb-4 text-sm">
                <button
                  className={`flex-1 py-2 px-4 h-10 ${
                    activePlan === "monthly"
                      ? "bg-orange-600	 text-white"
                      : "bg-gray-200 text-gray-700"
                  } ${activePlan === "monthly" ? "rounded-l-lg" : ""}`}
                  onClick={() => setActivePlan("monthly")}
                >
                  Monthly
                </button>
                <button
                  className={`flex-1 py-2 px-4 h-10 ${
                    activePlan === "halfYearly"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  } `}
                  onClick={() => setActivePlan("halfYearly")}
                >
                  Half-Yearly
                  {activePlan === "halfYearly" && (
                    <span className="text-green-500 text-sm ml-1">
                      {planDetails.halfYearly.saveText}
                    </span>
                  )}
                </button>
                <button
                  className={`flex-1 py-2 px-4 h-10 ${
                    activePlan === "yearly"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  } ${activePlan === "yearly" ? "rounded-r-lg" : ""}`}
                  onClick={() => setActivePlan("yearly")}
                >
                  Yearly
                  {activePlan === "yearly" && (
                    <span className="text-green-500 text-sm ml-1">
                      {planDetails.yearly.saveText}
                    </span>
                  )}
                </button>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg w-full mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600">
                      Ultimate Product Bundle at
                    </p>
                    <p className="text-2xl font-bold">
                      {planDetails[activePlan].price}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {planDetails[activePlan].billing}
                  </p>
                </div>
              </div>

              <div className="w-full mb-4">
                <div className="w-full flex items-center justify-center my-4">
                  <hr className="flex-grow border-t border-gray-300" />
                  <span className="px-3 text-sm text-gray-500 flex flex-col items-center justify-center">
                    <p>ADDED EXCLUSIVE PERKS</p>
                    <p className="text-xs">(Available only on Yearly Plan)</p>
                  </span>
                  <hr className="flex-grow border-t border-gray-300" />
                </div>
                <div className="flex justify-between">
                  {[
                    { icon: Video, text: "Weekly webinars from experts" },
                    {
                      icon: GraduationCap,
                      text: "Full-length courses for growth",
                    },
                    { icon: Package, text: "Access to Exclusive Resources" },
                  ].map((item, index) => (
                    <div key={index} className="text-center flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <item.icon className="text-blue-500" size={24} />
                      </div>
                      <p className="text-xs sm:text-sm">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-orange-600	 text-white py-2 rounded-full font-semibold mb-2"
              onClick={() => setShowStackedCard(true)}
              >
                Start your 7-day Free Trial
              </button>
              <p className="text-center text-sm text-gray-600 w-full">
                No credit card required
              </p>

              <div className="w-full text-center text-xs text-gray-600 bg-gray-100 p-2 rounded-lg mt-5 flex items-center justify-center gap-1">
                <Lightbulb size={16} color="#ffea00" />
                <p>
                  5000 creators earned 50L+ in the last 24 hours through
                  oneapp
                </p>
              </div>
            </div>
          </div>

       
          <div className="flex-1 bg-gray-50 p-6 sm:p-8 overflow-y-auto">
            <div className="border text-center text-xs absolute p-2 rounded-lg bg-white top-4 right-32 font-bold">
              THE ULTIMATE PRODUCT BUNDLE
            </div>
            <div className="bg-white rounded-lg p-6 shadow-xs border border2">
              {[
                { emoji: "🚀", text: "Your own online store / website" },
                { emoji: "💳", text: "Multiple Payment Gateways" },
                { emoji: "📚", text: "Course Builder" },
                { emoji: "🎥", text: "Host Events & Webinars" },
                { emoji: "🗨️", text: "Offer 1-on-1 sessions" },
                { emoji: "💌", text: "Build Email & SMS lists" },
                { emoji: "🌐", text: "Launch paid communities" },
                { emoji: "💾", text: "Sell Digital Products" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="w-full text-center text-sm text-gray-600 bg-gray-100 p-2 rounded-lg mt-5 flex justify-between items-center"
                >
                  <p className="flex flex-row items-center">
                    <span className="mr-2 text-sm">{item.emoji}</span>{" "}
                    {item.text}
                  </p>
                  <Check size={16} className="text-green-500" />{" "}
                </div>
              ))}

              <div className="text-center">
                <p className="line-through text-red-500 text-lg mb-2">
                  What all of this usually costs ₹50,000/year
                </p>
                <p className="font-semibold text-2xl">
                  With OneApp, it costs just{" "}
                  <span className="text-3xl text-green-600">₹9,999/year</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
