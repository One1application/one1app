/* eslint-disable react/prop-types */
// src/components/MobilePreview/MobilePreview.jsx
import { useState } from "react";
import { Instagram, Share2, Copy, LinkIcon } from "lucide-react";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import "./MobilePreview.css";
import { socialLogos } from "../StoreConfig";
import { useStore } from "../../../../../context/StoreContext/StoreState";
const ASTRONAUT_IMAGE =
  "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Astronaut.png";

const PreviewSection = ({ profile, theme }) => {

  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleCopyUrl = () => {
    const url = "one1link.bio/manish";
    navigator.clipboard.writeText(url).then(() => {
      setShowSnackbar(true);
    });
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <div className="preview-section">
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <MobilePreview
        profile={profile}
        theme={theme}
        onCopyUrl={handleCopyUrl}
      />
    </div>
  );
};

const MobilePreview = ({ profile, theme, onCopyUrl }) => {
  const { header, links } = useStore();

  console.log({ links })
  return (
    <div className="mobile-frame">
      <div
        className="mobile-preview"
        style={{
          background: theme?.previewBg || "#E7F7E8",
        }}
      >
        <button className="preview-share-button" onClick={onCopyUrl}>
          <Share2 size={16} />
        </button>

        <div className="preview-content">
          <div className="preview-avatar">
            <img
              src={profile.user.image}
              alt="Profile"
              className="preview-avatar-image"
            />
          </div>
          <h3 className="preview-name">{profile.user.username}</h3>
          <p className="preview-tagline">{profile.user.tagline}</p>

          {/* <button className="preview-contact">Contact me</button> */}

          <div className="social-links">
            {
              profile.socials.map((social) =>
                social.enabled && (<><img className='social-logos' src={socialLogos[social.id]} alt="instagram" /></>
                )
              )
            }
          </div>

          {header?.length > 0 && header?.map((item, index) =>
            item.enable ? <div key={index} className="manual-header">
              <p>{item.value}</p>
            </div> : <></>
          )}

          {links?.length > 0 && links?.map((item, index) =>
            item?.enabled ? <div key={index} className="product-links">
              <LinkIcon size={12} className="mr-2" />
              <a href={item.url} target="_blank">{item.title}</a>
            </div> :
              <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewSection;