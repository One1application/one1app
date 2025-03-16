/* eslint-disable react/no-unescaped-entities */
import Navbar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";
import PrivacyPolicyImg from "../../../assets/Privacy-PolicyImg.png";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 bg-black text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium">
              Privacy & Data Protection
            </div>
            <h1 className="text-5xl font-extrabold text-orange-500 tracking-tight">
              Privacy Policy
              <span className="block text-xl text-gray-300 mt-3 font-normal">
                Contiks One Hub Technology Pvt. Ltd.
              </span>
              <p className="text-sm text-gray-500">
                Effective Date: 5 February 2025
              </p>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Comprehensive framework ensuring data security, transparency, and
              user trust.
            </p>
            {/* <div>
              <button className="px-10 py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition duration-300 shadow-lg">
                View Full Policy
              </button>
            </div> */}
          </div>
          <div className="flex justify-center">
            <img
              src={PrivacyPolicyImg}
              alt="Privacy Policy"
              className="w-full max-w-md rounded-2xl shadow-lg border border-orange-500"
            />
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="container mx-auto px-4 py-16 bg-black">
        <div className="max-w-7xl mx-auto bg-black  p-12 shadow-lg">
          <div className="border-b border-orange-500 pb-6 mb-10">
            <h2 className="text-4xl font-bold text-orange-500">
              Privacy Policy Details
            </h2>
          </div>

          <div className="prose prose-gray">
            <p className=" leading-relaxed">
              At Contiks One Hub Technology Pvt. Ltd. (U47912RJ2025PTC099521),
              we value your privacy and are committed to protecting your
              personal information (“we”, “us”, or “our”) This Privacy Policy
              outlines how we collect, use, and protect your data when you
              engage with our services, including our platform that helps
              content creators grow and monetize their content while enabling
              users to enjoy personalized experiences By accessing or using our
              platform, you agree to the terms outlined in this policy. If you
              do not agree, please refrain from using our services.
            </p>
          </div>

          <div className="space-y-12 text-gray-300 leading-relaxed mt-6">
            <div className="space-y-4 ">
              <h3 className="text-2xl font-semibold text-orange-500">
                What Information We Collect?
              </h3>
              <p>
                We may collect and process the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Personal Information:</strong> Name, email address,
                  phone number, profile information (for creators and users),
                  payment.
                </li>
                <li>
                  <strong>Content Information:</strong> Content you upload,
                  share, or create, including text, images, videos, and other
                  media.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information on how you use our
                  services, including your interactions with the platform,
                  device information, IP addresses, browser type, and operating
                  system.
                </li>
                <li>
                  <strong>Payment Information:</strong> If you are a content
                  creator who monetizes your content, we collect financial data
                  to process payments. All payment information is handled
                  securely by third-party payment processors.
                </li>
                <li>
                  <strong>Location Data:</strong> If you use location-based
                  services on the platform, we may collect location information
                  with your consent.
                </li>
              </ul>
            </div>

            <div className="space-y-4 ">
              <h2 className="text-2xl font-semibold text-orange-500">
                How We Use Your Information
              </h2>
              <p>We use your information for the following purposes:</p>
              <ul className="space-y-4 list-disc pl-6">
                <li className="font-normal">
                  <span className="font-semibold">To Provide Services:</span> To
                  enable content creation, sharing, and monetization features
                  for creators and deliver personalized experiences to users.
                </li>
                <li className="font-normal">
                  <span className="font-semibold">
                    To Improve Our Platform:
                  </span>{" "}
                  To enhance and optimize the functionality, user experience,
                  and features of our platform based on user feedback and
                  interaction.
                </li>
                <li className="font-normal">
                  <span className="font-semibold">To Process Payments:</span> To
                  manage financial transactions between content creators and
                  users for services such as subscriptions, course, and
                  purchases.
                </li>
                <li className="font-normal">
                  <span className="font-semibold">
                    For Marketing and Promotions:
                  </span>{" "}
                  With your consent, we may send you promotional materials
                  related to our platform, new features, content creator
                  programs, and updates.
                </li>
                <li className="font-normal">
                  <span className="font-semibold">
                    To Communicate with You:
                  </span>{" "}
                  To provide customer support, notify you about changes to our
                  services, and respond to inquiries or feedback.
                </li>
                <li className="font-normal">
                  <span className="font-semibold">To Ensure Compliance:</span>{" "}
                  To comply with legal requirements, prevent fraud, enforce
                  terms of service, and protect the security of our platform.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-orange-500">
                Data Security
              </h2>
              <p>
                We use reasonable administrative, technical, and physical
                safeguards to protect your information from unauthorized access,
                alteration, or destruction. However, please note that no data
                transmission over the internet can be guaranteed to be 100%
                secure.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-orange-500">
                Your Rights and Choices
              </h2>
              <p>
                Depending on your location and applicable laws, you may have the
                following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <span className="font-semibold">Access:</span> You have the
                  right to request access to the personal data we hold about
                  you.
                </li>
                <li>
                  <span className="font-semibold">Correction:</span> You can
                  update or correct any inaccurate information.
                </li>
                <li>
                  <span className="font-semibold">Deletion:</span> You may
                  request the deletion of your personal data in accordance with
                  applicable laws.
                </li>
                <li>
                  <span className="font-semibold">
                    Opt-Out of Marketing Communications:
                  </span>{" "}
                  You can unsubscribe from our promotional emails at any time by
                  following the unsubscribe link in the email or contacting us
                  directly.
                </li>
                <li>
                  <span className="font-semibold">Withdraw Consent:</span> If we
                  rely on your consent to process your data, you can withdraw
                  your consent at any time.
                </li>
              </ul>
              <p>
                To exercise these rights, please contact us at{" "}
                <a
                  href="mailto:Hello@one1app.com"
                  className="text-blue-600 hover:underline"
                >
                  Hello@one1app.com
                </a>
                .
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-orange-500">
                Children's Privacy
              </h2>
              <p>
                Our platform is not intended for individuals under the age of
                13. We do not knowingly collect personal information from
                children under the age of 13. If we learn that we have
                inadvertently collected information from a child under 13, we
                will take steps to delete that information promptly.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-orange-500">
                Data Retention
              </h2>
              <p>
                We retain your personal data only for as long as necessary to
                fulfill the purposes outlined in this policy or as required by
                law. When no longer needed, we will securely delete or anonymize
                your data.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-orange-500">
                Third-Party Links
              </h2>
              <p>
                Our platform may contain links to third-party websites or
                services that are not operated by us. We are not responsible for
                the privacy practices or content of these third-party sites.
                Please review their privacy policies before providing any
                personal data.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-orange-500">
                Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. When we do,
                we will post the revised version on this page and update the
                "Effective Date" at the top of the policy. We encourage you to
                review this policy periodically to stay informed about how we
                are protecting your data.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-orange-500">
                Contact Us
              </h3>
              <p>
                <strong>Contiks One Hub Technology Pvt. Ltd.</strong>
              </p>
              <p>
                Email:{" "}
                <a href="mailto:Hello@one1app.com" className=" hover:underline">
                  Hello@one1app.com
                </a>
              </p>
              <p>
                Address: F-G 103, Plot No.15, Orient Residency, Murlipura,
                Jaipur-302039-Rajasthan
              </p>
            </div>
          </div>

          <div className="mt-12 bg-orange-600 p-6 rounded-xl text-center">
            <p className="text-white font-medium">
              By using our platform, you acknowledge that you have read and
              understood this Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
