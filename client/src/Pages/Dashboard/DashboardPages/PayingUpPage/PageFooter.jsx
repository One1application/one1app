import React from 'react'
import { Link } from 'react-router-dom'
import Logo from "../../../../assets/oneapp.png";

const PageFooter = () => {
  return (
    <section className="py-12 px-16 bg-gray-900 max-md:px-10 max-sm:px-4 ">
        <div className='w-full flex flex-col gap-2 justify-center items-center '>
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="w-32" />
        </Link>
        <Link to="/" className="flex items-center text-orange-500 hover:text-orange-600">
          Get Started
        </Link>

        
        </div>   



         <div className="mt-12 pt-8 border-t border-gray-1000">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-sm text-gray-400">
                © 2025 contiks one hub technology private limited (OneApp). All rights reserved.
              </p>
              <p className="text-sm text-gray-400">Made with ❤️ in Bharat</p>
            </div>
          <div className="flex space-x-6">
              <Link
                to="/publicpolicy"
                className="text-sm text-gray-400 hover:text-orange-500 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/TermCondition"
                className="text-sm text-gray-400 hover:text-orange-500 transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
              {/* <Link
                to="/refund-cancellation"
                className="text-sm text-gray-400 hover:text-orange-500 transition-colors duration-200"
              >
                Refund & Cancellation
              </Link> */}
              <Link
                to="/disclaimer"
                className="text-sm text-gray-400 hover:text-orange-500 transition-colors duration-200"
              >
                Disclaimer
              </Link>
            </div>  
          </div>
        </div> 
    </section>
  )
}

export default PageFooter