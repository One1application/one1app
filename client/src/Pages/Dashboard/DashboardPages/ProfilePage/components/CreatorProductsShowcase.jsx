import React, { useEffect } from "react";
import { BookOpen, Video, Gem, FileText, ArrowRight } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTelegramAuthStore } from "../../../../../Zustand/TelegramApicalls.js";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      type: "spring",
      stiffness: 100,
    },
  }),
};

const CreatorProductsShowcase = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useTelegramAuthStore();

  useEffect(() => {}, [isAuthenticated]);

  const products = [
    {
      icon: <BookOpen className="w-5 h-5 text-orange-600" />,
      iconBg: "bg-orange-100",
      title: "Courses",

      features: [
        "Charge for video courses",
        "Create tiered pricing (Basic/Premium)",
        "Drip content releases",
        "Built-in community for students",
      ],
      cta: "Launch your course",
      path: "/dashboard/courses",
    },
    {
      icon: <Video className="w-5 h-5 text-red-600" />,
      iconBg: "bg-red-100",
      title: "Webinars",

      features: [
        "Sell tickets to live events",
        "VIP packages with 1:1 access",
        "Paid Q&A sessions",
      ],
      cta: "Schedule webinar",
      path: "/dashboard/webinar",
      color: "red",
    },
    {
      icon: <FileText className="w-5 h-5 text-pink-600" />,
      iconBg: "bg-pink-100",
      title: "Digital Products",

      features: [
        "PDFs/ebooks (guides, workbooks)",
        "Spreadsheet templates (finance, planners)",
        "Notion templates",
        "Design assets (Canva, PSD, Figma)",
      ],
      cta: "Upload products",
      path: "/dashboard/payingup",
      color: "pink",
    },
    {
      icon: <FaTelegramPlane className="w-5 h-5 text-blue-500" />,
      iconBg: "bg-blue-100",
      title: "Telegram Community",

      features: [
        "Exclusive paid channels",
        "Premium group memberships",
        "Direct messaging monetization",
        "Automated content delivery",
        "Manage your clients",
      ],
      cta: "Setup community",
      path: isAuthenticated
        ? "/dashboard/telegram"
        : "/dashboard/telegram-interface",
      color: "blue",
    },
    {
      icon: <Gem className="w-5 h-5 text-purple-600" />,
      iconBg: "bg-purple-100",
      title: "Premium Content",

      features: [
        "Bundled resource packs",
        "Licensed content sales",
        "White-label materials",
        "Enterprise pricing",
      ],
      cta: "Create premium offer",
      path: "/dashboard/premium-content",
      color: "purple",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-100">
              Monetize Your Creativity
            </span>
          </h1>
          <p className="text-xl md:text-xl max-w-3xl mx-auto text-orange-50">
            Helping creators do what they love—better. From courses and webinars
            to digital downloads and communities, we make it easy to build and
            grow your brand.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              whileHover={{ y: -5 }}
            >
              <div className="p-6">
                <div
                  className={`w-12 h-12 rounded-lg ${product.iconBg} flex items-center justify-center mb-4`}
                >
                  {product.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-1">
                  {product.title}
                </h3>
                <p
                  className={`text-sm font-medium text-${product.color}-200 mb-4`}
                >
                  {product.monetization}
                </p>

                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, j) => (
                    <li key={j} className="flex items-center">
                      <span
                        className={`text-${product.color}-300 text-xl mr-2 animate-pulse text-green-400`}
                      >
                        •
                      </span>
                      <span className="text-sm text-orange-50">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleNavigation(product.path)}
                  className={`w-full flex items-center justify-between px-4 py-2 bg-${product.color}-500/20 hover:bg-${product.color}-500/30 text-white rounded-lg transition-colors border border-${product.color}-300/30`}
                >
                  <span className="font-medium">{product.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorProductsShowcase;
