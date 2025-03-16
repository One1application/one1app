import { useState } from 'react';
import { 
  Twitter, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitch,
  MessageCircle,
  Mail,
  Share2,
  Globe,
  Music,
  Camera
} from 'lucide-react';
import animation from '../../../assets/animation.json';
import { Player } from '@lottiefiles/react-lottie-player';

const Animation = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Inner circle icons
  const innerIcons = [
    { Icon: Twitter, color: "text-blue-400", glow: "shadow-blue-500/50" },
    { Icon: Instagram, color: "text-pink-500", glow: "shadow-pink-500/50" },
    { Icon: Facebook, color: "text-blue-600", glow: "shadow-blue-600/50" },
    { Icon: Youtube, color: "text-red-500", glow: "shadow-red-500/50" },
    { Icon: Music, color: "text-purple-500", glow: "shadow-purple-500/50" }
  ];

  // Outer circle icons
  const outerIcons = [
    { Icon: Mail, color: "text-orange-500", glow: "shadow-orange-500/50" },
    { Icon: Globe, color: "text-emerald-500", glow: "shadow-emerald-500/50" },
    { Icon: Share2, color: "text-yellow-500", glow: "shadow-yellow-500/50" },
    { Icon: MessageCircle, color: "text-cyan-500", glow: "shadow-cyan-500/50" },
    { Icon: Camera, color: "text-pink-400", glow: "shadow-pink-400/50" },
    { Icon: Twitch, color: "text-purple-400", glow: "shadow-purple-400/50" }
  ];

  const renderCircle = (icons, radius, rotationTime, size) => (
    <div 
      className="absolute w-full h-full"
      style={{
        animation: `spin ${rotationTime}s linear infinite${size === 'outer' ? ' reverse' : ''}`
      }}
    >
      {icons.map((social, index) => {
        const angle = (index * 360) / icons.length;
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;
        
        return (
          <div
            key={index}
            className="absolute"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: `translate(-50%, -50%) rotate(-${angle}deg)`,
            }}
            onMouseEnter={() => setHoveredIndex(`${size}-${index}`)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              className={`
                group p-3 rounded-full transition-all duration-300
                bg-black/80 border border-gray-800
                ${hoveredIndex === `${size}-${index}` ? 'scale-125 ' + social.glow : 'scale-100'}
                hover:border-gray-700
              `}
            >
              <social.Icon 
                size={28}
                className={`
                  ${social.color}
                  transition-all duration-300
                  group-hover:animate-pulse
                `}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      {/* Center Icon */}
      <div className="absolute z-20">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/50 to-purple-500/50 rounded-full blur-xl opacity-50 group-hover:opacity-100 animate-pulse" />
          <div className="relative p-4 group-hover:border-orange-500/50 transition-all duration-500">
            <Player
              autoplay
              loop
              src={animation}
              className="w-24 h-24"
            />
          </div>
        </div>
      </div>

      {/* Inner Circle */}
      {renderCircle(innerIcons, 90, 20, 'inner')}

      {/* Outer Circle */}
      {renderCircle(outerIcons, 160, 25, 'outer')}

      {/* Decorative Rings */}
      <div className="absolute w-48 h-48 rounded-full border border-orange-600/10" />
      <div className="absolute w-80 h-80 rounded-full border border-purple-500/10" />

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-orange-500/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

export default Animation;
