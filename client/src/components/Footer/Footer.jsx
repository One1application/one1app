import { Link } from "react-router-dom";
import { ArrowRight, Loader } from "lucide-react";
// import { Pinterest, YouTube } from "@mui/icons-material";
import { Facebook, Instagram, LinkedIn, Pinterest, Twitter, YouTube } from "developer-icons";
import { subscribeNewsLetter } from "../../services/auth/api.services";
import { useState } from "react";
import toast from "react-hot-toast";
import CustomThemes from "../../Zustand/CustomThemes";
import { useThemeSelectorStore } from "../../Zustand/ThemeStore.js";

const Footer = () => {
  const footerLinks = {
    products: [
      { name: "Analysis", href: "/signup" },
      { name: "Telegram", href: "/signup" },
      { name: "Automation", href: "/TelegramsPages" },
      { name: "Premium", href: "/signup" },
    ],
    company: [
      { name: "About Us", href: "/about-us" },
      { name: "Careers", href: "/hiring" },
      { name: "Contact", href: "/contactus" },
    ],
  };

  const { theme } = useThemeSelectorStore();
  const socialLinks = [
    { icon: <YouTube size={20} />, href: "https://www.youtube.com/@OneApp8" },
    { icon: <Facebook size={20} />, href: "https://www.facebook.com" },
    { icon: <Pinterest size={20} />, href: "https://in.pinterest.com/one1app/" },
    { icon: <Twitter size={20} />, href: "https://www.twitter.com" },
    
    {
      icon: <Instagram size={20} />,
      href: "https://www.instagram.com/one_1app/",
    },
    {
      icon: <LinkedIn size={20} />,
      href: "https://www.linkedin.com/company/one1app/",
    },
  ];

  const [data, setData] = useState({
    email: "",
    loading: false,
  });

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!data.email) {
      return toast.error("Please enter your email");
    }
    setData({ ...data, loading: true });
    await subscribeNewsLetter(data.email.trim());
    setData({ email: "", loading: false });
  }

  return (
    <footer className="bg-{theme} text-gray-300" data-theme={theme}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col space-y-4">
              <h1 className="text-lg font-bold text-orange-500">
                CONTIKS ONE HUB TECHNOLOGY PRIVATE LIMITED
              </h1>
              <p className="text-sm text-gray-400 mt-4 max-w-xs">
                OneApp Technology is an all-in-one platform that simplifies
                convenience, efficiency, and accessibility in a single,
                user-friendly application.
              </p>
              <p className="text-sm text-gray-400 mt-2 max-w-xs">
                FG 103, Plot No: 15 Orient Residency Jaipur , 302029
              </p>
              {/* Newsletter */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Subscribe to our newsletter
                </h3>
              
                <form className="flex gap-2" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={data.email}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg flex-grow text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                    {data.loading ? (
                      <Loader size={16} className="animate-spin" />
                    ) : (
                      <ArrowRight size={16} />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Products
              </h3>
              <ul className="space-y-3">
                {footerLinks.products.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <ArrowRight
                        size={14}
                        className="opacity-0 -ml-4 group-hover:opacity-100 transition-all duration-200 mr-1"
                      />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <ArrowRight
                        size={14}
                        className="opacity-0 -ml-4 group-hover:opacity-100 transition-all duration-200 mr-1"
                      />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-gray-400 hover:text-orange-500"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-1000">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-sm text-gray-400">
                © 2025 contiks one hub technology private limited (OneApp). All
                rights reserved.
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
      </div>
    </footer>
  );
};

export default Footer;
