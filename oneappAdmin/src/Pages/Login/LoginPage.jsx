import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Send, ArrowRight } from 'lucide-react';
import logo from '../../assets/oneapp.png';
import { adminLogin, selfIdentification, verifyAdminOtp } from '../../services/api-service';
import { useAuthStore } from '../../store/authStore';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('phone'); // Track current step (phone or OTP)
  const setUser = useAuthStore((state) => state.setUser);
  const { setLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      if (!phoneNumber.match(/^\d{10}$/)) {
        toast.error("Please enter a valid phone number.");
        return;
      }

      const response = await adminLogin('+91' + phoneNumber);

      toast.success(response.message);
      setStage('otp');
    } catch (error) {
      toast.error("Error to Sending OTP or Your Not Authorize")
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (otp.length !== 6) {
        toast.warning("Invalid OTP")
        return
      }
      setLoading(true)
      const response = await verifyAdminOtp('+91' + phoneNumber, otp);

      localStorage.setItem("AuthToken", response.token);

      const data = await selfIdentification()
      if (data.success === true) {
        setUser(data.userDetails)
        navigate('/dashboard');
      } else {
        navigate('/')
      }



    } catch (error) {
      toast.error("Invalid OTP")
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="flex justify-center py-6 bg-gray-50">
          <img src={logo} alt="OneApp Logo" className="w-32 h-32 object-contain" />
        </div>

        <div className="p-8">
          {stage === 'phone' ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                Admin Login
              </h2>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  className="w-full py-3 px-4 border rounded-xl focus:outline-none focus:border-orange-500"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <button
                onClick={handleSendOTP}
                className="w-full py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700"
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2 text-gray-800 tracking-tight">
                  Verify OTP
                </h2>
                <p className="text-gray-500 mb-6">Enter the 6-digit code sent to your email</p>

                <div className="mb-6">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    minLength={6}
                    maxLength={6}
                    required
                    className="w-full text-center text-3xl tracking-[0.5em] py-3 border-2 border-gray-200 rounded-xl 
                  focus:outline-none focus:border-blue-500 transition duration-300 text-gray-800"
                    placeholder="_ _ _ _ _ _"
                  />
                </div>

                <button
                  onClick={handleVerifyOTP}
                  className="w-full py-3 bg-orange-600 text-white font-semibold rounded-xl 
                hover:bg-orange-700 transition duration-300 flex items-center justify-center gap-2
                transform hover:scale-105 active:scale-95"
                >
                  Verify & Login <Lock size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
