import React, { useState } from 'react';
import { Search, Bell, Zap, Sun, Moon } from 'lucide-react';
import { LuxuryTypography } from '../design-system/LuxuryTypography';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { useTheme } from '../design-system/ThemeContext';
import { Language } from '../../../../types';

interface TopbarProps {
  viewMode: 'aesthetics' | 'operations';
  onViewModeChange: (mode: 'aesthetics' | 'operations') => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  viewMode,
  onViewModeChange,
  lang,
  onLangChange
}) => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const { theme, toggleTheme } = useTheme();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.header 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 inset-x-0 h-20 px-6 md:px-12 flex items-center justify-between z-50 bg-white/50 dark:bg-black/50 backdrop-blur-3xl border-b border-black/5 dark:border-white/5 transition-colors duration-500"
    >
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center transition-colors duration-300">
            <Zap className="text-white dark:text-black animate-pulse" size={16} fill="currentColor" />
          </div>
          <LuxuryTypography variant="h2" className="text-lg text-black dark:text-white transition-colors duration-300">MODAUI</LuxuryTypography>
        </div>

        <div className="hidden md:flex h-9 px-5 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5 flex items-center gap-3 text-zinc-400 dark:text-zinc-500 hover:border-black/20 dark:hover:border-white/20 transition-all cursor-pointer group">
          <Search size={12} />
          <span className="text-[10px] font-medium uppercase tracking-widest text-[#999] dark:text-zinc-300">Search...</span>
        </div>
      </div>

      {/* Centered Switcher: Aesthetic Universe vs Co-Engine */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 p-1 rounded-full items-center z-50">
        <button
          onClick={() => onViewModeChange('aesthetics')}
          className={`px-5 py-1.5 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase font-black transition-all ${
            viewMode === 'aesthetics'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
              : 'text-zinc-500 hover:text-black dark:hover:text-white'
          }`}
        >
          Aesthetics Universe
        </button>
        <button
          onClick={() => onViewModeChange('operations')}
          className={`px-5 py-1.5 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase font-black transition-all flex items-center gap-2 ${
            viewMode === 'operations'
              ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg'
              : 'text-zinc-500 hover:text-black dark:hover:text-white'
          }`}
        >
          {viewMode === 'operations' && <span className="w-1.5 h-1.5 bg-[#00b8d9] rounded-full animate-ping" />}
          Co-Engine Cockpit
        </button>
      </div>

      <div className="flex items-center gap-6">
        {/* Language Cycler */}
        <button
          onClick={() => {
            const languages: Language[] = ['en', 'it', 'fr', 'zh'];
            const currentIndex = languages.indexOf(lang);
            const nextLang = languages[(currentIndex + 1) % languages.length];
            onLangChange(nextLang);
          }}
          className="text-[9px] font-mono border border-black/10 dark:border-white/10 px-2 py-1 rounded bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors uppercase"
          title="Cycle system language"
        >
          [{lang}]
        </button>

        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-300 transition-all relative flex items-center justify-center overflow-hidden"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: 20, rotate: 45, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              exit={{ y: -20, rotate: -45, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center"
            >
              {theme === 'light' ? (
                <Moon size={16} className="text-zinc-700" />
              ) : (
                <Sun size={16} className="text-amber-400" />
              )}
            </motion.div>
          </AnimatePresence>
        </button>

        <button className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-300 transition-colors">
          <Bell size={16} />
        </button>
        <div className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 p-0.5">
          <img 
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" 
            className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-800" 
            alt="User"
          />
        </div>
      </div>
    </motion.header>
  );
};
