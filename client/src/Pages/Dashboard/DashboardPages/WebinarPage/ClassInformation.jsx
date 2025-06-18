import { motion } from "framer-motion";
import meetlogo from "../../../../../src/assets/meet.png";
import zoomlogo from "../../../../../src/assets/zoom.png";
import teamslogo from "../../../../../src/assets/teams.png";
import {
  Calendar,
  Clock,
  MapPin,
  Link2,
  Lock,
  Video,
  Ticket,
  Copy,
} from "lucide-react";
 
import { toast } from "react-hot-toast";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const cardVariants = {
  hover: {
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(251, 146, 60, 0.2)",
  },
};

const copyToClipboard = (text, message = "Copied to clipboard!") => {
  navigator.clipboard.writeText(text);
  toast.success(message);
};

 

const getPlatformIconFromLink = (link) => {
  if (!link) return <Video className="w-5 h-5 text-orange-500" />;
  const lowerLink = link.toLowerCase();
  if (lowerLink.includes("zoom.us"))
    return <img src={zoomlogo} alt="Zoom" className="w-5 h-5 object-contain" />;
  if (lowerLink.includes("meet.google.com"))
    return (
      <img
        src={meetlogo}
        alt="Google Meet"
        className="w-5 h-5 object-contain"
      />
    );
  if (lowerLink.includes("teams.microsoft.com"))
    return (
      <img src={teamslogo} alt="Teams" className="w-5 h-5 object-contain" />
    );
  return <Video className="w-5 h-5 text-orange-500" />;
};

const ClassInformation = ({ webinarData, isPurchased }) => (
  <motion.section
    className="mt-16"
    initial="hidden"
    animate="visible"
    variants={sectionVariants}
  >
    <h2 className="text-4xl font-bold text-orange-500 mb-8 text-center">
      Class Information
    </h2>

    <div className="p-4">
      <div
        className={`grid grid-cols-1 gap-6 ${
          isPurchased ? "md:grid-cols-4" : "md:grid-cols-3 justify-center"
        }`}
      >
        {/* Date & Time Card */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-orange-500/30 shadow-lg"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-full">
              <Calendar className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-orange-400">Date & Time</h3>
          </div>
          <div className="space-y-3 pl-2">
            <p className="text-gray-300 text-sm">
              <Clock className="inline-block w-4 h-4 mr-2 text-orange-400" />
              <span className="font-medium text-white">Starts: </span>
              {new Date(webinarData.startDate).toLocaleString("en-IN", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
            <p className="text-gray-300 text-sm">
              <Clock className="inline-block w-4 h-4 mr-2 text-orange-400" />
              <span className="font-medium text-white">Ends: </span>
              {new Date(webinarData.endDate).toLocaleString("en-IN", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
            {webinarData.occurrence && (
              <p className="text-gray-300 text-sm">
                <Calendar className="inline-block w-4 h-4 mr-2 text-orange-400" />
                <span className="font-medium text-white">Schedule: </span>
                {webinarData.occurrence}
              </p>
            )}
          </div>
        </motion.div>

        {/* Class Details */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-orange-500/30 shadow-lg"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-full">
              <Video className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-orange-400">Class Details</h3>
          </div>
          <div className="pl-2 space-y-2">
            <p className="text-gray-300 text-sm">
              <span className="text-white font-medium">Category: </span>
              {webinarData.category}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="text-white font-medium">Format: </span>
              {webinarData.isOnline ? "Online" : "In-Person"}
            </p>
        
          </div>
        </motion.div>

        {/* Ticket Info */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-orange-500/30 shadow-lg"
          variants={cardVariants}
          whileHover="hover"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-full">
              <Ticket className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-orange-400">Ticket Info</h3>
          </div>
          <div className="pl-2 space-y-2">
            <p className="text-gray-300 text-sm">
              <span className="text-white font-medium">Ticket Type:</span>{" "}
              {webinarData.isPaid ? "Paid" : "Free"}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="text-white font-medium">Price:</span>{" "}
              {webinarData.isPaid ? `₹${webinarData.amount}` : "₹0"}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="text-white font-medium">Event Type:</span>{" "}
              {webinarData.occurrence?.toLowerCase().includes("recurring")
                ? "Recurring"
                : "Single"}
            </p>
          </div>
        </motion.div>

        {/* Optional Meeting Info Card */}
        {isPurchased && (
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-orange-500/30 shadow-lg"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-full">
                <Link2 className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-orange-400">
                Meeting Info
              </h3>
            </div>

            <div className="space-y-3 pl-2 text-sm text-gray-300">
              {/* platformLink */}
              {webinarData.link?.platformLink && (
                <p className="flex items-center gap-2">
                  
                  <a
                    href={
                      webinarData.link.platformLink.startsWith("http")
                        ? webinarData.link.platformLink
                        : `https://${webinarData.link.platformLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-orange-300 flex items-center gap-1"
                  >
                    {getPlatformIconFromLink(webinarData.link.platformLink)}
                    {webinarData.link.platformLink}
                  </a>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        webinarData.link.platformLink,
                        "Platform link copied!"
                      )
                    }
                    className="hover:text-white"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </p>
              )}

              {/* meetingLink */}
              {webinarData.link?.meetingLink && (
                <p className="flex items-center gap-2">
                  <span className="text-white font-medium">Meeting Link:</span>
                  <a
                    href={webinarData.link.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-orange-300 flex items-center gap-1"
                  >
                    {getPlatformIconFromLink(webinarData.link.meetingLink)}
                    {webinarData.link.meetingLink}
                  </a>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        webinarData.link.meetingLink,
                        "Meeting link copied!"
                      )
                    }
                    className="hover:text-white"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </p>
              )}

              {/* meetingId */}
              {webinarData.link?.meetingId && (
                <p className="flex items-center gap-2">
                  <span className="text-white font-medium">Meeting ID:</span>
                  {webinarData.link.meetingId}
                  <button
                    onClick={() =>
                      copyToClipboard(
                        webinarData.link.meetingId,
                        "Meeting ID copied!"
                      )
                    }
                    className="hover:text-white"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </p>
              )}

              {/* meetingPassword */}
              {webinarData.link?.meetingPassword && (
                <p className="flex items-center gap-2">
                  <span className="text-white font-medium">Passcode:</span>
                  {webinarData.link.meetingPassword}
                  <button
                    onClick={() =>
                      copyToClipboard(
                        webinarData.link.meetingPassword,
                        "Passcode copied!"
                      )
                    }
                    className="hover:text-white"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  </motion.section>
);

export default ClassInformation;
