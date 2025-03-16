import { useState } from "react";
import Header from "./Header/Header";
import PreviewSection from "./MobilePreview/MobilePreview";
import ProfileContent from "./ProfileContent/ProfileContent";
import AppearanceContent from "./Appreance/AppreanceContent";
import AnalyticsDashboard from "./Analytics/analytics";
import SettingsPage from "./Settings/settings";
import { siteConfig } from "./StoreConfig";
import "./store.css";
import { useStore } from "../../../../context/StoreContext/StoreState";

const MyStore = () => {
  const { socials, user } = useStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [currentTheme, setCurrentTheme] = useState(siteConfig.themes[3]);
  const shouldShowPreview = !['analytics', 'settings'].includes(activeTab);

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className={`main-content ${!shouldShowPreview ? 'full-width' : ''}`}>
        <div className={`content-area ${!shouldShowPreview ? 'no-preview' : ''}`}>
          {activeTab === "profile" ? (
            <ProfileContent />
          ) : activeTab === "appearance" ? (
            <AppearanceContent
              currentTheme={currentTheme}
              onThemeSelect={setCurrentTheme}
            />
          ) : activeTab === "analytics" ? (
            <AnalyticsDashboard />
          ) : activeTab === "settings" ? (
            <SettingsPage />
          ) : (
            <div className="coming-soon">
              {activeTab} content coming soon...
            </div>
          )}
        </div>

        {shouldShowPreview && (
          <PreviewSection theme={currentTheme} profile={{user, socials}} />
        )}
      </main>

      {/* <button className="checklist-button">Your checklist</button> */}
    </div>
  );
};

export default MyStore;