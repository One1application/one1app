import { Antenna, CreditCard, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
// import ProfileImg from "../../../../assets/oneapp.jpeg";
import SigninModal from "../../../../components/Modal/SigninModal";
import SignupModal from "../../../../components/Modal/SignupModal";
import {
  fetchTelegram,
  purchaseTelegram,
} from "../../../../services/auth/api.services";

const TelegramFormPrev = () => {
  const [params] = useSearchParams();
  const telegramId = params.get("id");
  const [data, setData] = useState(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Default payment methods
  const paymentMethods = [
    {
      name: "PhonePe",
      icon: "Wallet",
      color: "purple-600",
    },
    {
      name: "GPay",
      icon: "CreditCard",
      color: "green-600",
    },
  ];

  const footerLinks = [
    { title: "Privacy", path: "/publicpolicy" },
    { title: "Terms", path: "/terms" },
    { title: "Refund", path: "/refund-cancellation" },
    { title: "Disclaimer", path: "/disclaimer" },
  ];

  const disclaimers = {
    general:
      "CosmicFeed Technologies Pvt. Ltd. shall not be held liable for any content or materials published, sold, or distributed by content creators on our associated apps or websites. We do not endorse or take responsibility for the accuracy, legality, or quality of their content. Users must exercise their own judgment and discretion when relying on such content.",
    riskWarning:
      "Trading in financial markets involves substantial risks. Past performance is not indicative of future results.",
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

  useEffect(() => {
    if (!telegramId) return;

    const fetchTelegramDetails = async () => {
      try {
        const response = await fetchTelegram(telegramId);
        setData(response?.telegram);
      } catch (error) {
        console.error("Error while fetching telegram.", error);
        if (!handleAuthError(error)) {
          toast.error("Please try later.");
        }
      }
    };

    fetchTelegramDetails();
  }, [telegramId]);

  const handlePayment = async (plan) => {
    try {
      const response = await purchaseTelegram({
        telegramId: data.id,
        days: plan.validDays,
      });
      window.location.href = response.data.payload.redirectUrl;
    } catch (error) {
      console.error("Error during payment of telegram.", error);
      if (!handleAuthError(error)) {
        toast.error("Payment initiation failed");
      }
    }
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

   

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-slate-950 p-8 flex items-center justify-center overflow-hidden">
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

      {/* Fixed Background Circles */}
      <div className="fixed w-[32rem] h-[30rem] rounded-full bg-orange-600 opacity-80 -left-48 -bottom-20 "></div>
      <div className="fixed w-[32rem] h-[32rem] rounded-full bg-orange-600 opacity-80 -right-48 -top-48"></div>

      {/* Main container with gradient background */}
      <div className="relative w-full max-w-5xl mx-auto bg-gradient-to-br from-gray-300/20 to-gray-500/20 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-6 relative z-10">
          {/* Left Section */}
          <div className="flex-1 bg-gray-900/60 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                <img
                  src={data.coverImage}
                  alt={`${data.title}'s avatar`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-gray-400 text-sm">Channel Name</div>
                <div className="text-white font-medium">{data.title}</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-white text-lg font-semibold mb-4">
                  About the channel
                </h2>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-800/60 rounded-full text-sm text-gray-300">
                    {data.genre}
                  </span>
                  <span className="px-3 py-1 bg-gray-800/60 rounded-full text-sm text-orange-400">
                    {data.subscriptions.length} Plan
                    {data.subscriptions.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {data.description}
                </p>
              </div>

              <div className="justify-end">
                <h3 className="text-gray-400 font-medium mb-2">Disclaimer</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {disclaimers.general}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed mt-2">
                  {disclaimers.riskWarning}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:w-[45%] bg-gray-900/60 backdrop-blur-sm rounded-xl p-6">
            <div className="flex justify-center mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Antenna className="w-8 h-8 text-orange-400" />
                </div>
                <h2 className="text-white text-xl font-semibold">
                  Subscribe to {data.title}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-gray-400 mb-2 font-medium">
                Select a plan and continue
              </div>
              {data.subscriptions.map((plan) => (
                <button
                  key={plan.id}
                  className="w-full p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg flex justify-between items-center hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/20"
                  onClick={() => handlePayment(plan)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">₹{plan.price}</span>
                    <span className="text-xs text-orange-200">{plan.type}</span>
                  </div>
                  <span className="font-semibold">₹{plan.price}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="text-sm text-gray-400 mb-4 font-medium">
                Guaranteed safe & secure payment
              </div>
              <div className="flex justify-center items-center gap-6">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex flex-col items-center group">
                    <div
                      className={`w-12 h-12 bg-${method.color} rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      {method.icon === "Wallet" ? (
                        <Wallet className="w-6 h-6 text-white" />
                      ) : (
                        <CreditCard className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <span className="text-sm text-gray-400 mt-2 group-hover:text-white transition-colors duration-300">
                      {method.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm font-medium">
                Made with
              </span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span className="text-gray-400 text-sm font-medium">
                in Bharat
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-x-6">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  className="group relative text-sm text-gray-400 hover:text-orange-400 transition-all duration-300 ease-in-out px-2 py-1"
                >
                  <span className="relative">
                    {link.title}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramFormPrev;
