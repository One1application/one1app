import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { verifyPayment } from '../../services/auth/api.services';

export default function PaymentPage() {
  console.log('afafa');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPaymentWithPhonePay = async () => {
      try {
        const merchantOrderId = searchParams.get('merchantOrderId');
        const subscriptionId = searchParams.get('subscriptionId');
        const courseId = searchParams.get('courseId');
        const payingUpId = searchParams.get('payingUpId');
        const webinarId = searchParams.get('webinarId');
        const contentId = searchParams.get('contentId');
        const telegramId = searchParams.get('telegramId');
        const discountedPrice = searchParams.get('discountedPrice');
        const paymentProvider = searchParams.get('paymentProvider');
        const razorpay_signature = searchParams.get('razorpay_signature');
        const razorpay_payment_id = searchParams.get('razorpay_payment_id');
        const razorpay_order_id = searchParams.get('razorpay_order_id');
        console.log('subscriptionId', subscriptionId);
        const response = await verifyPayment({
          phonePayOrderId: merchantOrderId,
          courseId,
          payingUpId,
          subscriptionId,
          webinarId,
          telegramId,
          premiumContentId: contentId,
          discountedPrice,
          paymentProvider,
          razorpay_signature,
          razorpay_payment_id,
          razorpay_order_id,
        });
        if (response?.data?.success) {
          setStatus('success');

          if (courseId || webinarId || payingUpId) {
            setTimeout(() => {
              window.location.href = `${import.meta.env.VITE_FRONTEND_URL || 'https://one1app.com'}/user/dashboard`;
            }, 3000);
          }
        } else {
          throw new Error(response?.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'An error occurred during payment verification');
      }
    };

    verifyPaymentWithPhonePay();
  }, [searchParams, navigate]);

  // Render different views based on status
  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Verifying your payment</h2>
            <p className="text-gray-600">Please wait while we confirm your transaction...</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <div className="mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600">Thank you for your purchase. You will be redirected to your course shortly.</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <div className="mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Payment Verification Failed</h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
                Go to Home
              </button>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                Try Again
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">{renderContent()}</div>
    </div>
  );
}
