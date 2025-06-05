import {
  Sparkles,
  Activity,
  Globe,
  Users,
  Map,
  MessageCircle,
  Share2,
  MessageSquareQuoteIcon,
  CircleX,
} from "lucide-react";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { HomePageConfig } from "./homeConfig.js";
import "leaflet/dist/leaflet.css";
import CustomThemes from "../../../../Zustand/CustomThemes.jsx";
import { useThemeSelectorStore } from "../../../../Zustand/ThemeStore.js";
import ComingSoonSection from "../../../../ComingSoonSection/ComingSoonSection.jsx";
import ReviewForm from "../../../../Review/ReviewForm.jsx";
import { MessageCircleHeart } from "lucide-react";

// Enhanced visitor data with Indian states
const generateVisitorData = (count = 10) => {
  const indianStates = [
    { name: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.209 },
    { name: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777 },
    { name: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
    { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
    { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
    { name: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867 },
    { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
    { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
    { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
    { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
    { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
    { name: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
    { name: "Chandigarh", state: "Punjab", lat: 30.7333, lng: 76.7794 },
    { name: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362 },
    { name: "Raipur", state: "Chhattisgarh", lat: 21.2514, lng: 81.6296 },
  ];

  return Array.from({ length: count }, (_, i) => {
    const location =
      indianStates[Math.floor(Math.random() * indianStates.length)];
    return {
      id: `visitor-${i}`,
      cityName: location.name,
      countryName: "India",
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
        Math.random() * 255
      )}`,
      regionName: location.state,
      latitude: location.lat + (Math.random() - 0.5) * 0.5,
      longitude: location.lng + (Math.random() - 0.5) * 0.5,
      lastActive: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      browser: ["Chrome", "Firefox", "Safari"][Math.floor(Math.random() * 3)],
      device: ["Desktop", "Mobile", "Tablet"][Math.floor(Math.random() * 3)],
    };
  });
};

const StatsCard = ({ title, value, color, icon: Icon, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${color.bg}`}>
          <Icon className={`h-6 w-6 ${color.text}`} />
        </div>
        <div>
          <h3 className="text-gray-600 dark:text-gray-300 text-sm font-semibold mb-1">
            {title}
          </h3>
          <p className={`text-2xl font-bold ${color.text}`}>{value}</p>
        </div>
      </div>
      {trend && (
        <div
          className={`text-sm ${trend > 0 ? "text-green-500" : "text-red-500"}`}
        >
          {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </div>
      )}
    </div>
  </motion.div>
);

const MapComponent = ({ data }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});
  const centerRef = useRef([23.5937, 78.9629]); // Store the center position

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initMap = async () => {
        try {
          const L = await import("leaflet");

          if (!mapInstance.current && mapRef.current) {
            mapInstance.current = L.map(mapRef.current).setView(
              centerRef.current,
              5
            );

            L.tileLayer(
              "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
              {
                attribution: "©OpenStreetMap, ©CartoDB",
                maxZoom: 19,
                minZoom: 4,
              }
            ).addTo(mapInstance.current);

            const asiaBounds = L.latLngBounds(
              L.latLng(5, 65),
              L.latLng(40, 100)
            );

            mapInstance.current.setMaxBounds(asiaBounds);
            mapInstance.current.fitBounds(asiaBounds);

            // Store center position when user moves the map
            mapInstance.current.on("moveend", () => {
              centerRef.current = mapInstance.current.getCenter();
            });
          }

          // Clear existing markers
          Object.values(markersRef.current).forEach((marker) => {
            marker.remove();
          });
          markersRef.current = {};

          // Add new markers while maintaining the current center and zoom
          const currentCenter = mapInstance.current.getCenter();
          const currentZoom = mapInstance.current.getZoom();

          data.forEach((location) => {
            const marker = createColorfulMarker(L, location);
            markersRef.current[location.id] = marker;
            marker.addTo(mapInstance.current);
          });

          // Restore the previous center and zoom
          mapInstance.current.setView(currentCenter, currentZoom, {
            animate: false,
          });
        } catch (error) {
          console.error("Error initializing map:", error);
        }
      };

      initMap();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [data]);

  const getStateColor = (state) => {
    const colors = {
      Delhi: "#FF6B6B",
      Maharashtra: "#4ECDC4",
      Karnataka: "#45B7D1",
      "Tamil Nadu": "#96CEB4",
      "West Bengal": "#FFEEAD",
      Telangana: "#D4A5A5",
      Gujarat: "#9B5DE5",
      Rajasthan: "#F15BB5",
      "Uttar Pradesh": "#00BBF9",
      "Madhya Pradesh": "#00F5D4",
      Bihar: "#FEE440",
      Punjab: "#8338EC",
      Assam: "#FF006E",
      Chhattisgarh: "#FB5607",
      default: "#4361EE",
    };
    return colors[state] || colors.default;
  };

  const createColorfulMarker = (L, location) => {
    const markerColor = getStateColor(location.regionName);

    const customIcon = L.divIcon({
      className: "custom-div-icon",
      html: `
        <div class="marker-pin-container">
          <div class="marker-pin" style="background-color: ${markerColor}"></div>
          <div class="marker-pulse" style="background-color: ${markerColor}40"></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    return L.marker([location.latitude, location.longitude], {
      icon: customIcon,
    }).bindPopup(
      `
        <div class="p-4 bg-white rounded-lg shadow-lg">
          <h3 class="font-bold text-lg" style="color: ${markerColor}">
            ${location.cityName}, ${location.regionName}
          </h3>
          <div class="mt-2 space-y-1 text-gray-600">
            <p class="text-sm">Device: ${location.device}</p>
            <p class="text-sm">Browser: ${location.browser}</p>
            <p class="text-sm">Last Active: ${new Date(
              location.lastActive
            ).toLocaleTimeString()}</p>
          </div>
        </div>
      `,
      {
        className: "custom-popup",
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-lg mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Map className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Live Visitor Map - India
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="animate-pulse inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-sm text-gray-400">Live Updates</span>
        </div>
      </div>
      <div ref={mapRef} className="h-96 rounded-xl overflow-hidden" />
      <style jsx global>{`
        .marker-pin-container {
          position: relative;
          width: 30px;
          height: 30px;
        }
        .marker-pin {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        .marker-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </motion.div>
  );
};

const CommunitySection = ({ isLoading }) => {
  const communities = [
    {
      icon: MessageCircle,
      title: "Join Our Telegram Community",
      description:
        "Get instant updates, exclusive content, and connect with other members. Join our growing community of over 10,000 members!",
      link: "https://www.google.com/",
      buttonLabel: "Join Telegram",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      members: "10,000+",
      activity: "Very Active",
    },
    {
      icon: Share2,
      title: "WhatsApp Group",
      description:
        "Be part of our exclusive WhatsApp group for premium insights, daily updates, and direct interaction with our team.",
      link: "https://www.google.com/",
      buttonLabel: "Join WhatsApp",
      buttonColor: "bg-green-500 hover:bg-green-600",
      members: "5,000+",
      activity: "Active Daily",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
    >
      {communities.map((community, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-start space-x-4">
            <div
              className={`p-3 rounded-xl ${community.buttonColor
                .split(" ")[0]
                .replace("bg-", "bg-opacity-20")}`}
            >
              <community.icon
                className={`h-6 w-6 ${community.buttonColor
                  .split(" ")[0]
                  .replace("bg-", "text-")}`}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {community.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {community.description}
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {community.members}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {community.activity}
                  </span>
                </div>
              </div>
              <a
                href={community.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-white ${community.buttonColor} transition-colors duration-300`}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {community.buttonLabel}
                    <svg
                      className="ml-2 -mr-1 w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const HomePage = () => {
  const [visitorData, setVisitorData] = useState(generateVisitorData(8));
  const [isLoading] = useState(false);
  const { theme } = useThemeSelectorStore();
  const [isOpen, setIsopen] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorData((prevData) => {
        const newData = [...prevData];
        if (Math.random() > 0.5) {
          const index = Math.floor(Math.random() * newData.length);
          newData[index] = {
            ...generateVisitorData(1)[0],
            id: newData[index].id,
          };
        } else {
          newData.push(generateVisitorData(1)[0]);
          if (newData.length > 12) newData.shift();
        }
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statsConfig = [
    {
      title: "Total Visitors",
      value: visitorData.length,
      color: { text: "text-blue-600", bg: "bg-blue-100/50" },
      icon: Users,
      trend: 12.5,
    },
    {
      title: "Unique States",
      value: [...new Set(visitorData.map((item) => item.regionName))].length,
      color: { text: "text-purple-600", bg: "bg-purple-100/50" },
      icon: Globe,
      trend: 8.3,
    },
    {
      title: "Active Sessions",
      value: Math.floor(visitorData.length * 0.6),
      color: { text: "text-green-600", bg: "bg-green-100/50" },
      icon: Activity,
      trend: -2.1,
    },
    {
      title: "Latest Activity",
      value: visitorData[visitorData.length - 1]?.cityName || "N/A",
      color: { text: "text-pink-600", bg: "bg-pink-100/50" },
      icon: Sparkles,
      trend: 15.7,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative z-0" data-theme={theme}>
      <div className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-7xl mx-auto relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 tracking-tight mb-4">
              {HomePageConfig.title}
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {HomePageConfig.noticeText}
            </p>
          </motion.div>

          <div className="absolute right-10 top-10 z-20">
            <CustomThemes />
          </div>

          {/* Live Updates Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-blue-400/10 backdrop-blur-xl border border-blue-200/20 rounded-2xl p-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="animate-pulse inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-300">Live Updates</span>
                </div>
                <div className="h-4 w-px bg-gray-700"></div>
                <div className="text-gray-300">
                  Last update: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statsConfig.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Map Component */}
          <div className="relative z-0">
            <MapComponent data={visitorData} />
          </div>

          {/* Coming Soon */}
          <ComingSoonSection />

          {/* Review Modal */}
          {isOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
              <div className="relative bg-orange-400 rounded-xl p-6 shadow-lg w-full max-w-md overflow-hidden">
                <button
                  onClick={() => setIsopen(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                >
                  <CircleX size={20} className="w-6 h-6 text-orange-50" />
                </button>
                <ReviewForm />
              </div>
            </div>
          )}

          {/* Floating Review Button */}
          <motion.div
            className="fixed bottom-5 right-5 z-40 cursor-pointer flex items-center justify-center"
            onClick={() => setIsopen((prev) => !prev)}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              whileHover={{
                scale: 1.1,
                rotate: [0, 10, -10, 0],
                transition: { duration: 0.5, type: "spring" },
              }}
            >
              <MessageSquareQuoteIcon size={30} color="#ffffff" />
            </motion.div>
          </motion.div>

          {/* Footer Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center text-gray-400"
          >
            <p className="text-sm">
              © {new Date().getFullYear()} OneApp. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
