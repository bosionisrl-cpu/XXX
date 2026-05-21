import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Settings, Cpu, HardDrive, Sliders, FolderGit, 
  Check, RefreshCw, SlidersHorizontal, Globe, Trash2, 
  ToggleLeft, ShieldAlert, Cpu as CpuIcon, Database
} from 'lucide-react';
import { Language } from '../../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  triggerToast: (msg: string) => void;
  onLangChange?: (lang: Language) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  triggerToast,
  onLangChange
}) => {
  const [activeTab, setActiveTab] = useState<'tryon' | 'hardware' | 'paths'>('tryon');

  // Load state helpers
  const getStored = (key: string, dflt: any) => {
    const val = localStorage.getItem(key);
    if (val === null) return dflt;
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  };

  const setStored = (key: string, val: any) => {
    localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
    // Dispatch custom event to notify listening components
    window.dispatchEvent(new CustomEvent('fashion-settings-update'));
  };

  // Local state synced to localStorage
  const [engineMode, setEngineMode] = useState<'standard' | 'mobile_vton' | 'viton_hd'>(() => getStored('tryon_engine_mode', 'mobile_vton'));
  const [modelWeightsPath, setModelWeightsPath] = useState<string>(() => getStored('tryon_model_weights_path', '/2026_CVPR_Mobile-VTON/VITON-HD/'));
  const [mobileResolution, setMobileResolution] = useState<'512x384' | '1024x768'>(() => getStored('tryon_mobile_resolution', '512x384'));
  const [denseposeWeight, setDenseposeWeight] = useState<number>(() => getStored('tryon_densepose_weight', 85));
  const [agnosticMaskOpacity, setAgnosticMaskOpacity] = useState<number>(() => getStored('tryon_agnostic_mask_opacity', 45));
  const [fitMode, setFitMode] = useState<'loose' | 'fitted' | 'crop'>(() => getStored('tryon_fit_mode', 'fitted'));
  
  // VITON-HD state states
  const [vitonResolution, setVitonResolution] = useState<'256x192' | '512x384' | '1024x768'>(() => getStored('tryon_viton_resolution', '512x384'));
  const [vitonBatchSize, setVitonBatchSize] = useState<number>(() => getStored('tryon_viton_batch_size', 4));
  const [vitonEpochs, setVitonEpochs] = useState<number>(() => getStored('tryon_viton_epochs', 120));
  const [vitonWarpMethod, setVitonWarpMethod] = useState<'TPS' | 'OpticalWarp' | 'DualDecoupled'>(() => getStored('tryon_viton_warp_method', 'TPS'));
  const [vitonDatasetPath, setVitonDatasetPath] = useState<string>(() => getStored('tryon_viton_dataset_path', '/workspace/VITON-HD/datasets'));

  // VRAM model weights state
  const [modelWeights, setModelWeights] = useState<Array<{
    id: string;
    name: string;
    sizeGb: number;
    status: 'loaded' | 'unloaded' | 'loading' | 'unloading';
    category: string;
  }>>(() => getStored('tryon_weights_state', [
    { id: 'tps_warper', name: 'TPS Warping Net (tps_nets.pth)', sizeGb: 1.25, status: 'loaded', category: 'Warping' },
    { id: 'parser_net', name: 'Human Parser Net (alias_seg.pth)', sizeGb: 2.40, status: 'loaded', category: 'Segmentation' },
    { id: 'sam_engine', name: 'Segment Anything Core (sam_vit_h.pth)', sizeGb: 5.60, status: 'unloaded', category: 'Segmentation' },
    { id: 'densepose', name: 'DensePose R_50_FPN (densepose_r50.pth)', sizeGb: 3.10, status: 'loaded', category: 'Alignment' },
    { id: 'gan_synthesis', name: 'GAN Resolution Synthesizer (g_synthesis.pth)', sizeGb: 8.40, status: 'loaded', category: 'Synthesis' }
  ]));

  useEffect(() => {
    // Save to localStorage on any state change
    setStored('tryon_engine_mode', engineMode);
    setStored('tryon_model_weights_path', modelWeightsPath);
    setStored('tryon_mobile_resolution', mobileResolution);
    setStored('tryon_densepose_weight', denseposeWeight);
    setStored('tryon_agnostic_mask_opacity', agnosticMaskOpacity);
    setStored('tryon_fit_mode', fitMode);
    setStored('tryon_viton_resolution', vitonResolution);
    setStored('tryon_viton_batch_size', vitonBatchSize);
    setStored('tryon_viton_epochs', vitonEpochs);
    setStored('tryon_viton_warp_method', vitonWarpMethod);
    setStored('tryon_viton_dataset_path', vitonDatasetPath);
    setStored('tryon_weights_state', modelWeights);
  }, [
    engineMode, modelWeightsPath, mobileResolution, denseposeWeight, 
    agnosticMaskOpacity, fitMode, vitonResolution, vitonBatchSize, 
    vitonEpochs, vitonWarpMethod, vitonDatasetPath, modelWeights
  ]);

  const toggleWeight = (id: string) => {
    setModelWeights(prev => prev.map(w => {
      if (w.id === id) {
        const nextStatus = w.status === 'loaded' ? 'unloaded' : 'loaded';
        triggerToast(`${nextStatus === 'loaded' ? 'ALLOCATED' : 'EVICTED'} WEIGHT: ${w.name}`);
        return { ...w, status: nextStatus };
      }
      return w;
    }));
  };

  const handlePurgeVram = () => {
    triggerToast('FLUSHED GPU ATTENTION CACHE // EMPTY_CACHE()');
  };

  const activeVram = modelWeights
    .filter(w => w.status === 'loaded')
    .reduce((sum, w) => sum + w.sizeGb, 0) + 4.2;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      {/* Dynamic blurred dark backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl cursor-crosshair"
      />

      {/* Main Settings Panel Wrapper */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="relative w-full max-w-4xl h-[640px] bg-[#070709] border border-white/5 rounded-[32px] overflow-hidden flex flex-col shadow-[0_24px_64px_rgba(0,0,0,0.8)] z-10"
      >
        {/* Header Block following minimal spacing */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <Settings size={14} className="text-[#00b8d9]" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white font-mono">
              UNIFIED OPERATIONS CONTROL PANEL // 宇宙全局设置面板
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content Section Split */}
        <div className="flex-1 min-h-0 flex">
          
          {/* Left Categories Sidebar */}
          <div className="w-56 border-r border-white/5 p-4 flex flex-col gap-1.5 bg-[#050506]/50 shrink-0">
            <span className="text-[8px] font-mono font-black text-zinc-650 tracking-[0.2em] block px-3 py-1.5 uppercase">CATEGORIES</span>
            
            <button
              onClick={() => setActiveTab('tryon')}
              className={`w-full px-3 py-2.5 rounded-xl text-left text-[10px] font-mono tracking-wider font-bold transition-all flex items-center gap-2 ${
                activeTab === 'tryon' 
                  ? 'bg-zinc-900 border border-white/5 text-[#00b8d9]' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.01]'
              }`}
            >
              <Cpu size={12} />
              <span>Aura Try-On // 试穿架构</span>
            </button>

            <button
              onClick={() => setActiveTab('hardware')}
              className={`w-full px-3 py-2.5 rounded-xl text-left text-[10px] font-mono tracking-wider font-bold transition-all flex items-center gap-2 ${
                activeTab === 'hardware' 
                  ? 'bg-zinc-900 border border-white/5 text-[#00b8d9]' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.01]'
              }`}
            >
              <HardDrive size={12} />
              <span>VRAM Weights // 显存管理</span>
            </button>

            <button
              onClick={() => setActiveTab('paths')}
              className={`w-full px-3 py-2.5 rounded-xl text-left text-[10px] font-mono tracking-wider font-bold transition-all flex items-center gap-2 ${
                activeTab === 'paths' 
                  ? 'bg-zinc-900 border border-white/5 text-[#00b8d9]' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.01]'
              }`}
            >
              <FolderGit size={12} />
              <span>Model Paths // 权重路径</span>
            </button>
          </div>

          {/* Right Parameters Dashboard Canvas */}
          <div className="flex-1 p-8 overflow-y-auto scrollbar-thin space-y-6">
            
            {activeTab === 'tryon' && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-[11px] font-mono font-black uppercase tracking-widest text-[#00b8d9]">Virtual Try-On Core Config // 穿戴模型推理引擎</h4>
                  <p className="text-[9px] text-zinc-500 font-sans mt-1">Configure active wear rendering networks, guidance tensors and parameters.</p>
                </div>

                {/* 1. Engine Core Selector */}
                <div className="space-y-2">
                  <span className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-zinc-400 block">Active Engine Pipeline // 推理引擎通道</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'mobile_vton', label: 'Mobile-VTON (CVPR 2026)', desc: 'Ultralight weight pose matching' },
                      { id: 'viton_hd', label: 'VITON-HD (Official Core)', desc: 'High-density TPS warping net' },
                      { id: 'standard', label: 'REST API Cloud Driver', desc: 'Secure high-res processing link' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setEngineMode(item.id as any)}
                        className={`p-3.5 rounded-2xl text-left border flex flex-col transition-all cursor-pointer ${
                          engineMode === item.id 
                            ? 'bg-[#00b8d9]/5 border-[#00b8d9] text-[#00b8d9]' 
                            : 'bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/15'
                        }`}
                      >
                        <span className="text-[9.5px] font-mono font-black uppercase tracking-wide">{item.label}</span>
                        <span className="text-[7.5px] text-zinc-500 font-sans mt-1">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  
                  {/* Parameter sliders and configuration based on active engine */}
                  <div className="space-y-4">
                    <span className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-[#00b8d9] block">Guidance & Masks // 引导比重</span>
                    
                    <div className="space-y-2 bg-zinc-950/40 p-4 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center text-[8.5px] font-mono text-zinc-400">
                        <span>DENSEPOSE GUIDANCE INTENSITY</span>
                        <span className="text-[#00b8d9] text-[9.5px] font-bold">{denseposeWeight}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="30" 
                        max="100" 
                        value={denseposeWeight}
                        onChange={(e) => setDenseposeWeight(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/5 appearance-none cursor-pointer accent-[#00b8d9] rounded"
                      />
                      <span className="text-[7px] text-zinc-650 font-mono tracking-wide uppercase mt-1 block">Continuous surface pose guide weight</span>
                    </div>

                    <div className="space-y-2 bg-zinc-950/40 p-4 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center text-[8.5px] font-mono text-zinc-400">
                        <span>AGNOSTIC MASK OPACITY / DILATE</span>
                        <span className="text-[#00b8d9] text-[9.5px] font-bold">{agnosticMaskOpacity}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="90" 
                        value={agnosticMaskOpacity}
                        onChange={(e) => setAgnosticMaskOpacity(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/5 appearance-none cursor-pointer accent-[#00b8d9] rounded"
                      />
                      <span className="text-[7px] text-zinc-650 font-mono tracking-wide uppercase mt-1 block">Agnostic body-mask overlay opacity constraints</span>
                    </div>
                  </div>

                  {/* Settings columns 2 */}
                  <div className="space-y-4">
                    <span className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-[#00b8d9] block">Model Formatting // 廓形格式化</span>
                    
                    <div className="space-y-2.5 bg-zinc-950/40 p-4 rounded-2xl border border-white/5">
                      <span className="text-[8px] font-mono text-zinc-400 block tracking-widest uppercase">Mobile Target Resolution</span>
                      <div className="grid grid-cols-2 gap-2">
                        {['512x384', '1024x768'].map(res => (
                          <button
                            key={res}
                            onClick={() => setMobileResolution(res as any)}
                            className={`py-2 rounded-xl text-[9px] font-mono border transition-all ${
                              mobileResolution === res 
                                ? 'bg-white text-zinc-950 font-bold border-white' 
                                : 'bg-transparent text-zinc-400 border-white/5 hover:border-white/10'
                            }`}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5 bg-zinc-950/40 p-4 rounded-2xl border border-white/5">
                      <span className="text-[8px] font-mono text-zinc-400 block tracking-widest uppercase">FITTING DRAPE MODE // 剪裁尺寸</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['loose', 'fitted', 'crop'].map(fit => (
                          <button
                            key={fit}
                            onClick={() => setFitMode(fit as any)}
                            className={`py-1.5 rounded-xl text-[8.5px] font-mono tracking-widest uppercase transition-all ${
                              fitMode === fit 
                                ? 'bg-[#00b8d9] text-zinc-950 font-black' 
                                : 'bg-zinc-900/60 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {fit}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hardware' && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4 flex justify-between items-end">
                  <div>
                    <h4 className="text-[11px] font-mono font-black uppercase tracking-widest text-[#00b8d9]">Hardware Accelerators // 显存运行矩阵</h4>
                    <p className="text-[9px] text-zinc-500 font-sans mt-0.5">Selective model weight tensor offloading manager to throttle dynamic memory utilization.</p>
                  </div>
                  <button 
                    onClick={handlePurgeVram}
                    className="px-3 py-1.5 bg-[#00b8d9]/15 border border-[#00b8d9]/30 text-[#00b8d9] rounded-xl text-[8px] font-mono tracking-widest uppercase hover:bg-[#00b8d9] hover:text-zinc-950 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw size={10} />
                    Purge Cache
                  </button>
                </div>

                {/* Simulated NVIDIA H100 GPU Bar */}
                <div className="bg-zinc-950/40 p-5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-zinc-400 font-bold uppercase tracking-widest">NVIDIA Tensor Core H100 allocation telemetry</span>
                    <span className="text-[#00b8d9] font-black">{activeVram.toFixed(2)} GB / 80.00 GB ({(activeVram / 80 * 100).toFixed(1)}%)</span>
                  </div>
                  
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-[#00b8d9] rounded-full transition-all duration-700"
                      style={{ width: `${(activeVram / 80 * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Sub components tensor list */}
                <div className="space-y-2">
                  <span className="text-[8.5px] font-mono font-bold uppercase tracking-widest text-zinc-400 block px-1">Sub-Model Weight Registers // 分等模块加载器</span>
                  <div className="space-y-1.5">
                    {modelWeights.map(w => (
                      <div key={w.id} className="flex items-center justify-between p-3.5 bg-zinc-950/60 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-[9.5px] font-mono font-bold text-white">{w.name}</span>
                          <span className="text-[7.5px] text-zinc-500 font-sans tracking-wide mt-0.5">Category: {w.category} // Allocation: {w.sizeGb} GB</span>
                        </div>

                        <button
                          onClick={() => toggleWeight(w.id)}
                          className={`px-3 py-1.5 rounded-lg text-[8px] font-mono uppercase font-black tracking-widest border transition-all ${
                            w.status === 'loaded' 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-white'
                          }`}
                        >
                          {w.status === 'loaded' ? 'Active // 已加载' : 'Offload // 卸载'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'paths' && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h4 className="text-[11px] font-mono font-black uppercase tracking-widest text-[#00b8d9]">System Weight Paths // 模型权重与数据库目录</h4>
                  <p className="text-[9px] text-zinc-500 font-sans mt-1">Designate local server files directories for seamless CVPR tryon pipelines execution.</p>
                </div>

                {/* Path 1: Primary Model weights (Focus: /2026_CVPR_Mobile-VTON/VITON-HD/) */}
                <div className="space-y-2 bg-[#09090c] p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.1em] text-zinc-300">
                      CVPR 2026 TryOn Model Weight Directory // 主要权重库
                    </span>
                    <span className="text-[7px] font-mono text-zinc-500 uppercase">VITON_HD_ROOT</span>
                  </div>
                  
                  <input 
                    type="text" 
                    value={modelWeightsPath}
                    onChange={(e) => setModelWeightsPath(e.target.value)}
                    className="w-full bg-black/60 border border-white/5 hover:border-white/10 focus:border-[#00b8d9]/50 rounded-xl px-4 py-3 text-[10px] font-mono text-zinc-200 outline-none transition-all placeholder:text-zinc-600 shadow-inner"
                    placeholder="/2026_CVPR_Mobile-VTON/VITON-HD/"
                  />
                  <span className="text-[7.5px] text-zinc-500 font-sans block mt-1">
                    Defines the root directory of CVPR Mobile-VTON neural checkpoint vectors and precomputed poses.
                  </span>
                </div>

                {/* Path 2: VITON-HD Datasets */}
                <div className="space-y-2 bg-[#09090c] p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.1em] text-zinc-300">
                      VITON-HD Training Dataset Path // 数据集目录
                    </span>
                    <span className="text-[7px] font-mono text-zinc-500 uppercase">DATASET_ROOT</span>
                  </div>
                  
                  <input 
                    type="text" 
                    value={vitonDatasetPath}
                    onChange={(e) => setVitonDatasetPath(e.target.value)}
                    className="w-full bg-black/60 border border-white/5 hover:border-white/10 focus:border-[#00b8d9]/50 rounded-xl px-4 py-3 text-[10px] font-mono text-zinc-200 outline-none transition-all placeholder:text-zinc-600 shadow-inner"
                    placeholder="/workspace/VITON-HD/datasets"
                  />
                </div>

                {/* Status Box */}
                <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 flex gap-3.5 items-start">
                  <ShieldAlert size={14} className="text-[#00b8d9] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[8px] font-mono font-black uppercase tracking-widest text-[#00b8d9] block">AUTOMATIC POSE INTEGRATION WARNING // 模型对位检测</span>
                    <span className="text-[8px] text-zinc-500 block leading-normal mt-0.5">
                      Changing directories forces immediate reloading of all corresponding UV maps. Unstable parameters can lead to synthetic artifacts. Verify paths compatibility in physical disk volume before processing.
                    </span>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Footer info block */}
        <div className="h-14 border-t border-white/5 bg-[#050506] flex items-center justify-between px-8 text-zinc-650 text-[7px] tracking-[0.25em] font-mono uppercase shrink-0">
          <span>COGNITIVE CORE SYSTEM 2.4.9</span>
          <span>AURA LABS // RUNTIME ENVIRONMENT APPROVED</span>
        </div>

      </motion.div>
    </div>
  );
};
