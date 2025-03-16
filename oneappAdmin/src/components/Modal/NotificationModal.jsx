/* eslint-disable react/prop-types */
import { useState } from 'react';
import { GoBell } from "react-icons/go";
import { AnimatePresence, motion } from 'framer-motion';

const NotificationService = {
  markAsRead: async (notificationIds) => {
    // Simulate an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Marked notifications ${notificationIds} as read`);
        resolve({
          success: true,
          message: `${notificationIds.length} notifications marked as read`
        });
      }, 500);
    });
  }
};

const NotificationModal = ({ notifications: initialNotifications }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleNotificationSelect = (index) => {
    setSelectedNotifications(prev => 
      prev.includes(index)
        ? prev.filter(id => id !== index)
        : [...prev, index]
    );
  };

  const handleMarkAsRead = async () => {
    if (selectedNotifications.length === 0) {
      // If no specific notifications selected, mark all as read
      setIsLoading(true);
      try {
        await NotificationService.markAsRead(
          notifications.map((_, index) => index)
        );
        setNotifications([]);
        setSelectedNotifications([]);
      } catch (error) {
        console.error("Failed to mark notifications as read", error);
      } finally {
        setIsLoading(false);
        toggleModal();
      }
    } else {
      // Mark selected notifications as read
      setIsLoading(true);
      try {
        await NotificationService.markAsRead(selectedNotifications);
        
        // Remove selected notifications
        setNotifications(prev => 
          prev.filter((_, index) => !selectedNotifications.includes(index))
        );
        setSelectedNotifications([]);
      } catch (error) {
        console.error("Failed to mark notifications as read", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <GoBell
          className="text-xl md:text-2xl text-gray-600 hover:text-gray-800 cursor-pointer transition-colors"
          aria-label="Notification Bell Icon"
          onClick={toggleModal}
        />
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
            {notifications.length}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center"
            onClick={toggleModal}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-[500px] max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <GoBell className="text-gray-600" />
                  Notifications
                  {selectedNotifications.length > 0 && (
                    <span className="ml-2 text-sm text-blue-600">
                      ({selectedNotifications.length} selected)
                    </span>
                  )}
                </h3>
                <button
                  onClick={toggleModal}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full p-2 transition-colors"
                >
                  ✖
                </button>
              </div>

              {/* Notifications List */}
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto flex-grow">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`px-6 py-4 hover:bg-gray-50 transition-colors group cursor-pointer 
                        ${selectedNotifications.includes(index) ? 'bg-blue-50' : ''}`}
                      onClick={() => handleNotificationSelect(index)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={selectedNotifications.includes(index)}
                          onChange={() => handleNotificationSelect(index)}
                          className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 flex-grow">
                  <p>No new notifications</p>
                </div>
              )}

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <button 
                    className={`text-sm font-medium px-4 py-2 rounded transition-colors 
                      ${selectedNotifications.length > 0 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-blue-200 text-blue-400 cursor-not-allowed'}`}
                    onClick={handleMarkAsRead}
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? 'Processing...' 
                      : (selectedNotifications.length > 0 
                          ? `Mark ${selectedNotifications.length} as Read` 
                          : 'Mark All as Read')}
                  </button>
                  {selectedNotifications.length > 0 && (
                    <button 
                      className="text-sm text-gray-600 hover:text-gray-800 ml-4"
                      onClick={() => setSelectedNotifications([])}
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationModal;