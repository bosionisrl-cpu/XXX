import React, { useEffect, useRef, useState } from 'react';
import { Topbar } from './Topbar';
import { Language } from '../../../../types';
import { CinematicBackground } from '../design-system/CinematicBackground';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';

import { FashionAssistant } from '../components/assistant/FashionAssistant';

interface FashionOSLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
  viewMode: 'aesthetics' | 'operations';
  onViewModeChange: (mode: 'aesthetics' | 'operations') => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

const NAV_DOTS = [
  { id: 'home', label: 'ENTRY' },
  { id: 'trends', label: 'TREND STREAM' },
  { id: 'design', label: 'CONCEPT STREAM' },
  { id: 'collection', label: 'GARMENT STREAM' },
  { id: 'try-on', label: 'HUMAN STREAM' },
  { id: 'media-vault', label: 'IMMICH VAULT' }
];

export const FashionOSLayout: React.FC<FashionOSLayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange,
  viewMode,
  onViewModeChange,
  lang,
  onLangChange
}) => {
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    // Smoother scroll control with Balenciaga-aligned inertias
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Track active section using IntersectionObserver to light up nav dots dynamically
  useEffect(() => {
    const sections = NAV_DOTS.map(dot => document.getElementById(`section-${dot.id}`));
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.replace('section-', ''));
          }
        });
      },
      {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Center-screen triggers
        threshold: 0
      }
    );

    sections.forEach((sec) => {
      if (sec) observer.observe(sec);
    });

    return () => {
      sections.forEach((sec) => {
        if (sec) observer.unobserve(sec);
      });
    };
  }, []);

  const handleDotClick = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen text-black dark:text-zinc-100 relative flex flex-col bg-white dark:bg-[#030303] selection:bg-primary selection:text-white transition-colors duration-500 overflow-x-hidden">
      <CinematicBackground />
      <Topbar 
        viewMode={viewMode} 
        onViewModeChange={onViewModeChange}
        lang={lang}
        onLangChange={onLangChange}
      />
      
      <div className="flex flex-1 relative min-h-0">
        
        {/* Immersive Main Container - Full Edge-to-Edge with Zero margin/padding */}
        <main className="flex-1 w-full min-h-screen relative">
          <AnimatePresence mode="wait">
            <motion.div
              key="global-infinite-universe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1]
              }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Right-Side Minimalist Dot Navigation (Normally Hidden, Unveiled on Mouse Hover) */}
      {viewMode === 'aesthetics' && (
        <div 
          className="fixed right-8 top-1/2 -translate-y-1/2 z-[120] flex flex-col gap-10 items-end pointer-events-auto"
          onMouseLeave={() => setHoveredDot(null)}
        >
        {NAV_DOTS.map((dot) => {
          const isActive = activeSection === dot.id;
          const isHovered = hoveredDot === dot.id;

          return (
            <div 
              key={dot.id}
              className="flex items-center gap-4 cursor-crosshair group py-1.5"
              onMouseEnter={() => setHoveredDot(dot.id)}
              onClick={() => handleDotClick(dot.id)}
            >
              {/* Text Tag - Floating beside dot, normally invisible */}
              <span 
                className={`text-[9.5px] font-mono tracking-[0.25em] transition-all duration-300 uppercase ${
                  isActive 
                    ? 'text-white dark:text-white font-bold animate-pulse' 
                    : 'text-zinc-500 dark:text-zinc-500 group-hover:text-white'
                }`}
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
                  pointerEvents: 'none'
                }}
              >
                {dot.label}
              </span>

              {/* Dynamic Dot Graphic */}
              <div className="relative w-5 h-5 flex items-center justify-center">
                <motion.div
                  className="rounded-full transition-all duration-300 pointer-events-none"
                  style={{
                    width: isActive ? '6px' : '4px',
                    height: isActive ? '6px' : '4px',
                  }}
                  animate={{
                    backgroundColor: isActive 
                      ? '#ffffff' 
                      : (isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.25)'),
                    scale: isHovered ? 1.5 : 1.0,
                    boxShadow: isActive ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
                  }}
                />
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Embedded Deep Copyright (Hidden at absolute bottom, no margins, 0.2 opacity) */}
      <footer className="w-full py-8 text-center text-zinc-500/20 text-[8px] tracking-[0.2em] font-mono uppercase bg-transparent z-40 relative">
        MODAUI DESIGN INTEGRAL SYSTEM © 2026 // NEURAL INFRASTRUCTURE GROUP
      </footer>
    </div>
  );
};
