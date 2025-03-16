import instagramImage from "../../../../assets/instagramImage.svg";
import emailImage from "../../../../assets/emailIcon.svg";
import facebookImage from "../../../../assets/facebook.svg";
import youtubeImage from "../../../../assets/youtube.svg";

// src/config/siteConfig.js

export const siteConfig = {
  tabs: [
    { id: "profile", label: "Profile" },
    { id: "appearance", label: "Appearance" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" },
  ],
  profile: {
    username: "Manish",
    tagline: "Manish is here",
    profileUrl: "one1link.bio/manish",
    avatarImage: "/api/placeholder/80/80",
    socials: [
      {
        platform: "instagram",
        url: "https://instagram.com/username",
      },
    ],
  },
  themes: [
    {
      id: "custom",
      name: "Custom",
      type: "custom",
      previewBg: "#F8FAFC",
      border: "dashed",
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
      id: "yellow-multi",
      name: "Yellow-Multi",
      previewBg: "#FEF9C3",
      lineColors: ["#FCA5A5", "#F9A8D4", "#93C5FD"],
    },
  ],
};

export const socialLogos = {
  1: instagramImage,
  2: facebookImage,
  3: emailImage,
  4: youtubeImage,
};
