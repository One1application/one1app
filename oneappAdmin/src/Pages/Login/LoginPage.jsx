import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, Mail, ArrowRight, Send } from 'lucide-react';
import logo from '../../assets/oneapp.png'; // Ensure this path is correct

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('email');
  const navigate = useNavigate();

  const handleSendOTP = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    toast.success('OTP sent successfully!');
    setStage('otp');
  };

  const handleLogin = () => {
    if (otp === '00000') {
      toast.success('Login Successful!');
      navigate('/dashboard');
    } else {
      toast.error('Incorrect OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 transform transition-all hover:scale-105 duration-300">
        {/* Animated Gradient Header */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x"></div>

        {/* Logo Section */}
        <div className="flex justify-center py-6 bg-gray-50">
          <img 
            src={logo} 
            alt="OneApp Logo" 
            className="w-32 h-32 object-contain rounded-full shadow-md"
          />
        </div>

        {/* Login Content */}
        <div className="p-8 relative z-10">
          {/* Icon Container */}
          <div className="absolute top-4 right-4 bg-gray-100 rounded-full p-3">
            <Lock className="text-gray-700" size={24} />
          </div>

          {stage === 'email' ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2 text-gray-800 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-gray-500 mb-6">Enter your email to continue</p>

              <div className="mb-6">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <Mail size={20} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition duration-300"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                className="w-full py-3 bg-orange-600 text-white font-semibold rounded-xl 
                hover:bg-orange-700 transition duration-300 flex items-center justify-center gap-2
                transform hover:scale-105 active:scale-95"
              >
                Send OTP <Send size={20} />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2 text-gray-800 tracking-tight">
                Verify OTP
              </h2>
              <p className="text-gray-500 mb-6">Enter the 5-digit code sent to your email</p>

              <div className="mb-6">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={5}
                  className="w-full text-center text-3xl tracking-[0.5em] py-3 border-2 border-gray-200 rounded-xl 
                  focus:outline-none focus:border-blue-500 transition duration-300 text-gray-800"
                  placeholder="_ _ _ _ _"
                />
              </div>

              <div className="flex justify-between mb-6">
                <button 
                  onClick={() => setStage('email')}
                  className="text-sm text-orange-600 hover:underline flex items-center gap-1"
                >
                  <ArrowRight size={16} /> Change Email
                </button>
                <button 
                  onClick={handleSendOTP}
                  className="text-sm text-orange-600 hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-3 bg-orange-600 text-white font-semibold rounded-xl 
                hover:bg-orange-700 transition duration-300 flex items-center justify-center gap-2
                transform hover:scale-105 active:scale-95"
              >
                Verify & Login <Lock size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
