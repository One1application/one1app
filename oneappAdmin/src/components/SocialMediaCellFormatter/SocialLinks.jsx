/* eslint-disable react/prop-types */
import { 
    FaFacebook, 
    FaInstagram, 
    FaLinkedin, 
    FaTwitter, 
    FaGithub,
    FaYoutube,
  } from 'react-icons/fa';
  import { FaLink } from "react-icons/fa";
  
  const socialIcons = {
    facebook: FaFacebook,
    instagram: FaInstagram,
    linkedin: FaLinkedin,
    twitter: FaTwitter,
    github: FaGithub,
    youtube: FaYoutube,
    link: FaLink
  };
  
  const SocialLinks = ({ links }) => {
    if (!Array.isArray(links)) return null;
  
    return (
      <div className="flex gap-2">
        {links.map((social, index) => {
          const Icon = socialIcons[social.platform.toLowerCase()];
          
          if (!Icon) return null;
  
          return (
            <a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-orange-600 transition-colors "
              title={`Visit ${social.platform}`}
            >
              <Icon size={20} />
            </a>
          );
        })}
      </div>
    );
  };
  
  export default SocialLinks;