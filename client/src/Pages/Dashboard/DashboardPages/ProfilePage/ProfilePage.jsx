// src/ProfilePage.jsx
import { useState, useEffect } from "react";
import { PiIdentificationCardThin } from "react-icons/pi";
import ProfileTab from "./components/ProfileTab";
import BillingTab from "./components/BillingTab";
import BrandingTab from "./components/BrandingTab";
import PaymentTab from "./components/PaymentTab";
import { fetchUserDetails } from "../../../../services/auth/api.services";
import { useAuth } from "../../../../context/AuthContext";
import TelegramChanneladd from "./components/TelegramChannelAdd";
import { FaTelegram } from "react-icons/fa";

const ProfilePage = () => {
  const [value, setValue] = useState("1");
  const { userDetails, userdetailloading } = useAuth();

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  if (userdetailloading) {
    return (
      <div className="min-h-screen w-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full min-h-screen md:px-5 md:py-3 px-2 py-2 bg-[#0F1418]">
      <div className="flex flex-col bg-[#1A1D21] md:py-3 md:px-4 py-3 px-2 rounded-md">
        {/* Header Section */}
        <div className="flex bg-[#1E2328] py-6 px-3 rounded-md items-center justify-between">
          <div className="flex gap-3">
            <PiIdentificationCardThin className="md:size-8 size-5 text-orange-500" />
            <p className="font-poppins tracking-tight text-[16px] md:text-xl font-bold text-orange-500">
              Account Settings
            </p>
          </div>
        </div>

        {/* Tab Section */}
        <div className="mt-6">
          <div className="flex flex-col">
            {/* Centered tabs with responsive layout */}
            <div className="flex flex-col md:flex-row items-center justify-center w-full">
              <div className="flex flex-col md:flex-row md:space-x-8 border-b border-gray-700">
                <button
                  className={`
                    w-full md:w-auto 
                    py-3 md:py-2 
                    text-center 
                    transition-all 
                    duration-200 
                    text-base md:text-xl 
                    ${
                      value === "1"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-400 hover:text-gray-200"
                    }
                  `}
                  onClick={() => handleChange("1")}
                >
                  Profile
                </button>
                <button
                  className={`
                    w-full md:w-auto 
                    py-3 md:py-2 
                    text-center 
                    transition-all 
                    duration-200 
                    text-base md:text-xl 
                    ${
                      value === "2"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-400 hover:text-gray-200"
                    }
                  `}
                  onClick={() => handleChange("2")}
                >
                  Billing
                </button>
                {/* <button
                  className={`
                    w-full md:w-auto 
                    py-3 md:py-2 
                    text-center 
                    transition-all 
                    duration-200 
                    text-base md:text-xl 
                    ${
                      value === "3"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-400 hover:text-gray-200"
                    }
                  `}
                  onClick={() => handleChange("3")}
                >
                  Branding
                </button> */}
                <button
                  className={`
                    w-full md:w-auto 
                    py-3 md:py-2 
                    text-center 
                    transition-all 
                    duration-200 
                    text-base md:text-xl 
                    ${
                      value === "3"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-400 hover:text-gray-200"
                    }
                  `}
                  onClick={() => handleChange("3")}
                >
                  Payments
                </button>
                <button
                  className={`
                    w-full md:w-auto 
                    py-3 md:py-2 
                    text-center 
                    transition-all 
                    duration-200 
                    text-base md:text-xl 
                    ${
                      value === "4"
                        ? "border-b-2 border-orange-500 text-orange-500"
                        : "text-gray-400 hover:text-gray-200"
                    }
                  `}
                  onClick={() => handleChange("4")}
                >

                  <div className="flex items-center justify-center gap-1">
                   <FaTelegram className="md:size-5 size-4 text-orange-600"/>
                   <span>Telegram</span>

                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {value === "1" && <ProfileTab />}
        {value === "2" && <BillingTab />}
        {/* {value === "3" && <BrandingTab />} */}
        {value === "3" && <PaymentTab />}
        {value === "4" && <TelegramChanneladd/>}
      </div>
    </div>
  );
};

export default ProfilePage;
