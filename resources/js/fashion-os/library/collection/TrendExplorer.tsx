import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Command, ArrowRight } from 'lucide-react';
import { useTheme } from '../../design-system/ThemeContext';

interface TrendItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

const INITIAL_TRENDS: TrendItem[] = [
  {
    id: 'trend-1',
    title: 'Cyber Brutalism',
    category: 'VAGUE_2026_COLD_SILHOUETTE',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
    description: 'Deep structured, architectural outerwear combined with extreme protective technical fabrics.'
  },
  {
    id: 'trend-2',
    title: 'Neo-Silk Fluidity',
    category: 'VAGUE_2026_GENERATIVE_FLOW',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    description: 'Weightless generative silk draping floating over raw technical underlays.'
  },
  {
    id: 'trend-3',
    title: 'Liquid Chromium',
    category: 'VAGUE_2026_METALLURGY',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    description: 'Chrome-infused high-shine materials that capture real-time ambient raytracing.'
  },
  {
    id: 'trend-4',
    title: 'Graphene Knitted Shield',
    category: 'VAGUE_2026_CONDUCTIVE_LAYERS',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
    description: 'Technical, ultra-thin graphene memory weave responding directly to body heat signatures.'
  }
];

export const TrendExplorer: React.FC = () => {
  const { theme } = useTheme();
  const [trends, setTrends] = useState<TrendItem[]>(INITIAL_TRENDS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlingProgress, setCrawlingProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCrawlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isCrawling) return;

    setIsCrawling(true);
    setCrawlingProgress(0);

    // Cinematic progress simulation (growing fine line from left to right)
    const interval = setInterval(() => {
      setCrawlingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Unshift new crawled trend elements directly in-place
            const newTrends: TrendItem[] = [
              {
                id: `trend-crawled-${Date.now()}-1`,
                title: 'Spring Solstice Void',
                category: 'VOGUE_2026_PRE_SPRING_INTELLIGENCE',
                imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
                description: 'Deconstructed drapes and high-contrast collar shields captured in Paris.'
              },
              {
                id: `trend-crawled-${Date.now()}-2`,
                title: 'Alabaster Synth-Knit',
                category: 'VOGUE_2026_PRE_SPRING_MATERIAL',
                imageUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=1200&q=80',
                description: 'Off-white textured structures draped symmetrically across protective frameworks.'
              }
            ];
            setTrends(prevTrends => [...newTrends, ...prevTrends]);
            setIsCrawling(false);
            setQuery('');
          }, 300);
          return 100;
        }
        return prev + 1.5;
      });
    }, 40);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white relative select-none">
      
      {/* Floating Insight Query Panel */}
      <div className="sticky top-20 z-40 p-12 bg-gradient-to-b from-black via-black/80 to-transparent flex flex-col items-center">
        <form onSubmit={handleCrawlSubmit} className="w-full max-w-2xl relative">
          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="TYPE EXTRACTION SIGNAL (e.g. 抓取Vogue 2026早春趋势)..."
              className="w-full bg-zinc-950/40 text-xs text-white placeholder-zinc-600 px-6 py-5 rounded-full border border-zinc-800 focus:border-white/20 focus:outline-none transition-all tracking-[0.25em] uppercase"
              style={{
                boxShadow: query ? '0 0 15px rgba(255, 255, 255, 0.08)' : 'none'
              }}
            />
            <button 
              type="submit" 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <Command size={14} className="animate-pulse" />
            </button>
          </div>

          {/* Cinematic Loading (Fine Line Growing Left-to-Right) */}
          <AnimatePresence>
            {isCrawling && (
              <div className="absolute left-6 right-6 -bottom-3 h-[1px] bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: `${crawlingProgress}%` }}
                  exit={{ opacity: 0 }}
                  className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  transition={{ ease: 'easeInOut' }}
                />
              </div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Immersive Edge-to-Edge Stream Grid with 1px Pure Black Separators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-black w-full min-h-screen">
        <AnimatePresence initial={false}>
          {trends.map((item, index) => {
            const isHovered = hoveredId === item.id;
            const isAnyHovered = hoveredId !== null;
            const opacity = isAnyHovered ? (isHovered ? 1 : 0.3) : 1;

            // Compute Parallax offset based on scroll and index
            const parallaxY = (scrollY + (index * 120)) * -0.06;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 100, 
                  damping: 30
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative aspect-square md:aspect-[4/5] bg-zinc-950 overflow-hidden cursor-crosshair group select-none"
              >
                {/* Parallax Background Container */}
                <div className="absolute inset-0 w-full h-[120%] -top-[10%] overflow-hidden">
                  <motion.img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale brightness-35 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-700 pointer-events-none"
                    style={{
                      y: parallaxY,
                    }}
                    animate={{
                      scale: isHovered ? 1.02 : 1.0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 100,
                      damping: 30
                    }}
                  />
                </div>

                {/* Subtle dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85 pointer-events-none" />

                {/* Flow Metadata & Details */}
                <div className="absolute inset-0 p-12 flex flex-col justify-between z-10 pointer-events-none">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.3em] font-mono leading-none">
                      {item.category}
                    </span>
                    <span className="text-[9px] font-black uppercase text-white/25 group-hover:text-white/60 transition-colors font-mono">
                      0{index + 1} // CACHED
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl md:text-5xl font-serif font-medium tracking-tighter text-white leading-none">
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

                {/* Subtle active border light */}
                <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Extreme Minimalist Copyright / Meta */}
      <div className="py-24 flex flex-col items-center justify-center opacity-20 text-[8px] tracking-[0.3em] font-mono uppercase">
        <span>METADATA INFRASTRUCTURE — ALL RIGHTS RESERVED</span>
        <span className="mt-2 text-zinc-600">MODAUI NODE v4.26</span>
      </div>
    </div>
  );
};
