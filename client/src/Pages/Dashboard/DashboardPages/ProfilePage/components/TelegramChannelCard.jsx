import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  Users,
  Link as LinkIcon,
  Clock,
  Loader2,
} from "lucide-react";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import { useState } from "react";
import useTelegramStore from "../../../../../Zustand/Apicalls.js";

const TelegramChannelCard = ({ data, onDeleteSuccess, onEditClick }) => {
  const [loading, setLoading] = useState(false);
  const { deleteChannel } = useTelegramStore();

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("ID is required");
      return;
    }

    setLoading(true);
    try {
      const res = await deleteChannel(id);
      if (res.success) {
        
        onDeleteSuccess();
      }
    } catch (error) {
       
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-gray-900 rounded-xl border mt-5 border-gray-800 p-4 w-full max-w-md relative"
    >
      {/* Time Badge */}
      <div className="absolute top-4 right-5 bg-orange-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>{format(data?.createdAt)}</span>
      </div>

      {/* Header with Image and Info */}
      <div className="flex items-start gap-4">
        {/* Channel Image - Larger Size */}
        <div className="w-16 h-16 rounded-full border-2 border-orange-500 overflow-hidden bg-gray-800 flex-shrink-0">
          {data?.channelImage ? (
            <img
              src={data.channelImage}
              alt={data.channelName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <Users className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Channel Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">
            {data?.channelName}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            <Users className="w-4 h-4" />
            <span>{data?.subscribers?.toLocaleString() || 0} subscribers</span>
          </div>
        </div>
      </div>

      {/* Channel Link */}
      <div className="mt-3 flex items-center gap-2 text-sm text-orange-400 truncate">
        <LinkIcon className="w-4 h-4 flex-shrink-0" />
        <a
          href={data?.channelLink}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate hover:underline"
          title={data?.channelLink}
        >
          {data?.channelLink?.replace("https://", "")}
        </a>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end gap-3 border-t border-gray-800 pt-3">
        <button
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
          onClick={() => onEditClick(data)}
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit</span>
        </button>

        <button
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-900/60 hover:bg-red-800/60 rounded-lg text-white transition-colors"
          onClick={() => handleDelete(data.id)}  
          disabled={loading}
        >
          <Trash2 className="w-4 h-4" />
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Delete"}
        </button>
      </div>
    </motion.div>
  );
};

export default TelegramChannelCard;
