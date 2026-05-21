import React, { useEffect, useRef, useState } from 'react';
import { Language } from '../../../../types';
import { CinematicBackground } from '../design-system/CinematicBackground';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { 
  Sparkles, Cpu, Layers, Video, Brain, GitBranch, 
  FolderGit, Database, Activity, Terminal, Image as ImageIcon, 
  ChevronDown, Settings, ChevronRight, Menu, Plus, Trash2, 
  Bell, User, ToggleLeft, LogOut, Globe, Sliders, Eye, 
  HelpCircle, PanelLeftOpen, PanelLeftClose, Inbox, EyeOff,
  Sun, Moon, ShieldCheck, Check, Heart, Server
} from 'lucide-react';
import { useTheme } from '../design-system/ThemeContext';
import { SettingsModal } from '../components/SettingsModal';

interface FashionOSLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
  viewMode: 'aesthetics' | 'operations';
  onViewModeChange: (mode: 'aesthetics' | 'operations') => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
}

const HISTORY_ITEMS = [
  { id: 'tryon', label: 'Fitting Room Models', icon: Cpu, desc: 'Interactive fitting records' },
  { id: 'trends-scroll', label: 'Trend Spectrum Feed', icon: Sparkles, desc: 'Curated world trends' },
  { id: 'design-scroll', label: 'Geometric Sketch Studies', icon: Layers, desc: 'Aesthetic concept boards' },
  { id: 'collection-scroll', label: 'Silhouettes & Drapes', icon: Sliders, desc: 'Digital garment turntable' },
  { id: 'studio', label: 'Portraits & Lighting', icon: User, desc: 'Digital studio workspace' }
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [activeModel, setActiveModel] = useState<string>('Oculus Dei Omni Core / Brand DNA');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isUnifiedSettingsOpen, setIsUnifiedSettingsOpen] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Smooth scrolling using Lenis
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
  }, [activeTab]);

  const handleHistoryClick = (item: typeof HISTORY_ITEMS[0]) => {
    if (item.id.endsWith('-scroll')) {
      onTabChange('home');
      const targetId = `section-${item.id.replace('-scroll', '')}`;
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      triggerToast(`FOCUSED ON RUNTIME STREAM: ${item.label.toUpperCase()}`);
    } else {
      onTabChange(item.id);
      triggerToast(`LOADED PERSISTENT WORKSPACE: ${item.label.toUpperCase()}`);
    }
  };

  const handleNewVision = () => {
    onTabChange('home');
    const el = document.getElementById('section-home');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    triggerToast('NEW CREATIVE CANVAS ENGAGED // INPUT PROTOCOL ACTIVE');
  };

  const handleModelSwap = (modelName: string) => {
    setActiveModel(modelName);
    setIsModelDropdownOpen(false);
    triggerToast(`COGNITIVE MODEL SWAPPED TO: ${modelName.toUpperCase()}`);
  };

  const menuItems = [
    { id: 'home', label: 'Aesthetics // 宇宙', icon: Sparkles, category: 'CORE' },
    { id: 'tryon', label: 'Try-On // 试穿', icon: ShirtIcon, category: 'CORE' },
    { id: 'runtime', label: 'Workspace // 智能', icon: Brain, category: 'CORE' },
    { id: 'media-vault', label: 'Library // 媒体', icon: ImageIcon, category: 'CORE' },
  ];

  const cockpitItems = [
    { id: 'matrix', label: 'Matrix // 矩阵', icon: GridIcon },
    { id: 'studio', label: 'Studio // 数字人', icon: Video },
    { id: 'agents', label: 'Curation // 策划', icon: Database },
    { id: 'memory', label: 'Memory // 记忆', icon: Activity },
    { id: 'logs', label: 'Logs // 日志', icon: Terminal },
  ];

  return (
    <div className="min-h-screen text-white font-sans relative flex bg-[#030303] selection:bg-[#00b8d9]/30 selection:text-[#00b8d9] overflow-x-hidden">
      <CinematicBackground />

      {/* Floating System Signal Popups */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 bg-[#00b8d9] text-zinc-950 px-6 py-3.5 text-[9.5px] font-mono tracking-[0.2em] font-black z-[200] rounded-xl shadow-[0_8px_32px_rgba(0,184,217,0.30)] flex items-center gap-3 border border-[#00b8d9]/40 uppercase"
          >
            <ShieldCheck size={14} className="animate-pulse" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop overlay for mobile */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] cursor-pointer" 
          />
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────
          1. OPEN WEBUI STYLE COLLAPSIBLE SIDEBAR
          ──────────────────────────────────────────────────────── */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: isSidebarOpen ? 0 : -288 }}
        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        className="fixed top-0 bottom-0 left-0 w-72 z-50 bg-[#060608]/95 border-r border-white/5 flex flex-col justify-between overflow-hidden"
      >
        {/* Sidebar Header & Dropdowns */}
        <div className="flex flex-col p-4 flex-1 overflow-y-auto max-h-[calc(100vh-140px)] space-y-6 scrollbar-thin select-none">
          {/* Logo & Platform Info */}
          <div className="flex items-center justify-between px-2 pt-1 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 bg-[#00b8d9] rounded-full animate-ping absolute" />
                <span className="w-2.5 h-2.5 bg-[#00b8d9] rounded-full relative" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black tracking-[0.2em] text-white">OCULUS DEI</span>
                <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest font-black">Aesthetic Co-Engine // 上帝之眼</span>
              </div>
            </div>
            
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 px-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-all cursor-pointer"
            >
              <PanelLeftClose size={15} />
            </button>
          </div>

          {/* Core Model Selection Dropdown */}
          <div className="relative px-1">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="w-full bg-[#0a0a0c] border border-white/5 px-4 py-3 rounded-xl flex items-center justify-between hover:border-white/10 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-5 h-5 rounded-lg bg-[#00b8d9]/10 flex items-center justify-center text-[#00b8d9] shrink-0 font-bold text-[9px] font-mono">
                  M
                </div>
                <div className="flex flex-col min-w-0 leading-tight">
                  <span className="text-[9.5px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">ACTIVE MODEL</span>
                  <span className="text-[10px] text-white truncate font-black mt-0.5 max-w-[150px]">{activeModel.split(' ')[0]} {activeModel.split(' ')[1] || ''}</span>
                </div>
              </div>
              <ChevronDown size={12} className={`text-zinc-500 group-hover:text-white transition-transform duration-300 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Floating Model Dropdown Portal */}
            <AnimatePresence>
              {isModelDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-1 right-1 mt-2 bg-[#09090b] border border-white/10 rounded-2xl p-2.5 shadow-2xl z-[100] space-y-1"
                >
                  {[
                    'Oculus Dei Omni Core / Brand DNA',
                    'Aura Fit Try-On / 试穿',
                    'Style Creative Engine / 创意协作',
                    'Archival Lookbook Library / 媒体'
                  ].map((m) => (
                    <button
                      key={m}
                      onClick={() => handleModelSwap(m)}
                      className={`w-full text-left p-2.5 rounded-xl text-[9.5px] font-mono flex items-center justify-between transition-all hover:bg-white/5 ${
                        activeModel === m ? 'text-[#00b8d9] bg-[#00b8d9]/5 font-black' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>{m.split(' / ')[0]}</span>
                      {activeModel === m && <Check size={11} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Large Action: Initiate Vision */}
          <button
            onClick={handleNewVision}
            className="w-full py-3.5 bg-gradient-to-r from-teal-950/40 to-cyan-950/40 hover:from-teal-900/60 hover:to-cyan-900/60 border border-[#00b8d9]/20 text-[#00b8d9] rounded-xl text-[10px] font-mono tracking-[0.2em] font-black uppercase text-center cursor-pointer transition-all flex items-center justify-center gap-2.5 group hover:border-[#00b8d9]/40 active:scale-[0.98]"
          >
            <Plus size={13} className="text-[#00b8d9] group-hover:rotate-90 transition-transform duration-300" />
            + New Vision
          </button>

          {/* Directory section: Active modules */}
          <div className="space-y-1.5">
            <span className="text-[8px] font-mono font-black text-zinc-600 block px-2 uppercase tracking-[0.2em]">INTEGRALLY ATTACHED</span>
            <div className="space-y-0.5">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full px-3 py-2.5 rounded-xl text-[10.5px] font-mono font-medium tracking-wide flex items-center justify-between transition-all group ${
                      isActive 
                        ? 'bg-[#00b8d9]/10 text-[#00b8d9] font-black border border-[#00b8d9]/20' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon size={13} className={`transition-transform group-hover:scale-110 ${isActive ? 'text-[#00b8d9]' : 'text-zinc-500 group-hover:text-white'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 bg-[#00b8d9] rounded-full animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Directory section: Co-engine Dashboard tabs */}
          <div className="space-y-1.5">
            <span className="text-[8px] font-mono font-black text-zinc-600 block px-2 uppercase tracking-[0.2em]">CO-ENGINE COCKPIT</span>
            <div className="space-y-0.5">
              {cockpitItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full px-4 py-2 rounded-lg text-[9.5px] font-mono tracking-wide flex items-center gap-2 transition-all ${
                      isActive 
                        ? 'bg-zinc-900 border border-white/5 text-white font-bold pl-5' 
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.01]'
                    }`}
                  >
                    <item.icon size={11} className={isActive ? 'text-[#00b8d9]' : 'text-zinc-650'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Directory section: History/Sprint Tracing (ChatGPT Chat lists) */}
          <div className="space-y-2 pt-1 border-t border-white/5">
            <span className="text-[8px] font-mono font-black text-zinc-600 block px-2 uppercase tracking-[0.2em]">RECENT RUNTIMES</span>
            <div className="space-y-1">
              {HISTORY_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleHistoryClick(item)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/[0.02] flex items-start gap-2.5 transition-colors group cursor-pointer"
                >
                  <item.icon size={12} className="text-zinc-600 mt-0.5 shrink-0 group-hover:text-[#00b8d9] transition-colors" />
                  <div className="flex flex-col min-w-0 leading-tight">
                    <span className="text-[9.5px] font-mono text-zinc-300 truncate font-black">{item.label}</span>
                    <span className="text-[7.5px] text-zinc-600 font-sans tracking-wide truncate mt-0.5">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer with Language / Theme & User Control */}
        <div className="p-4 bg-[#0a0a0c]/80 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between px-1">
            {/* Global Language Cycler */}
            <button
              onClick={() => {
                const languages: Language[] = ['en', 'it', 'fr', 'zh'];
                const currentIndex = languages.indexOf(lang);
                const nextLang = languages[(currentIndex + 1) % languages.length];
                onLangChange(nextLang);
                triggerToast(`SYS LANG MUTATED => [${nextLang.toUpperCase()}]`);
              }}
              className="text-[9px] font-mono border border-white/10 px-2.5 py-1.5 rounded-xl bg-white/5 text-zinc-400 hover:text-white transition-colors uppercase cursor-pointer"
              title="Cycle platform language"
            >
              LOCALE: [{lang}]
            </button>

            {/* Sunshine/Moonlight Theme switch */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer border border-white/5 bg-[#0a0a0c]"
              title="Toggle theme parameters"
            >
              {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
            </button>
          </div>

          {/* User Silicon Profile Card */}
          <div className="flex items-center justify-between bg-[#111116]/80 p-3 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center font-bold text-[10px] text-zinc-950 uppercase pr-0.5 shadow-[0_4px_12px_rgba(0,184,217,0.15)] shrink-0">
                BO
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-[9.5px] font-sans font-bold text-white truncate">bosionisrl@gmail.com</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[7.5px] font-mono text-emerald-400 font-black uppercase tracking-widest">Core Developer // 开发者</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => triggerToast('SYS ARCHIVE SYNCHRONIZED // SETTINGS OPEN')}
              className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <Settings size={12} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* ────────────────────────────────────────────────────────
          2. FLOATING SIDEBAR TOGGLER BUTTON WHEN COLLAPSED
          ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed left-6 top-6 z-[100] p-3.5 rounded-2xl bg-[#09090b]/90 border border-white/10 text-white hover:bg-[#00b8d9] hover:text-zinc-950 transition-all cursor-pointer flex items-center justify-center shadow-2xl active:scale-[0.98]"
            title="Expand Sidebar"
          >
            <PanelLeftOpen size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────
          3. MAIN WORKSPACE CONTAINER LAYOUT
          ──────────────────────────────────────────────────────── */}
      <div 
        className="flex-1 flex flex-col min-h-screen relative transition-all duration-300"
        style={{ paddingLeft: (!isMobile && isSidebarOpen) ? '288px' : '0px' }}
      >
        {/* Compact top headers bar following chat interface patterns */}
        <header className="h-16 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-2xl relative z-40 select-none">
          <div className="flex items-center gap-4">
            {/* Sidebar status spacer */}
            {!isSidebarOpen && <div className="w-12 h-1 gap-1" />}
            
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-black text-[#00b8d9] tracking-widest uppercase">OCULUS DEI</span>
              <span className="text-zinc-650 font-mono text-[9px] mx-1">//</span>
              <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase select-all">
                {activeTab === 'home' && "UNIVERSE // 宇宙"}
                {activeTab === 'media-vault' && "ASSETS // 媒体"}
                {activeTab === 'tryon' && "FITTING // 试穿"}
                {activeTab === 'runtime' && "WORKSPACE // 协作"}
                {['matrix', 'studio', 'agents', 'memory', 'logs'].includes(activeTab) && `COCKPIT // 矩阵`}
              </span>
            </div>
          </div>

          {/* Right Action Widgets Empty for Minimal Look */}
          <div className="flex items-center gap-4 text-[9.5px] font-mono text-zinc-500 font-bold max-sm:hidden">
          </div>
        </header>

        {/* Dynamic page children placement area */}
        <main className="flex-1 w-full min-h-[calc(100vh-64px)] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full h-full relative"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Space saving minimalist page footprint */}
        <footer className="w-full py-8 text-center text-zinc-700/30 text-[8px] tracking-[0.25em] font-mono uppercase bg-transparent min-h-[30px] border-t border-white/[0.02]">
          AURA LABS // AESTHETICS PARTNERSHIP © 2026
        </footer>
      </div>
    </div>
  );
};

/* Custom inline SVG wrappers to avoid complex imports if not explicitly requested */
const ShirtIcon: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20.38 3.46 16 1.7a2 2 0 0 0-1.48 0l-4.52 1.82a2 2 0 0 1-1.6 0L3.88 1.7A2 2 0 0 0 2.4 1.7L1.13 2.2a2 2 0 0 0-1.21 2.58l2.5 7.5a2 2 0 0 0 1.9 1.37h2.7v7.5A2 2 0 0 0 9.02 23h5.96a2 2 0 0 0 2-1.65l1.05-7.35H20.7a2 2 0 0 0 1.9-1.37l2.5-7.5a2 2 0 0 0-1.21-2.58l-1.51-.59Z"/>
    <path d="M12 4v4H8.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5H12"/>
  </svg>
);

const GridIcon: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="7" height="7" x="3" y="3" rx="1"/>
    <rect width="7" height="7" x="14" y="3" rx="1"/>
    <rect width="7" height="7" x="14" y="14" rx="1"/>
    <rect width="7" height="7" x="3" y="14" rx="1"/>
  </svg>
);
