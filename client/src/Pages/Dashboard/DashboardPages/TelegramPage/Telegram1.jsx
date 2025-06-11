import { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import animation from "../../../../assets/connecting.json";

const ConnectPage = () => {
  const [step, setStep] = useState(0);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const otpInputRefs = useRef([]);

  // Initialize OTP input refs
  useEffect(() => {
    otpInputRefs.current = otpInputRefs.current.slice(0, 6);
  }, []);

  const handleConnectClick = () => {
    setStep(1);
  };

  const handleSendOtp = () => {
    if (!mobileNumber.match(/^\d{10}$/)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    
    setError("");
    setCountdown(60);
    setStep(2);
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
    
    // Auto-submit when all fields are filled
    if (index === 5 && value && newOtp.every(digit => digit !== "")) {
      handleOtpSubmit();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleResendOtp = () => {
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    
    // Restart countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpSubmit = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      console.log("OTP Submitted:", fullOtp);
      setIsSubmitting(false);
      // Here you would typically redirect to the success page
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200  to-pink-500 flex flex-col items-center justify-center p-4 sm:p-6">
      

      {/* Main Card */}
      <div className="w-2/3 h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 relative z-10">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-700 py-6 px-4 sm:px-8 text-center relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <div className="relative">
            <div className="flex justify-center items-center space-x-4 sm:space-x-8 mb-4">
              <div className="bg-gray-900 p-2 rounded-lg border border-gray-700">
                <img 
                  src="https://www.celsoazevedo.com/files/android/f/telegram-img.png" 
                  alt="Telegram Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
              
             <Lottie
          animationData={animation}
          loop={true}
          autoplay={true}
          className="w-1/4"
        />
              
              <div className="bg-gray-900 p-2 rounded-lg border border-gray-700">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm px-2 py-1 rounded">
                  OneApp
                </div>
              </div>
            </div>
            
            <h1 className="text-xl font-bold text-white tracking-tight">
              {step === 0 
                ? "Connect Telegram with OneApp" 
                : step === 1 
                  ? "Verify Your Identity" 
                  : "Enter Verification Code"}
            </h1>
          </div>
        </div>

        {/* Card Content */}
        <div className="py-8 px-4 sm:px-8">
          {step === 0 && (
            <div className="text-center">
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-6">
                  Securely connect your Telegram account to access premium features on OneApp
                </p>
              </div>
              
              <button
                onClick={handleConnectClick}
                className="w-1/2 py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg shadow-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
              >
                Connect Accounts
              </button>
              
              <div className="mt-6 text-xs text-gray-500 flex justify-center space-x-4">
                <span>🔒 End-to-end encrypted</span>
                <span>⚡ Instant setup</span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700">
                  <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-gray-400 mb-2">
                  Enter your Telegram mobile number to receive a verification code
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-300">+91</span>
                  </div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Mobile number"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                  />
                </div>
                
                {error && (
                  <div className="text-red-400 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}
                <div className="flex justify-center">
                <button
                  onClick={handleSendOtp}
                  className="w-1/2 py-3 px-6 center bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg shadow-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                >
                  Send Verification Code
                </button>
                </div>
              </div>
              
              
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-700">
                  <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <p className="text-gray-400">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-orange-400 font-medium mt-1">
                  +91 ••• ••• {mobileNumber.slice(-4)}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-center space-x-2 sm:space-x-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="tel"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
                    />
                  ))}
                </div>
                
                {error && (
                  <div className="text-red-400 text-sm flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}
                 <div className="flex justify-center">
                <button
                  onClick={handleOtpSubmit}
                  disabled={isSubmitting || otp.some(digit => digit === "")}
                  className={`w-1/2 py-3 px-6 text-white font-medium rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 ${
                    isSubmitting || otp.some(digit => digit === "")
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </div>
                  ) : (
                    "Verify & Continue"
                  )}
                </button>
                </div>
                
                <div className="text-center pt-4 border-t border-gray-700">
                  <p className="text-gray-500 text-sm">
                    {countdown > 0 ? (
                      <span>Resend code in <span className="text-orange-400">{countdown}s</span></span>
                    ) : (
                      <button 
                        onClick={handleResendOtp}
                        className="text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        Resend Verification Code
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="bg-gray-850 py-4 px-6 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} COHTPL • 
            <a href="#" className="text-orange-500 hover:text-orange-300 transition-colors mx-1">Privacy Policy</a> • 
            <a href="#" className="text-orange-500 hover:text-orange-300 transition-colors mx-1">Terms</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;