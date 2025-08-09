import { ArrowRight, CheckCircle, MessageCircle, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TelegramSuccess() {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [telegramInviteLink, setTelegramInviteLink] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setShowConfetti(true), 500);
    
    // Get invite link from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const inviteLink = urlParams.get('telegramInvitelink');
    setTelegramInviteLink(inviteLink);
    
    return () => clearTimeout(timer);
  }, []);

  const handleJoinTelegram = () => {
    if (telegramInviteLink) {
      window.open(telegramInviteLink, '_blank');
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles
                className="text-yellow-400 opacity-60"
                size={12 + Math.random() * 8}
              />
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div
        className={`relative z-10 text-center max-w-md mx-auto transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Success Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
            <CheckCircle className="text-white z-10 relative" size={48} />
          </div>

          {/* Telegram Icon Overlay */}
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
            <MessageCircle className="text-white" size={24} />
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Success! 🎉</h1>
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
            Telegram Subscription Purchased
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {telegramInviteLink && telegramInviteLink !== 'null' 
              ? "Your Telegram subscription is ready! Click the join button below to access your exclusive channel."
              : "Your Telegram subscription has been purchased successfully. You can find the invite link in your dashboard."
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {telegramInviteLink && telegramInviteLink !== 'null' ? (
            <>
              <button 
                onClick={handleJoinTelegram}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-2 group"
              >
                <MessageCircle size={20} />
                <span>Join Telegram Channel</span>
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>

              <button 
                onClick={handleGoToDashboard}
                className="w-full bg-white text-gray-700 font-medium py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                Return to Dashboard
              </button>
            </>
          ) : (
            <button 
              onClick={handleGoToDashboard}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              <span>Go to Dashboard</span>
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </button>
          )}
        </div>

        {/* Status Indicators */}
        <div className="mt-8 flex justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Connected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Synced</span>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 text-white opacity-10"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
}

export default TelegramSuccess;
