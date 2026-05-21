import React from 'react';
import { motion } from 'motion/react';

export const CinematicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#fbfbfa] dark:bg-[#030303] overflow-hidden transition-colors duration-500">
      {/* Immersive Animated Gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.25, 0.1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-20%] w-[120%] aspect-square bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.15),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)] blur-[100px]"
      />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(197,168,128,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_50%)]" />

      {/* Dynamic Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.25, 0.12],
          x: [-50, 50, -50],
          y: [-50, 50, -50]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[60%] aspect-square bg-[#c5a880]/10 dark:bg-primary/5 blur-[150px] rounded-full"
      />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      
      {/* Scanlines / Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.04)_50%),linear-gradient(90deg,rgba(197,168,128,0.02),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] dark:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
    </div>
  );
};
