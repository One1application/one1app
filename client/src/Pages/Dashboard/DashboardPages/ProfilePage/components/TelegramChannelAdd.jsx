import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Link,
  Users,
  Image as ImageIcon,
  PlusCircle,
  X,
  Loader2,
  Edit2,
} from "lucide-react";
import toast from "react-hot-toast";
import useTelegramStore from "../../../../../Zustand/Apicalls.js";
import TelegramChannelCard from "./TelegramChannelCard.jsx";

const TelegramChannelAdd = () => {
  const [channelName, setChannelName] = useState("");
  const [channelLink, setChannelLink] = useState("");
  const [userCount, setUserCount] = useState("");
  const [channelImage, setChannelImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentChannelId, setCurrentChannelId] = useState(null);

  // Destructure Zustand store methods and state
  const {
    channelData,
    loading,
    fetchTelegramChannel,
    createChannel,
    updateChannel,
  } = useTelegramStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChannelImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setChannelImage(null);
    setPreviewImage(null);
  };

  useEffect(() => {
    fetchTelegramChannel();
  }, [fetchTelegramChannel]);

  function validTelegramLink(link) {
    const regex = /https?:\/\/t\.me\/\w+/;
    return regex.test(link);
  }

  const resetForm = () => {
    setChannelName("");
    setChannelLink("");
    setUserCount("");
    setChannelImage(null);
    setPreviewImage(null);
    setIsEditing(false);
    setCurrentChannelId(null);
  };

  const handleEditClick = (channelData) => {
    setIsEditing(true);
    setCurrentChannelId(channelData.id);  
    setChannelName(channelData.channelName);
    setChannelLink(channelData.channelLink);
    setUserCount(channelData.subscribers);
    setPreviewImage(channelData.channelImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validTelegramLink(channelLink)) {
      toast.error("Invalid Telegram Link");
      return;
    }

    if (userCount <= 0) {
      toast.error("Invalid User Count");
      return;
    }

    const formData = new FormData();
    formData.append("channelName", channelName);
    formData.append("channelLink", channelLink);
    formData.append("subscribers", userCount);
    if (channelImage) {
      formData.append("file", channelImage);
    }

    try {
      if (isEditing) {
        await updateChannel(currentChannelId, formData);
       
      } else {
        await createChannel(formData);
     
      }
      resetForm();
    } catch (error) {
      console.error("Error:", error);
    
    }
  };

  const handleDeleteSuccess = () => {
    fetchTelegramChannel();
    resetForm();
  };

  return (
    <div className="min-h-screen  bg-gray-950 text-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-gray-900  rounded-xl shadow-2xl overflow-hidden p-8">
          <div className="flex items-start gap-8">
            {/* Left Column - Image Upload */}
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Channel Image
              </label>
              <div className="flex items-center justify-center">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Channel preview"
                      className="w-32 h-32 rounded-full object-cover border-2 border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="w-32 h-32 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-orange-500 transition-colors">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                        <span className="text-xs text-gray-400 mt-1">
                          Upload
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>

              <div className="mt-6 p-4 bg-gray-800/50 border-l-4 border-orange-500 rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg
                      className="w-5 h-5 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-orange-500">
                      Public Channel
                    </h3>
                    <div className="mt-1 text-sm text-gray-300">
                      <p>
                        This channel will be visible to all users so they can
                        discover and join it. Make sure you only share public
                        Telegram channels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="w-2/3">
              <div className="text-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-block"
                >
                  <Send className="w-12 h-12 mx-auto text-orange-500" />
                </motion.div>
                <h2 className="text-2xl font-bold mt-4">
                  {isEditing ? "Edit Telegram Channel" : "Add Telegram Channel"}
                </h2>
                <p className="text-gray-400 mt-2">
                  {isEditing
                    ? "Update your channel details"
                    : "Fill your channel details"}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Channel Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Channel Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Send className="w-5 h-5 text-orange-500" />
                    </div>
                    <input
                      type="text"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 p-2.5"
                      placeholder="My Awesome Channel"
                      required
                    />
                  </div>
                </div>

                {/* Channel Link */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Channel Link
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="w-5 h-5 text-orange-500" />
                    </div>
                    <input
                      type="url"
                      value={channelLink}
                      onChange={(e) => setChannelLink(e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 p-2.5"
                      placeholder="https://t.me/yourchannel"
                      required
                    />
                  </div>
                </div>

                {/* User Count */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Users
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="w-5 h-5 text-orange-500" />
                    </div>
                    <input
                      type="number"
                      value={userCount}
                      onChange={(e) => setUserCount(e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 p-2.5"
                      placeholder="10000"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-1/3 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 px-5 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className={`flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center transition-colors`}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                      <>
                        {isEditing ? (
                          <>
                            <Edit2 className="w-5 h-5 mr-2" />
                            Update Channel
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Add Channel
                          </>
                        )}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {channelData && (
          <TelegramChannelCard
            data={channelData}
            onDeleteSuccess={handleDeleteSuccess}
            onEditClick={handleEditClick}
          />
        )}
      </motion.div>
    </div>
  );
};

export default TelegramChannelAdd;
