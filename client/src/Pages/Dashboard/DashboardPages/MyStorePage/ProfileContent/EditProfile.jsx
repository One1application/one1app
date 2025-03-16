// EditProfileModal.jsx
import React, { useState, useEffect } from "react";
import { Instagram, X } from "lucide-react";
import "./edit.css";
import SocialLinks from "./SocialLinks";
import { useStore } from "../../../../../context/StoreContext/StoreState";

const EditProfileModal = ({ isOpen, onClose, initialData, onSave, socials }) => {
  const { user } = useStore();
  const [formData, setFormData] = useState({
    username: "",
    tagline: "",
  });
  const [socialLinks, setSocialsLinks] = useState([]);


  useEffect(() => {
      setFormData({
        username: initialData?.username || "",
        tagline: initialData?.tagline || "",
      });
    setSocialsLinks([...socials])
    }, [initialData, socials]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Update profile details</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Username field */}
          <div className="form-field">
            <input
              type="text"
              value={formData?.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="Username"
              className="form-input"
            />
            <span className="character-count">
              {formData?.username?.length}/40
            </span>
          </div>

          {/* Tagline field */}
          <div className="form-field">
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange("tagline", e.target.value)}
              placeholder="Tagline"
              className="form-input"
            />
            <span className="character-count">
              {formData?.tagline?.length}/116
            </span>
          </div>

          {/* Social Links */}
          <SocialLinks socialLinks={socialLinks} setSocialsLinks={setSocialsLinks} />
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="save-button"
            onClick={() => {
              onSave({user:{...user,...formData}, socials: socialLinks}); 
              onClose(); 
            }}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;