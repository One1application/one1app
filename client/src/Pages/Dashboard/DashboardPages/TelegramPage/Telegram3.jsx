import Lottie from "lottie-react";
import animation from "../../../../assets/celebration.json";
const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200  to-pink-500 flex flex-col items-center justify-center p-6">
     
      {/* Success Card */}
      <div className=" w-2/3 bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 border border-gray-700">
       
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-8 px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-black/20 p-3 rounded-full backdrop-blur-sm border border-orange-300/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-200" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Registration Successful</h1>
        </div>

        {/* Content Area */}
        <div className="py-8 px-6">
          <h2 className="text-xl font-semibold text-center text-orange-100 mb-2">Welcome to OneApp</h2>
          <p className="text-gray-300 text-center mb-6">
            You're now part of our professional community. We're excited to see what you'll accomplish.
          </p>

          {/* Benefits List */}
          <div className="bg-gray-750 rounded-lg p-4 mb-6 border border-gray-600">
            <h3 className="text-sm font-medium text-orange-400 mb-3">YOUR ACCOUNT INCLUDES:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-200">Secure document sharing</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-200">Real-time collaboration tools</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-200">Priority customer support</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-200">Advanced security features</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <a
              href="/dashboard/telegram"
              className="w-full max-w-xs py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 text-center group"
            >
              <span className="flex items-center justify-center">
                Go to Dashboard
                <svg className="ml-2 h-5 w-5 text-orange-200 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>
          
          </div>
          
        </div>

        {/* Professional Footer */}
        <div className="bg-gray-850 py-4 px-6 border-t border-gray-700 text-center">
          <p className="text-xs text-gray-400">
            Need help? <a href="/support" className="text-orange-400 hover:text-orange-300 transition-colors">Contact Support</a> 
            {' '} | {' '}
            <a href="/security" className="text-orange-400 hover:text-orange-300 transition-colors">Security Information</a>
          </p>
        </div>
      </div>
       <div className="absolute top-0 left-0 w-full h-full z-0">
        <Lottie
          animationData={animation}
          loop={true}
          autoplay={true}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default WelcomePage;