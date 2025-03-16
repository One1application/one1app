/* eslint-disable react/no-unescaped-entities */
// import { useState } from "react";
import Navbar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";
// import RefundImg from "../../../assets/Refund&Cancellation.png";

const RefundCancellation = () => {
  //   const [showPolicy, setShowPolicy] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block px-60 py-10 bg-orange-500  rounded-full">
              {/* Returns & Cancellations */}
            </div>
            <h1 className="text-5xl font-extrabold text-orange-500 tracking-tight">
              Refund & Cancellation
              <span className="block text-xl text-gray-300 mt-3 font-normal">
                Contiks One Hub Technology Pvt. Ltd.
              </span>
              <p className="text-sm text-gray-400">
                Effective Date: 5 February 2025
              </p>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Refunds are offered if the service hasn't been used. Cancellations
              take effect at the next billing cycle and must be done before
              renewal to avoid additional charges.
            </p>
            {/* <div>
              <button className="px-10 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition duration-300 shadow-lg">
                View Full Policy
              </button>
            </div> */}
          </div>
          {/* <div className="flex justify-center">
            <img
              src={RefundImg}
              alt="Refund Cancellation Policy"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div> */}
        </div>
      </section>

      {/* Disclaimer Content */}

      <section className="container mx-auto px-4 py-8 bg-black">
        <div className="max-w-7xl mx-auto bg-black p-12 shadow-lg">
          <div className="border-b border-orange-500 pb-6 mb-10">
            <h2 className="text-4xl font-bold text-orange-500">
              Refund & Cancellation Details
            </h2>
          </div>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <p>
              • By purchasing a plan, you acknowledge and agree that your
              subscription will automatically renew, and the Company will
              continue to charge you on a recurring basis until you cancel your
              subscription, with such cancellation only taking effect at the
              start of the next billing cycle.
            </p>
            <p>
              • If your subscription is set to auto-renew at the end of each
              billing period, you can cancel it by adjusting your account
              settings. For users who pay through third-party applications, the
              subscription may be canceled by changing the relevant settings
              within those apps. Alternatively, you can contact customer support
              or send an email to hello@one1app.com. Upon receiving your
              cancellation request, the Company will deactivate the auto-renewal
              feature.
            </p>
            <p>
              • After canceling, you will still have access to the service until
              the end of your current billing cycle.
            </p>
            <p>
              • If you have a paid plan, you will not be eligible for a refund
              upon cancellation or if you do not use the service. Even if you
              choose not to use your subscription, you will retain access until
              the end of your billing period. Non-use of the service does not
              entitle you to a refund for any unused portion of your
              subscription.
            </p>
            <p>
              • Please note that if you delete your account, you will lose
              access to the remaining paid time and services in your
              subscription. By proceeding with account deletion, you explicitly
              agree to forfeit any remaining time or services in your current
              paid plan and acknowledge that no refund will be issued.
            </p>
            <p>
              • Any maintenance charges, if applicable, may be added as
              convenience or platform fees, and these fees are non-refundable
              once paid.
            </p>
            <p>
              • We do not collect any fees or charges from End Users (as defined
              in the Terms and Conditions), except for amounts payable by them
              to you, which we may collect on your behalf. Therefore, we do not
              offer refunds to End Users for such payments.
            </p>
            <p>
              • We reserve the right to modify these terms and conditions at any
              time. This may include changes to reflect new laws or service
              updates. It is your responsibility to review the terms regularly.
              Continued use of the services after any changes will be considered
              as your acceptance of the revised terms.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RefundCancellation;
