import React, { useState } from "react";
import "./header.css";
import { Button, Snackbar } from "@mui/material";
import { Copy } from "lucide-react";
import ShareIcon from '@mui/icons-material/Share';
import LanguageIcon from '@mui/icons-material/Language';

const Header = ({ activeTab, setActiveTab }) => {
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

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "appearance", label: "Appearance" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="header-container">
      <div className="header-content">
        <nav className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <nav className="link-section">
        <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Copied to clipboard!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <div className="preview-header">
            <div className="profile-url">
              <LanguageIcon/>
              <p>
          one1link.bio/manish
              </p>
          <button className="copy-button" onClick={handleCopyUrl}>
            <Copy size={16} />
          </button>
            </div>
            
            <Button
              component="label"
              role={undefined}
              tabIndex={-1}
              startIcon={<ShareIcon fontSize={"16px"} />}
              className="share-button"
              sx={{
                backgroundColor: "#16a34a",
                padding: "6px 12px",
                color: "white",
                borderRadius: "18px"
              }}
            >
              Share
            </Button>
            {/* <button className="share-button">
              Share</button> */}
      </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;