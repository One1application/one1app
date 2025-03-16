// AppearanceContent.jsx
import React from "react";
import "./appreance.css";

const AppearanceContent = ({ currentTheme, onThemeSelect }) => {
  const themes = [
    {
      id: "custom",
      name: "Custom",
      type: "custom",
      previewBg: "#F8FAFC",
    },
    {
      id: "dark",
      name: "Dark",
      previewBg: "#000000",
      lineColor: "#374151",
    },
    {
      id: "white-wisdom",
      name: "White-Wisdom",
      previewBg: "#FFFFFF",
      lineColor: "#E5E7EB",
    },
    {
      id: "pastel-green",
      name: "Pastel-green",
      previewBg: "#E7F7E8",
      lineColor: "#FFFFFF",
    },
    {
      id: "pastel-orange",
      name: "Pastel-orange",
      previewBg: "#FFF7ED",
      lineColor: "#FFFFFF",
    },
    {
      id: "white-cosmo-pink",
      name: "White-Cosmo pink",
      previewBg: "#FFFFFF",
      lineColor: "#EC4899",
    },
    {
      id: "white-charcoal",
      name: "White-Charcoal",
      previewBg: "#FFFFFF",
      lineColor: "#111827",
    },
    {
      id: "pastel-red",
      name: "Pastel-red",
      previewBg: "#FEF2F2",
      lineColor: "#FFFFFF",
    },
    {
      id: "pastel-blue",
      name: "Pastel-blue",
      previewBg: "#F0F9FF",
      lineColor: "#FFFFFF",
    },
    {
      id: "white-green",
      name: "White-Green",
      previewBg: "#FFFFFF",
      lineColor: "#22C55E",
    },
    {
      id: "yellow-multi",
      name: "Yellow-Multi",
      previewBg: "#FEF9C3",
      lineColors: ["#FCA5A5", "#F9A8D4", "#93C5FD"],
    },
    {
      id: "custom-profile",
      name: "Custom Profile",
      previewBg: "#FFFFFF",
      lineColor: "#E5E7EB",
      showAvatar: true,
    },
  ];

  return (
    <div className="appearance-container">
      <h2 className="theme-title">Themes</h2>

      <div className="themes-grid">
        {themes.map((theme) => (
          <button
            key={theme.id}
            className={`theme-card ${
              currentTheme?.id === theme.id ? "active" : ""
            }`}
            onClick={() => onThemeSelect(theme)}
            style={{
              background: theme.previewBg,
              borderStyle: theme.type === "custom" ? "dashed" : "solid",
            }}
          >
            {theme.type === "custom" ? (
              <div className="create-theme">
                <span>CREATE</span>
                <span>YOUR OWN</span>
              </div>
            ) : theme.lineColors ? (
              <div className="theme-preview">
                {theme.lineColors.map((color, index) => (
                  <div
                    key={index}
                    className="preview-line"
                    style={{ background: color }}
                  />
                ))}
              </div>
            ) : (
              <div className="theme-preview">
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="preview-line"
                      style={{ background: theme.lineColor }}
                    />
                  ))}
              </div>
            )}
            <span className="theme-name">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AppearanceContent;
