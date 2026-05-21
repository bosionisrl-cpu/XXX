import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { ImmichMediaVault } from '../components/ImmichMediaVault';
import { 
  Plus, Mic, Sparkles, Send, Globe, Trash2, 
  ArrowRight, RefreshCw, FileText, Image as ImageIcon, Check, User
} from 'lucide-react';

// Interface Declarations
interface TrendItem {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
}

const INITIAL_TRENDS: TrendItem[] = [
  {
    id: 'tr-1',
    category: 'VAGUE_2026_COLD_SILHOUETTE',
    title: 'Cyber Brutalism',
    description: 'Deep structured, architectural outerwear combined with extreme protective technical fabrics.',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'tr-2',
    category: 'VAGUE_2026_GENERATIVE_FLOW',
    title: 'Neo-Silk Fluidity',
    description: 'Weightless generative silk draping floating over raw technical underlays.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'tr-3',
    category: 'VAGUE_2026_METALLURGY',
    title: 'Liquid Chromium',
    description: 'Chrome-infused high-shine materials that capture real-time ambient raytracing.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'tr-4',
    category: 'VAGUE_2026_CONDUCTIVE_LAYERS',
    title: 'Graphene Knitted Shield',
    description: 'Technical, ultra-thin graphene memory weave responding directly to body heat signatures.',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80'
  }
];

// Context Menu Interface
interface MenuState {
  x: number;
  y: number;
  type: 'concept' | 'human';
}

export const HomePage: React.FC = () => {
  const [trends, setTrends] = useState<TrendItem[]>(INITIAL_TRENDS);
  const [hoveredTrendId, setHoveredTrendId] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<MenuState | null>(null);
  
  // Real Chat History State for GPT-style Open WebUI dialogue
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', text: string }>>([]);

  // Scroll Parallax position tracker
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Real-time Chat Synapsis calling server-side Gemini API
  const handleSignalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isProcessing) return;

    const userMsg = inputVal.trim();
    setInputVal('');
    setIsProcessing(true);
    setProgress(0);

    const updatedHistory = [...chatHistory, { role: 'user' as const, text: userMsg }];
    setChatHistory(updatedHistory);

    // Simulated progress tick during live connection
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + 8;
      });
    }, 120);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: chatHistory })
      });

      clearInterval(interval);
      setProgress(100);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setChatHistory([...updatedHistory, { role: 'assistant' as const, text: data.reply }]);
          
          // Keep visual response: inject custom premium trends when relevant queries arrive!
          if (userMsg.toUpperCase().includes('VOGUE') || userMsg.toUpperCase().includes('DESIGN') || userMsg.toUpperCase().includes('IMAGE')) {
            const addedItem: TrendItem = {
              id: `tr-added-${Date.now()}`,
              category: 'OCULUS_DEI_GENERATIVE_SYNAPSE_001',
              title: userMsg.toUpperCase().includes('VOGUE') ? 'SOLSTICE DRAPERY // PARIS' : 'CHROMIUM SHELL SILHOUETTE',
              description: data.reply,
              imageUrl: userMsg.toUpperCase().includes('VOGUE') 
                ? 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'
                : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'
            };
            setTrends((prev) => [addedItem, ...prev]);
            triggerToast('VISUAL SPECTRUM COGNITIVE STREAM INJECTED');
          }
        } else {
          setChatHistory([...updatedHistory, { role: 'assistant' as const, text: 'Direct sensory error: Model failed to process request.' }]);
        }
      } else {
        setChatHistory([...updatedHistory, { role: 'assistant' as const, text: 'Synapse error: Server connection timed out.' }]);
      }
    } catch (err: any) {
      clearInterval(interval);
      setChatHistory([...updatedHistory, { role: 'assistant' as const, text: `Sensory connection failure: ${err.message}` }]);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const handleActionClick = (promptText: string) => {
    setInputVal(promptText);
    triggerToast('SUGGESTION SELECTED // ENTER TO SEND');
  };

  // Close context menu on click
  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  return (
    <div className="w-full bg-black text-white relative select-none">
      
      {/* SECTION 1: HERO = 90% AIR ENTRY POINT */}
      <section 
        id="section-home"
        className="w-full min-h-screen bg-black flex flex-col items-center justify-center relative select-none px-6 pt-16 pb-20 overflow-hidden"
      >
        <form 
          id="synapse-chat-form"
          onSubmit={handleSignalSubmit} 
          className="w-full max-w-2xl flex flex-col items-center relative gap-8 z-20"
        >
          {/* Conversational Screen Title (if no active threads) */}
          {chatHistory.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <span className="text-[10px] tracking-[0.6em] text-[#00b8d9] uppercase font-mono animate-pulse font-black">
                OCULUS DEI // 上帝之眼 • AI COGNITIVE CONSCIOUSNESS
              </span>
              <h1 className="text-2xl md:text-[2.25rem] font-sans font-light tracking-[0.25em] text-white leading-normal uppercase">
                你今天在想些什么?
              </h1>
            </motion.div>
          ) : (
            <div className="w-full flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-[9px] tracking-[0.4em] font-mono text-[#00b8d9] font-black uppercase">
                ACTIVE SYNAPSE CONNECTION // 实时思维对话
              </span>
              <button 
                type="button" 
                onClick={() => {
                  setChatHistory([]);
                  triggerToast('CONSCIOUSNESS SYNAPSE STREAM RESET');
                }}
                className="text-[9px] tracking-[0.15em] font-mono text-zinc-500 hover:text-[#00b8d9] flex items-center gap-1.5 transition-all uppercase cursor-pointer font-bold"
              >
                <Trash2 size={11} />
                Clear Thread // 清除
              </button>
            </div>
          )}

          {/* Chat Messages Feed container */}
          <AnimatePresence>
            {chatHistory.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-h-[380px] overflow-y-auto pr-2 space-y-6 flex flex-col scrollbar-thin scrollbar-thumb-zinc-900/40"
              >
                {chatHistory.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 25 }}
                    className={`flex flex-col space-y-2 p-5 rounded-3xl border border-white/5 ${
                      msg.role === 'user' 
                        ? 'bg-zinc-950/40 border-r-white/20 items-end text-right self-end ml-12' 
                        : 'bg-zinc-950/80 border-l-[#00b8d9]/20 self-start mr-12 shadow-[0_4px_20px_rgba(0,184,217,0.03)]'
                    }`}
                    style={{ maxWidth: '85%' }}
                  >
                    <span className="text-[8px] tracking-[0.2em] font-mono text-zinc-500 uppercase font-black">
                      {msg.role === 'user' ? 'USER // AESTHETIC DIRECTIVE' : 'OCULUS DEI // GENERATIVE SYNAPSE'}
                    </span>
                    <p className="text-[12.5px] font-sans text-zinc-200 tracking-wide leading-relaxed font-light whitespace-pre-line">
                      {msg.text}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Elongated search/chat capsule styled EXACTLY like the image */}
          <div className="w-full bg-[#121214] border border-white/5 rounded-[2.25rem] flex flex-col overflow-hidden transition-all duration-300 hover:border-white/10 shadow-[0_15px_45px_rgba(0,0,0,0.85)]">
            
            {/* Row 1: Interactive Entry */}
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                onClick={() => {
                  setChatHistory([]);
                  setInputVal('');
                  triggerToast('SYNAPSE REINITIALIZED');
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer"
                title="新建对话 // NEW CHAT"
              >
                <Plus size={15} />
              </button>

              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="有任何关于时尚、服装或科技细节的问题，尽情提问..."
                disabled={isProcessing}
                className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 border-none outline-none focus:outline-none tracking-wider font-sans py-3"
              />

              {/* MIC & voice pill on the right */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerToast('AUDIO STREAM STANDBY')}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                  title="语音输入量化"
                >
                  <Mic size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => triggerToast('VOICE PARSING ENGAGED')}
                  className="bg-zinc-800 border border-white/10 hover:bg-zinc-700 text-[10px] text-zinc-200 px-3.5 py-2 rounded-full font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer font-bold"
                >
                  <div className="w-1.5 h-1.5 bg-[#00b8d9] rounded-full animate-ping" />
                  语音 // VOICE
                </button>
              </div>
            </div>

            {/* Row 2: Bottom Status Band */}
            <div className="flex justify-between items-center bg-zinc-950/40 px-5 py-3 rounded-b-[2.25rem] border-t border-white/[0.03] text-[9px] font-mono text-zinc-500 leading-normal">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#00b8d9] rounded-full animate-pulse" />
                <span>你可以发送的消息数量有限，登录或注册即可畅享更长对话。</span>
              </div>
              <button
                type="button"
                onClick={() => triggerToast('SECURE BRAND DIRECTORY ACCESSED')}
                className="text-[9px] tracking-widest text-[#00b8d9] bg-[#00b8d9]/5 hover:bg-[#00b8d9]/10 px-3.5 py-1.5 rounded-lg border border-[#00b8d9]/20 transition-all font-bold cursor-pointer uppercase"
              >
                登录 // LOGIN
              </button>
            </div>
          </div>

          {/* Cinematic fine Loading Indicator (directly matching image) */}
          <div className="w-full h-[1.5px] bg-zinc-950 relative overflow-hidden -mt-4">
            <AnimatePresence>
              {isProcessing ? (
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  exit={{ opacity: 0 }}
                  className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  transition={{ ease: 'easeInOut' }}
                />
              ) : (
                <div className="h-full w-full bg-white/[0.01]" />
              )}
            </AnimatePresence>
          </div>

          {/* Quick-action capsule suggestions below the input area */}
          {chatHistory.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-3.5 mt-2"
            >
              <button
                type="button"
                onClick={() => handleActionClick('Synthesize a liquid chromium structured jacket with deconstructed graphene weave.')}
                className="bg-[#121214]/50 hover:bg-zinc-900 hover:border-white/10 text-zinc-400 hover:text-white border border-white/5 rounded-full px-5 py-2.5 text-[9.5px] font-mono tracking-widest transition-all uppercase flex items-center gap-2 cursor-pointer"
              >
                <ImageIcon size={12} className="text-[#00b8d9]" />
                生成图片 // CREATE IMAGES
              </button>
              <button
                type="button"
                onClick={() => handleActionClick('Draft a custom cyberpunk runway look design brief for Oculus Dei layer 03.')}
                className="bg-[#121214]/50 hover:bg-zinc-900 hover:border-white/10 text-zinc-400 hover:text-white border border-white/5 rounded-full px-5 py-2.5 text-[9.5px] font-mono tracking-widest transition-all uppercase flex items-center gap-2 cursor-pointer"
              >
                <FileText size={12} className="text-[#00b8d9]" />
                撰写或编辑 // DRAFT IDEAS
              </button>
              <button
                type="button"
                onClick={() => handleActionClick('Scan the worldwide fashion database for 2026 avant-garde street trends.')}
                className="bg-[#121214]/50 hover:bg-zinc-900 hover:border-white/10 text-zinc-400 hover:text-white border border-white/5 rounded-full px-5 py-2.5 text-[9.5px] font-mono tracking-widest transition-all uppercase flex items-center gap-2 cursor-pointer"
              >
                <Globe size={11} className="text-[#00b8d9]" />
                查找资料 // SEARCH MATRIX
              </button>
            </motion.div>
          )}
        </form>

        <div className="absolute bottom-12 text-[8px] tracking-[0.3em] text-zinc-650/40 font-mono uppercase text-center w-full">
          SCROLL TO UNVEIL ACTIVE SPECTRAL LAYERS
        </div>
      </section>

      {/* SECTION 2: TREND STREAM (GLOBAL TRENDS) */}
      <section 
        id="section-trends"
        className="w-full min-h-screen bg-black relative border-t border-zinc-950"
      >
        <div className="p-12 border-b border-zinc-950 flex justify-between items-center bg-black">
          <span className="text-[10px] tracking-[0.3em] font-mono text-zinc-500 uppercase">TREND STREAM // 趋势流</span>
          <span className="text-[8px] tracking-[0.2em] font-mono text-zinc-700 uppercase">GLOBAL INTEGRATIVE TRENDS</span>
        </div>

        {/* Edge-to-edge stream with 1px pure black lines, zoom on hover + others dim */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-black w-full">
          {trends.map((item, index) => {
            const isHovered = hoveredTrendId === item.id;
            const isAnyHovered = hoveredTrendId !== null;
            const opacity = isAnyHovered ? (isHovered ? 1 : 0.3) : 1;
            const parallaxOffset = (scrollY - (index * 150)) * -0.05;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredTrendId(item.id)}
                onMouseLeave={() => setHoveredTrendId(null)}
                className="relative aspect-square md:aspect-[4/5] bg-zinc-950 overflow-hidden cursor-crosshair group transition-opacity duration-500"
                style={{ opacity }}
              >
                {/* Parallax Image holder */}
                <div className="absolute inset-0 w-full h-[120%] -top-[10%] overflow-hidden">
                  <motion.img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale-0 brightness-100 md:grayscale md:brightness-[0.38] md:group-hover:grayscale-0 md:group-hover:brightness-90 transition-all duration-700 pointer-events-none"
                    style={{ y: parallaxOffset }}
                    animate={{ scale: isHovered ? 1.02 : 1.0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 30 }}
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                {/* Text details metadata */}
                <div className="absolute inset-0 p-12 flex flex-col justify-between z-10 pointer-events-none">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase text-zinc-600 tracking-[0.3em] font-mono">
                      {item.category}
                    </span>
                    <span className="text-[9px] font-black uppercase text-white/20 font-mono">
                      [0{index + 1}]
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-4xl font-serif font-medium tracking-tight text-white leading-none">
                      {item.title}
                    </h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                      transition={{ type: 'spring', stiffness: 100, damping: 30 }}
                      className="text-[11px] font-sans text-zinc-400 tracking-wider max-w-sm leading-relaxed"
                    >
                      {item.description}
                    </motion.p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: CONCEPT STREAM (AI MIND DRAWINGS) */}
      <section 
        id="section-design"
        className="w-full h-screen bg-black relative flex flex-col justify-between overflow-hidden"
      >
        <div className="p-12 border-b border-zinc-950 flex justify-between items-center bg-black z-20">
          <span className="text-[10px] tracking-[0.3em] font-mono text-zinc-500 uppercase">CONCEPT STREAM // 概念流</span>
          <span className="text-[8px] tracking-[0.2em] font-mono text-zinc-700 uppercase">GENERATIVE RECURSIVE SKETCHES</span>
        </div>

        {/* 3D Render Port */}
        <div 
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY, type: 'concept' });
          }}
          className="absolute inset-0 w-full h-full z-10"
        >
          <ConceptCanvas />
        </div>

        <div className="p-12 z-20 pointer-events-none flex justify-between items-end">
          <div className="text-zinc-500 max-w-xs space-y-2">
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase block">ACTIVE SPECTRUM CONFIG</span>
            <p className="text-[10px] font-sans tracking-wide leading-relaxed">
              Real-time generation traces, wireframes, charcoal weaves, and light refraction models capturing aesthetic mutations.
            </p>
          </div>
          <span className="text-[8px] tracking-[0.3em] font-mono text-zinc-600 uppercase">
            RIGHT-CLICK FOR CONTEXT CONTROL
          </span>
        </div>
      </section>

      {/* SECTION 4: GARMENT STREAM (ACTIVE BRAND SPECIMENS) */}
      <section 
        id="section-collection"
        className="w-full h-screen bg-black relative flex flex-col justify-between overflow-hidden"
      >
        <div className="p-12 border-b border-zinc-950 flex justify-between items-center bg-black z-20">
          <span className="text-[10px] tracking-[0.3em] font-mono text-zinc-500 uppercase">GARMENT STREAM // 服装流</span>
          <span className="text-[8px] tracking-[0.2em] font-mono text-zinc-700 uppercase">ACTIVE BRAND SILHOUETTES</span>
        </div>

        {/* 3D WebGL Turntable */}
        <div className="absolute inset-0 w-full h-full z-10">
          <GarmentCanvas />
        </div>

        <div className="p-12 z-20 pointer-events-none flex justify-between items-end">
          <div className="text-zinc-500 max-w-xs space-y-2">
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase block">TURNTABLE CONTROL</span>
            <p className="text-[10px] font-sans tracking-wide leading-relaxed">
              Kinetic memory drapes with inertia friction. Scroll extremely slowly to dolly-zoom in and out.
            </p>
          </div>
          <span className="text-[8px] tracking-[0.3em] font-mono text-zinc-600 uppercase">
            SCROLL SLOWLY TO DOLLY ZOOM
          </span>
        </div>
      </section>

      {/* SECTION 5: HUMAN STREAM (DIGITAL AVATARS) */}
      <section 
        id="section-try-on"
        className="w-full h-screen bg-black relative flex flex-col justify-between overflow-hidden"
      >
        <div className="p-12 border-b border-zinc-950 flex justify-between items-center bg-black z-20">
          <span className="text-[10px] tracking-[0.3em] font-mono text-zinc-500 uppercase">HUMAN STREAM // 视觉流</span>
          <span className="text-[8px] tracking-[0.2em] font-mono text-zinc-700 uppercase">DIGITAL CAMPAIGN LOOKS</span>
        </div>

        {/* Interactive Illuminated Avatar Viewport */}
        <div 
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY, type: 'human' });
          }}
          className="absolute inset-0 w-full h-full z-10"
        >
          <HumanCanvas />
        </div>

        <div className="p-12 z-20 pointer-events-none flex justify-between items-end">
          <div className="text-zinc-500 max-w-xs space-y-2">
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase block">ILLUMINATION RESPONDER</span>
            <p className="text-[10px] font-sans tracking-wide leading-relaxed">
              Moving your cursor close to the central figure transitions coordinates to cold-white STUDIO lighting. Drawing away sets 暗调聚光 DRAMATIC spot spotlight.
            </p>
          </div>
          <span className="text-[8px] tracking-[0.3em] font-mono text-zinc-600 uppercase font-black">
            PROXIMITY RADIAL LIGHTS ACTIVE
          </span>
        </div>
      </section>

      {/* SECTION 6: IMMICH INTELLIGENCE ASSET GALLERY VAULT */}
      <section 
        id="section-media-vault"
        className="w-full min-h-screen bg-black relative border-t border-zinc-950 p-6 md:p-12 space-y-8"
      >
        <div className="flex justify-between items-center bg-black z-20 pb-4">
          <span className="text-[10px] tracking-[0.3em] font-mono text-zinc-500 uppercase">VAULT STREAM // 珍藏流</span>
          <span className="text-[8px] tracking-[0.2em] font-mono text-zinc-700 uppercase">SECURE BRAND ARCHIVES</span>
        </div>

        <ImmichMediaVault />
      </section>

      {/* Custom Global Spatial Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 100, damping: 30 }}
            className="fixed z-50 bg-[#070707]/95 shadow-2xl p-2 flex flex-col min-w-[180px]"
            style={{ 
              top: contextMenu.y, 
              left: contextMenu.x 
            }}
          >
            {contextMenu.type === 'concept' ? (
              <>
                <button 
                  onClick={() => triggerToast('PRODUCT DESIGN SPECIMEN ARCHIVED')}
                  className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 hover:text-white hover:bg-white/[0.02] tracking-[0.25em] transition-all uppercase"
                >
                  ADD TO COLLECTION
                </button>
                <button 
                  onClick={() => triggerToast('GENERATING MODEL SPECIFICATION PDF')}
                  className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 hover:text-white hover:bg-white/[0.02] tracking-[0.25em] transition-all uppercase border-t border-white/[0.03]"
                >
                  EXPORT PDF
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => triggerToast('OFFERING PROMPT METADATA SENT TO BUYER')}
                  className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 hover:text-white hover:bg-white/[0.02] tracking-[0.25em] transition-all uppercase"
                >
                  SEND TO BUYER
                </button>
                <button 
                  onClick={() => triggerToast('LOOKBOOK PROTOCOL COMPILED // EXPORTED')}
                  className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 hover:text-white hover:bg-white/[0.02] tracking-[0.25em] transition-all uppercase border-t border-white/[0.03]"
                >
                  EXPORT LOOKBOOK
                </button>
                <button 
                  onClick={() => triggerToast('METADATA LINK SHARED TO CAMPAIGN SPECTRE')}
                  className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 hover:text-white hover:bg-white/[0.02] tracking-[0.25em] transition-all uppercase border-t border-white/[0.03]"
                >
                  SHARE CAMPAIGN
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating System Signal Popups */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 text-[9px] font-mono tracking-[0.3em] font-black z-50 pointer-events-none uppercase shadow-2xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ==========================================================
   Modular Custom Canvas 1: Concept Builder Sketch Block
   ========================================================== */
const ConceptCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xc5a880, 1.8);
    dirLight.position.set(5, 5, 2);
    scene.add(dirLight);

    // Highly styled Carbon raw wireframe clothing geometry
    const geometry = new THREE.TorusKnotGeometry(1.6, 0.45, 160, 24, 3, 5);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x3a3a3a,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Interpolation with smooth kinetic weight
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      if (meshRef.current) {
        const elapsed = clock.getElapsedTime();
        meshRef.current.rotation.y = elapsed * 0.08 + mouseRef.current.x * 0.4;
        meshRef.current.rotation.x = mouseRef.current.y * 0.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />;
};

/* ==========================================================
   Modular Custom Canvas 2: Living 3D Turntable Garment
   ========================================================== */
const GarmentCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  const dollyZRef = useRef(7.0);
  const isHoveredRef = useRef(false);
  const turntableVelocityRef = useRef(0.005);
  const lastTimeRef = useRef(Date.now());

  // Dolly Scroll zoom handling with slow speed damping
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomScale = e.deltaY * 0.0025;
      dollyZRef.current = Math.max(4.0, Math.min(10.0, dollyZRef.current + zoomScale));
    };

    const canvasEl = canvasRef.current;
    if (canvasEl) {
      canvasEl.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (canvasEl) {
        canvasEl.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.z = dollyZRef.current;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const goldKey = new THREE.DirectionalLight(0xc5a880, 2.0);
    goldKey.position.set(4, 6, 4);
    scene.add(goldKey);

    const metalBack = new THREE.PointLight(0xffffff, 2.0, 15);
    metalBack.position.set(-4, -2, -3);
    scene.add(metalBack);

    // Highly reflective structured clothing weave
    const geometry = new THREE.IcosahedronGeometry(1.8, 2);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xc5a880, // Champagne gold
      metalness: 0.98,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    const handleMouseEnter = () => { isHoveredRef.current = true; };
    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      // Triggers inertial friction turntable slide
      turntableVelocityRef.current = 0.055;
    };

    const canvasEl = canvasRef.current;
    canvasEl.addEventListener('mouseenter', handleMouseEnter);
    canvasEl.addEventListener('mouseleave', handleMouseLeave);

    let animationId: number;
    const render = () => {
      animationId = requestAnimationFrame(render);

      const now = Date.now();
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Dolly zoom interpolation
      if (cameraRef.current) {
        cameraRef.current.position.z += (dollyZRef.current - cameraRef.current.position.z) * 0.08;
      }

      if (meshRef.current) {
        if (isHoveredRef.current) {
          meshRef.current.rotation.y += 0.015;
        } else {
          // Slow slide down to base rotation
          if (turntableVelocityRef.current > 0.005) {
            turntableVelocityRef.current -= delta * 0.045;
          } else {
            turntableVelocityRef.current = 0.005;
          }
          meshRef.current.rotation.y += turntableVelocityRef.current;
        }
      }

      renderer.render(scene, camera);
    };

    render();

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      canvasEl.removeEventListener('mouseenter', handleMouseEnter);
      canvasEl.removeEventListener('mouseleave', handleMouseLeave);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block cursor-zoom-in" />;
};

/* ==========================================================
   Modular Custom Canvas 3: Human Proximity Illumination View
   ========================================================== */
const HumanCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);

  const [activePreset, setActivePreset] = useState<'ALPHA' | 'BETA' | 'GAMMA'>('ALPHA');

  // Interactive mouse illumination states
  const [ambientIntensity, setAmbientIntensity] = useState(0.4);
  const [spotIntensity, setSpotIntensity] = useState(1.2);
  const [lightPresetName, setLightPresetName] = useState<'STUDIO' | 'DRAMATIC'>('STUDIO');

  // Tracking cursor proximity to transition light presets
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const dx = clientX - rect.width / 2;
      const dy = clientY - rect.height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxRadius = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;

      const ratio = Math.max(0, Math.min(1, 1 - dist / (maxRadius * 0.5)));

      // Closer proximity = soft glow STUDIO, Else DRAMATIC high cast shadows
      if (ratio > 0.45) {
        setLightPresetName('STUDIO');
        setAmbientIntensity(0.75);
        setSpotIntensity(0.5);
      } else {
        setLightPresetName('DRAMATIC');
        setAmbientIntensity(0.12);
        setSpotIntensity(2.8);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sync ambient and spotlights
  useEffect(() => {
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = ambientIntensity;
    }
    if (spotLightRef.current) {
      spotLightRef.current.intensity = spotIntensity;
    }
  }, [ambientIntensity, spotIntensity]);

  // Handle preset avatar structure updates
  useEffect(() => {
    if (!sceneRef.current || !meshRef.current) return;

    const angleY = meshRef.current.rotation.y;
    sceneRef.current.remove(meshRef.current);
    meshRef.current.geometry.dispose();
    if (Array.isArray(meshRef.current.material)) {
      meshRef.current.material.forEach((m) => m.dispose());
    } else {
      meshRef.current.material.dispose();
    }

    let geom: THREE.BufferGeometry;
    let matColor: number;
    let roug: number;

    if (activePreset === 'BETA') {
      geom = new THREE.OctahedronGeometry(1.8, 1);
      matColor = 0x070707;
      roug = 0.15;
    } else if (activePreset === 'GAMMA') {
      geom = new THREE.IcosahedronGeometry(1.8, 1);
      matColor = 0xc5a880;
      roug = 0.35;
    } else {
      geom = new THREE.TorusKnotGeometry(1.4, 0.45, 120, 16, 2, 5);
      matColor = 0xeaeaea;
      roug = 0.08;
    }

    const mat = new THREE.MeshPhysicalMaterial({
      color: matColor,
      metalness: 0.95,
      roughness: roug,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    const newMesh = new THREE.Mesh(geom, mat);
    newMesh.rotation.y = angleY;
    sceneRef.current.add(newMesh);
    meshRef.current = newMesh;
  }, [activePreset]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 6.8;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const spotLight = new THREE.SpotLight(0xffffff, spotIntensity, 50, Math.PI / 5, 0.4, 1);
    spotLight.position.set(4, 8, 4);
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    const purpleBack = new THREE.PointLight(0xc5a880, 2.0, 15);
    purpleBack.position.set(-4, -2, -3);
    scene.add(purpleBack);

    const geom = new THREE.TorusKnotGeometry(1.4, 0.45, 120, 16, 2, 5);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xeaeaea,
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const mesh = new THREE.Mesh(geom, mat);
    scene.add(mesh);
    meshRef.current = mesh;

    let animId: number;
    const render = () => {
      animId = requestAnimationFrame(render);
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.007;
      }
      renderer.render(scene, camera);
    };

    render();

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block cursor-alias" />

      {/* Model Swap overlays top center */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 z-20 flex bg-zinc-950/40 backdrop-blur-3xl p-1 rounded-full border border-white/5 pointer-events-auto">
        {(['ALPHA', 'BETA', 'GAMMA'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setActivePreset(m)}
            className={`px-5 py-2 rounded-full text-[8px] font-mono tracking-[0.2em] transition-all uppercase ${
              activePreset === m 
                ? 'bg-white text-black font-bold shadow-lg' 
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="absolute top-28 right-12 z-20 pointer-events-none opacity-40 text-right">
        <span className="text-[8px] tracking-[0.3em] font-mono text-zinc-500 uppercase block">LIGHT CONFIG</span>
        <span className="text-[9px] tracking-[0.2em] font-sans text-white font-black uppercase mt-1">
          {lightPresetName} // {Math.round(ambientIntensity * 100)}%
        </span>
      </div>
    </div>
  );
};
