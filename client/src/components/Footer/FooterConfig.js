import {
  faYoutube,
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faPinterest,
} from '@fortawesome/free-brands-svg-icons';

const footerConfig = {
  brand: {
    name: "OneApp",
    tagline: "Made with ❤️ in Bharat",
    logo: "/path/to/logo.png",
  },
  sections: [
    {
      title: "PRODUCT",
      links: [
        { label: "PlugIn", url: "/plugins" },
        { label: "Premium content", url: "#" },
        { label: "PayingUp", url: "#" },
      ],
    },
    {
      title: "",
      links: [
        { label: "Analysis", url: "#" },
        { label: "Telegram", url: "#" },
        { label: "Automation", url: "#" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { label: "About Us", url: "/about-us" },
        { label: "Privacy", url: "#" },
        { label: "Hiring", url: "#" },
      ],
    },
    {
      title: "SUPPORT",
      links: [
        { label: "support@one1app.com", url: "#" },
      ],
    },
  ],
  footerBottom: {
    text: "© 2025 CONTIKS ONE HUB TECHNOLOGY PRIVATE LIMITED, Inc. All rights reserved.",
    policies: [
      { label: "Terms", url: "#" },
      { label: "Privacy", url: "#" },
      { label: "Contact", url: "#" },
    ],
    socialIcons: [
      { name: "YouTube", icon: faYoutube, url: "https://www.youtube.com/@OneApp8" },
      { name: "Facebook", icon: faFacebook, url: "https://www.facebook.com" },
      { name: "Pinterest", icon: faPinterest, url: "https://in.pinterest.com/one1app/" },
      { name: "Twitter", icon: faTwitter, url: "https://www.twitter.com" },
      { name: "Instagram", icon: faInstagram, url: "https://www.instagram.com/one_1app/" },
      { name: "LinkedIn", icon: faLinkedin, url: "https://www.linkedin.com/company/one1app/" },
    ],
  },
};

export default footerConfig;