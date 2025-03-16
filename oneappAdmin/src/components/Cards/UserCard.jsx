/* eslint-disable react/prop-types */
import { Pencil, Eye, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UserCard = ({ user, onView, onEdit, onDelete }) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const renderAvatar = () => {
    if (user.image) {
      return (
        <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
          <img 
            src={user.image} 
            alt={user.creatorName} 
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    const initials = user.creatorName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="w-24 h-24 rounded-full bg-orange-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
        {initials}
      </div>
    );
  };

  const renderKycBadge = () => {
    const statusColors = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const color = statusColors[user.kycStatus?.toLowerCase()] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${color}`}>
        {user.kycStatus || 'Unknown'}
      </span>
    );
  };

  const renderActiveBadge = () => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
    };

    const color =
      statusColors[user.status?.toLowerCase()] || "bg-gray-100 text-gray-800";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${color}`}
      >
        {user.status || "Unknown"}
      </span>
    );
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 max-w-sm">
      <button 
        onClick={() => setIsOptionsOpen(!isOptionsOpen)}
        className="absolute top-4 right-4 z-10 text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
      >
        <MoreVertical size={20} />
      </button>

      <AnimatePresence>
        {isOptionsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-14 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden"
          >
            <div className="py-1">
              {[
                { 
                  icon: <Eye size={16} className="text-orange-500" />, 
                  label: 'View Details', 
                  onClick: () => {
                    onView();
                    setIsOptionsOpen(false);
                  }
                },
                { 
                  icon: <Pencil size={16} className="text-green-500" />, 
                  label: 'Edit', 
                  onClick: () => {
                    onEdit();
                    setIsOptionsOpen(false);
                  }
                },
                { 
                  icon: <Trash2 size={16} className="text-red-500" />, 
                  label: 'Delete', 
                  onClick: () => {
                    onDelete();
                    setIsOptionsOpen(false);
                  }
                }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {action.icon}
                  <span className="ml-3">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 text-center">
        <div className="mb-4 flex justify-center">
          {renderAvatar()}
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex justify-center mt-2">{renderKycBadge()}</div>
            <div className="flex justify-center mt-2">
              {renderActiveBadge()}
            </div>
          </div>

        <h2 className="text-xl font-bold text-gray-800 mb-1">{user.creatorName}</h2>
        
        {user.email && (
          <p className="text-gray-600 mb-1 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            {user.email}
          </p>
        )}
        
        {user.mobileNumber && (
          <p className="text-gray-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {user.mobileNumber}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserCard;