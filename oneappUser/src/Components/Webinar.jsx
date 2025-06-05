import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import googlemeet from "../assets/meet.png";
import zoom from "../assets/zoom.png";
import {
  ExternalLink,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  Tag,
  Play,
  MonitorPlay,
  Users,
  Timer,
  Copy,
  Check,
  Video,
} from "lucide-react";
import { getPurchasedWebibnar } from "../Apicalls/productsPurchased";

const Webinar = () => {
  const [webinarDetails, setWebinarDetails] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copiedItems, setCopiedItems] = useState({});

  useEffect(() => {
    const fetchWebinars = async () => {
      const response = await getPurchasedWebibnar();
      setWebinarDetails(response?.data || []);
    };
    fetchWebinars();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getWebinarStatus = (startDate, endDate) => {
    if (!startDate || !endDate)
      return { status: "unknown", text: "Date not set" };

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = currentTime.getTime();

    if (now > end) {
      return { status: "closed", text: "Event Closed", isLive: false };
    } else if (now >= start && now <= end) {
      return { status: "live", text: "Live", isLive: true };
    } else {
      const timeUntilStart = start - now;
      if (timeUntilStart <= 2 * 60 * 60 * 1000) {
        const hours = Math.floor((timeUntilStart / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((timeUntilStart / 1000 / 60) % 60);
        const secs = Math.floor((timeUntilStart / 1000) % 60);
        return {
          status: "countdown",
          text: `${hours}h ${mins}m ${secs}s`,
          isLive: false,
        };
      } else {
        return { status: "upcoming", text: "Upcoming", isLive: false };
      }
    }
  };

  console.log(webinarDetails);
  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400";
      case "countdown":
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400";
      case "upcoming":
        return "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400";
      case "closed":
        return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-400";
      default:
        return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-400";
    }
  };

  const getButtonStyle = (status, isLive) => {
    if (status === "closed") {
      return "bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-600/30";
    } else if (isLive) {
      return "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/25";
    } else {
      return "bg-gradient-to-r from-blue-600/50 to-indigo-600/50 text-blue-300 cursor-not-allowed border border-blue-500/30";
    }
  };

  const getPlatformInfo = (link) => {
    if (!link) return { platform: "unknown", icon: Video };

    if (link.platformLink) {
      if (link.platformLink.includes("meet.google.com")) {
        return {
          platform: "google-meet",
          icon: () => (
            <img src={googlemeet} alt="meeticon" className="w-6 h-6" />
          ),
        };
      }
      return { platform: "other", icon: Video };
    } else if (link.meetingId || link.meetingPassword || link.meetingLink) {
      return {
        platform: "zoom",
        icon: () => <img src={zoom} alt="zoom" className="w-6 h-6" />,
      };
    }
    return { platform: "unknown", icon: Video };
  };

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedItems((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
          <MonitorPlay className="text-green-400" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Your Webinars</h2>
          <p className="text-gray-400 text-sm">Manage your live sessions</p>
        </div>
      </motion.div>

      {/* Webinars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {webinarDetails?.map((webinar, index) => {
          const startDate = webinar?.webinar?.startDate;
          const endDate = webinar?.webinar?.endDate;
          const { status, text, isLive } = getWebinarStatus(startDate, endDate);
          const { platform, icon: PlatformIcon } = getPlatformInfo(
            webinar?.webinar?.link
          );

          const formattedDate = startDate
            ? new Date(startDate).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "TBD";

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50 overflow-hidden hover:border-green-500/30 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={webinar?.webinar?.coverImage}
                  alt={webinar?.webinar?.title || "Webinar"}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm border ${getStatusColor(
                      status
                    )}`}
                  >
                    {status === "upcoming" || status === "countdown" ? (
                      <Timer size={12} />
                    ) : status === "live" ? (
                      <Play size={12} className="animate-pulse" />
                    ) : (
                      <CheckCircle size={12} />
                    )}
                    {text}
                  </motion.div>
                </div>

                {/* Live Indicator */}
                {isLive && (
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-500/90 rounded-full text-xs text-white font-medium backdrop-blur-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Meta Information */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5">
                    <Tag size={14} className="text-green-400" />
                    <span className="text-xs text-gray-400">
                      {webinar?.webinar?.category || "General"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={14} />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {/* Title and Description */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`p-1.5 rounded-md ${
                        platform === "google-meet"
                          ? "bg-blue-500/20 text-blue-400"
                          : platform === "zoom"
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      <PlatformIcon />
                    </div>
                    <h3 className="font-semibold text-white line-clamp-2 leading-snug flex-1">
                      {webinar?.webinar?.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                    {webinar?.description}
                  </p>
                </div>

                {/* Meeting Credentials */}
                {webinar?.webinar?.link &&
                  (webinar.webinar.link.meetingId ||
                    webinar.webinar.link.meetingPassword) && (
                    <div className="space-y-2 bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                      {webinar.webinar.link.meetingId && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Meeting ID:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white font-mono">
                              {webinar.webinar.link.meetingId}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  webinar.webinar.link.meetingId,
                                  `meetingId-${index}`
                                )
                              }
                              className="p-1 hover:bg-gray-600/50 rounded transition-colors"
                            >
                              {copiedItems[`meetingId-${index}`] ? (
                                <Check size={12} className="text-green-400" />
                              ) : (
                                <Copy size={12} className="text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                      {webinar.webinar.link.meetingPassword && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Password:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white font-mono">
                              {webinar.webinar.link.meetingPassword}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  webinar.webinar.link.meetingPassword,
                                  `meetingPassword-${index}`
                                )
                              }
                              className="p-1 hover:bg-gray-600/50 rounded transition-colors"
                            >
                              {copiedItems[`meetingPassword-${index}`] ? (
                                <Check size={12} className="text-green-400" />
                              ) : (
                                <Copy size={12} className="text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {/* Action Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${getButtonStyle(
                    status,
                    isLive
                  )}`}
                  onClick={
                    isLive && webinar?.webinar?.link
                      ? () => {
                          const link = webinar.webinar.link;
                          const finalLink =
                            link.platformLink || link.meetingLink;

                          if (finalLink) {
                            const isAbsolute =
                              finalLink.startsWith("http://") ||
                              finalLink.startsWith("https://");
                            const fullUrl = isAbsolute
                              ? finalLink
                              : `https://${finalLink}`;

                            window.open(
                              fullUrl,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }
                        }
                      : undefined
                  }
                  disabled={
                    !isLive ||
                    (!webinar?.webinar?.link?.platformLink &&
                      !webinar?.webinar?.link?.meetingLink)
                  }
                >
                  {status === "closed" ? (
                    <>
                      <CheckCircle size={16} />
                      Event Closed
                    </>
                  ) : isLive ? (
                    <>
                      <ExternalLink size={16} />
                      Join Live Session
                    </>
                  ) : (
                    <>
                      <Clock size={16} />
                      {status === "countdown" ? "Starting Soon" : "Upcoming"}
                    </>
                  )}
                </motion.button>

                {/* Additional Info */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users size={12} />
                    <span>Webinar Session</span>
                  </div>
                  <div className="text-xs text-green-400 font-medium">
                    Purchased
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {webinarDetails.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 px-6"
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center border border-green-500/30">
              <BookOpen className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              No webinars purchased yet
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Explore our webinar collection to join live sessions and expand
              your knowledge
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/25"
            >
              Browse Webinars
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Webinar;
