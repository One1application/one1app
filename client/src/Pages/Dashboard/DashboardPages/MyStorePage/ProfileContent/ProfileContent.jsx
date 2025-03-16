/* eslint-disable react/prop-types */
// src/components/ProfileContent/ProfileContent.jsx
import { useState } from "react";
import {
  Phone,
  ChevronDown,
  Settings,
  MoreVertical,
  CameraIcon,
} from "lucide-react";
import EditProfileModal from "./EditProfile";
import AddProductModal from "../AddProduct/AddProduct";
import "./profile.css";

import { useStore } from "../../../../../context/StoreContext/StoreState";
import { socialLogos } from "../StoreConfig";

import AddHeader from "./AddHeader";
import AddLinks from "./AddLinks";
const ProfileContent = ({ onProfileUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const { user, setUser, socials, setSocials, header, setHeader, links } = useStore();
  console.log({ header })

  const handleProfileUpdate = (updatedData) => {
    setSocials(updatedData.socials)
    setUser(updatedData.user);
    setIsEditModalOpen(false);
    if (onProfileUpdate) {
      onProfileUpdate(updatedData);
    }
  };
  console.log(links);


  return (
    <>
      <div className="profile-card">
        {/* Follow Section */}
        <div className="follow-section">
          <button className="follow-button">
            <Settings size={16} />
            Follow
          </button>
        </div>

        {/* Profile Info */}
        <div className="profile-info">
          <div className="profile-user">
            <div>
              <img
                src={user?.image}
                className="user-profile-image shadow"
                alt="Profile"
              />
            </div>
            <label className="profile-photo-edit" onClick={() => { }}>
              <input type="file" accept="image/*" className="drop-zone__input" onChange={(e) => {
                setUser({ ...user, image: URL.createObjectURL(e.target.files[0]) })
              }} />
              <span className="shadow">
                <CameraIcon size={16} />
              </span>
            </label>
          </div>
          <h2 className="profile-name">{user.username}</h2>
          <p className="profile-tagline">{user.tagline}</p>

          <div className="social-links">
            {
              socials.map((social) =>
                social.enabled && (<><img className='social-logos' src={socialLogos[social.id]} alt="instagram" /></>
                )
              )
            }
          </div>
          <button
            className="edit-button"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit details
          </button>
        </div>

        {/* Contact Section */}
        {/* <div className="contact-section">
          <button className="contact-button">
            <div className="contact-left">
              <div className="contact-icon">
                <Phone size={16} color="white" />
              </div>
              <span>Contact me</span>
            </div>
            <MoreVertical size={16} className="more-icon" />
          </button>
          <button className="add-button">+ Add a button</button>
        </div> */}

        {/* Highlights Section */}
        <div className="highlights-section">
          <button className="highlights-header">
            <div className="highlights-title">
              <span className="star-icon">☆</span>
              <span>Highlights</span>
              <span className="info-icon">ⓘ</span>
            </div>
            <ChevronDown size={16} />
          </button>
        </div>
        <button
          className="add-product-button"
          onClick={() => setIsAddProductModalOpen(true)}
        >
          + Add Product
        </button>
        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => setIsAddProductModalOpen(false)}
        />

        <button className="add-header-button" onClick={() =>
          setHeader([
            { value: `Header ${header?.length ? header?.length + 1 : 1}`, enable: true },
            ...(header || []),
          ])
        }
        >+ Add Header</button>


        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={user}
          socials={socials}
          onSave={handleProfileUpdate}
        />
      </div>
      {header?.length > 0 && <div className="profile-card my-2">
        {header?.map((item, index) => <AddHeader key={index} item={item} index={index} />)}
      </div>}
      {links?.length > 0 && <div className="profile-card my-2">
        {links?.map((item, index) => <AddLinks key={index} item={item} index={index} />)}
      </div>}
    </>
  );
};

export default ProfileContent;