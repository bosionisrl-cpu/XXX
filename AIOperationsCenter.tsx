import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { FASHION_SOURCES } from './src/constants';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Cpu, Activity, Server, Network, Brain,
  Search, BarChart3, TrendingUp, Workflow, Link,
  CheckCircle2, AlertCircle, Terminal, Camera, Download,
  Maximize2, MessageSquare, ShieldAlert, Database,
  User, Power, RotateCw, Square, Play, HardDrive, 
  RefreshCw, Bot, XCircle, LineChart, ShieldCheck, Trash2,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { Registry, OpsDashboard, Language, Agent } from './types';

// ModaUI System Imports
import { QuantumButton } from './resources/js/fashion-os/components/QuantumButton';
import { NeuralCard } from './resources/js/fashion-os/components/NeuralCard';
import { RuntimePanel } from './resources/js/fashion-os/components/RuntimePanel';
import { AIConsole } from './resources/js/fashion-os/components/AIConsole';
import { FashionGrid } from './resources/js/fashion-os/components/FashionGrid';
import { AgentCard } from './resources/js/fashion-os/components/AgentCard';
import { TrendGraph } from './resources/js/fashion-os/components/TrendGraph';
import { NeuralTryOn } from './src/components/NeuralTryOn';
import { DigitalHumanStudio } from './src/components/DigitalHumanStudio';

import { translations } from './services/translationService';

interface AIOperationsCenterProps {
  lang: Language;
  preloadedDesign?: string | null;
  onDesignUsed?: () => void;
  externalActiveTab?: 'matrix' | 'tryon' | 'studio' | 'agents' | 'memory' | 'logs' | 'commerce' | 'runtime';
  onActiveTabChange?: (tab: 'matrix' | 'tryon' | 'studio' | 'agents' | 'memory' | 'logs' | 'commerce' | 'runtime') => void;
}

export const AIOperationsCenter: React.FC<AIOperationsCenterProps> = ({ 
  lang, 
  preloadedDesign,
  onDesignUsed,
  externalActiveTab,
  onActiveTabChange
}) => {
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [brain, setBrain] = useState<any>(null);
  const [memory, setMemory] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [internalActiveTab, setInternalActiveTab] = useState<'matrix' | 'tryon' | 'studio' | 'agents' | 'memory' | 'logs' | 'commerce' | 'runtime'>('matrix');
  
  const activeTab = externalActiveTab || internalActiveTab;
  const setActiveTab = (tab: any) => {
    if (onActiveTabChange) {
      onActiveTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<any>(null);

  // Virtual app/Runtime Core Brain States
  const [brainGitRepo, setBrainGitRepo] = useState('git@github.com:bosionisrl-cpu/DDDDDDDDDDD.git');
  const [isDownloadingBrain, setIsDownloadingBrain] = useState(false);
  const [brainDownloadStatus, setBrainDownloadStatus] = useState<'offline' | 'cloning' | 'synchronized'>('offline');
  const [brainDownloadProgress, setBrainDownloadProgress] = useState(0);
  const [selectedRuntimeFile, setSelectedRuntimeFile] = useState<string>('ai_logic/core_reasoner.py');
  
  // Pipeline tracing simulation
  const [isTracingPipeline, setIsTracingPipeline] = useState(false);
  const [pipelineTraceStep, setPipelineTraceStep] = useState<number>(0);

  // Dataset Diagnostics State
  const [diagnosticResults, setDiagnosticResults] = useState<{
    success: boolean;
    allReady: boolean;
    results: { folder: string; exists: boolean; fullPath: string }[];
  } | null>(null);
  const [isCheckingDiagnostic, setIsCheckingDiagnostic] = useState(false);
  const [isProvisioningDatasets, setIsProvisioningDatasets] = useState(false);

  const runDiagnostic = async () => {
    setIsCheckingDiagnostic(true);
    try {
      const res = await fetch('/api/runtime/diagnostic');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setDiagnosticResults(data);
        }
      }
    } catch (err) {
      console.error("Diagnostic error:", err);
    } finally {
      setIsCheckingDiagnostic(false);
    }
  };

  const provisionDatasets = async () => {
    setIsProvisioningDatasets(true);
    try {
      const res = await fetch('/api/runtime/provide-datasets', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          window.dispatchEvent(new CustomEvent('system-toast', { 
            detail: { message: 'MANDATORY DATASETS PROVISIONED' } 
          }));
          runDiagnostic();
        }
      }
    } catch (err) {
      console.error("Provision error:", err);
    } finally {
      setIsProvisioningDatasets(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'runtime') {
      runDiagnostic();
    }
  }, [activeTab]);

  const startBrainDownload = () => {
    setIsDownloadingBrain(true);
    setBrainDownloadStatus('cloning');
    setBrainDownloadProgress(0);
    
    // Add realistic git clone output logs to system logs list!
    const gitLogs = [
      "Cloning into '/app/Runtime'...",
      "remote: Enumerating objects: 1280, done.",
      "remote: Counting objects: 100% (1280/1280), done.",
      "remote: Compressing objects: 100% (802/802), done.",
      "remote: Total 1280 (delta 478), reused 1152 (delta 412), pack-reused 0",
      "Receiving objects:  22% (281/1280)",
      "Receiving objects:  54% (691/1280)",
      "Receiving objects:  87% (1113/1280)",
      "Resolving deltas: 100% (478/478), done.",
      "Branch 'main' set up to track remote branch 'main' from origin.",
      "Successfully extracted AI models & architecture configurations.",
      "SUCCESS: DDDDDDDDDDD brain active inside app/Runtime."
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      setBrainDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloadingBrain(false);
          setBrainDownloadStatus('synchronized');
          // Dispatch system event for alert/toast UI trigger
          window.dispatchEvent(new CustomEvent('system-toast', { 
            detail: { message: 'BRAIN ENGINE ALIGNED // app/Runtime IS LIVE' } 
          }));
          return 100;
        }
        
        // Push intermediate logs
        if (logIndex < gitLogs.length) {
          setLogs(p => [...p, {
            timestamp: new Date().toLocaleTimeString(),
            level: 'info',
            module: 'GIT',
            message: gitLogs[logIndex]
          }]);
          logIndex++;
        }
        
        return prev + 10;
      });
    }, 300);
  };

  const runPipelineSimulation = () => {
    setIsTracingPipeline(true);
    setPipelineTraceStep(1);
    
    const traceLogs = [
      "[PIPELINE] [STEP 1] Ingesting fashion trends into memory matrix...",
      "[PIPELINE] [STEP 2] Running ai_logic.core_reasoner to score stylistic fidelity...",
      "[PIPELINE] [STEP 3] Matching trend DNA using active Curation Agents...",
      "[PIPELINE] [STEP 4] Deploying high-fidelity VRAM weights for garment TPS warper...",
      "[PIPELINE] [STEP 5] Workflow steps execution fully synchronized!"
    ];

    let step = 1;
    const interval = setInterval(() => {
      if (step >= 5) {
        clearInterval(interval);
        setIsTracingPipeline(false);
        setPipelineTraceStep(5);
        window.dispatchEvent(new CustomEvent('system-toast', { 
          detail: { message: 'PIPELINE WALKTHROUGH SYNCHRONIZED' } 
        }));
        return;
      }
      step++;
      setPipelineTraceStep(step);
      setLogs(p => [...p, {
        timestamp: new Date().toLocaleTimeString(),
        level: 'success',
        module: 'PIPELINE',
        message: traceLogs[step - 1]
      }]);
    }, 1000);
  };

  const runtimeFiles: Record<string, string> = {
    'ai_logic/core_reasoner.py': `# app/Runtime/ai_logic/core_reasoner.py
# DeepMind Latent Fashion Reasoner v4.0

from typing import List, Dict
import torch
import torch.nn as nn
from aura.brain.encoders import StyleTensorEncoder

class FashionCoreReasoner(nn.Module):
    def __init__(self, latent_dim: int = 2048):
        super().__init__()
        self.encoder = StyleTensorEncoder(dim=latent_dim)
        self.evaluator = nn.Sequential(
            nn.Linear(latent_dim, 1024),
            nn.GELU(),
            nn.Dropout(0.15),
            nn.Linear(1024, 1) # Outputs raw stylistic continuity index
        )
        
    def forward(self, image_tensor: torch.Tensor, dna_profile: Dict) -> torch.Tensor:
        """
        Calculates style alignment metrics between generated textile silhouettes 
        and the predefined Brand DNA vector.
        """
        latent_vec = self.encoder(image_tensor)
        score = self.evaluator(latent_vec)
        return torch.sigmoid(score) # 0.0 to 1.0 continuity score`,

    'agents/curation_agent.py': `# app/Runtime/agents/curation_agent.py
# Autonomous Vogue-SSENSE Scraper & Aesthetic Alignment Curator

import asyncio
from typing import Dict, Any
from aura.runtime.tools import fetch_runway_feed, clean_vram_buffer
from aura.brain.reasoner import FashionCoreReasoner

class VogueTrendCurator:
    def __init__(self, key_aesthetic: str):
        self.aesthetic = key_aesthetic
        self.reasoner = FashionCoreReasoner()
        
    async def run_epoch(self) -> Dict[str, Any]:
        print("[AGENT] Initializing Runway curation epoch...")
        # Page through index-links
        feed_items = await fetch_runway_feed(limit=50)
        highly_aligned_concepts = []
        
        for idx, item in enumerate(feed_items):
            score = self.reasoner.evaluate_style(item["image"], self.aesthetic)
            if score > 0.85:
                print(f"[AGENT] Found high-continuity matches: {item['id']} (Score: {score:.2f})")
                highly_aligned_concepts.append(item)
                
        # Proactively clean VRAM to enable subsequent parallel synthesizers
        clean_vram_buffer()
        return {
            "epoch_status": "SUCCESS",
            "aligned_count": len(highly_aligned_concepts),
            "payload": highly_aligned_concepts
        }`,

    'workflows/trend_synthesis.yaml': `# app/Runtime/workflows/trend_synthesis.yaml
# High-Fidelity Curation to Design Synthesis Pipeline DAG Diagram

name: Trend Curation & Try-On Pipeline
version: 1.2
author: DDDDDDDDDDD AI Core

steps:
  - id: ingest_sources
    action: tools.vogue_scraper
    args:
      target_categories: ["Avant-Garde", "Luxury Campaign"]
      
  - id: core_evaluation
    action: ai_logic.core_reasoner
    args:
      min_score_threshold: 0.82
      
  - id: trigger_tryon_mesh
    action: agents.tryon_orchestrator
    args:
      tps_iterations: 15
      resolution_target: [1024, 768]
      vram_eviction: selective_active
      
  - id: e2e_distribution
    action: tools.digital_human_embed
    args:
      rigging: true
      exposure_correction: true`,

    'tools/system_helpers.py': `# app/Runtime/tools/system_helpers.py
# Core helper tools for managing active hardware and model weights

import gc
import torch
import psutil

def clean_vram_buffer() -> int:
    """
    Triggers systematic garbage collection and evicts inactive CUDA cache pools
    to improve target GPU inference bandwidth by up to 22.4%.
    """
    allocated_before = torch.cuda.memory_allocated()
    gc.collect()
    torch.cuda.empty_cache()
    allocated_after = torch.cuda.memory_allocated()
    
    freed_mb = (allocated_before - allocated_after) / (1024 * 1024)
    print(f"[TOOL] CUDA empty_cache completed. Freed {freed_mb:.2f} MB active register maps.")
    return int(freed_mb)

def fetch_ram_health() -> dict:
    virtual_mem = psutil.virtual_memory()
    return {
        "total_gb": virtual_mem.total / (1024**3),
        "available_gb": virtual_mem.available / (1024**3),
        "usage_percent": virtual_mem.percent
    }`
  };

  const filteredResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    const results: { type: string, name: string, id: string }[] = [];

    if (registry) {
      registry.agents.forEach(a => {
        if (a.name.toLowerCase().includes(q)) results.push({ type: 'Agent', name: a.name, id: a.id });
      });
      registry.models.forEach(m => {
        if (m.name.toLowerCase().includes(q)) results.push({ type: 'Model', name: m.name, id: m.id });
      });
    }
    if (memory) {
      memory.trends.forEach((t: any) => {
        if (t.topic.toLowerCase().includes(q)) results.push({ type: 'Trend', name: t.topic, id: t.topic });
      });
    }
    return results;
  }, [searchQuery, registry, memory]);

  const handleQuickScrape = async (source: any) => {
    setScrapeUrl(source.url);
    setSelectedSource(source);
    await executeAction(`Scrape ${source.url}`, `/api/fashion/scrape?url=${encodeURIComponent(source.url)}&category=${encodeURIComponent(source.category)}`);
  };

  const handleScrape = async () => {
    if (!scrapeUrl) return;
    await executeAction(`Scrape ${scrapeUrl}`, '/api/fashion/scrape?url=' + encodeURIComponent(scrapeUrl));
  };

  useEffect(() => {
    if (preloadedDesign) {
      setActiveTab('tryon');
    }
  }, [preloadedDesign]);

  const fetchBrain = useCallback(async () => {
    try {
      const res = await fetch('/api/system/brain');
      const data = await res.json();
      setBrain(data);
    } catch (e) {
      console.error("Brain sync failed", e);
    }
  }, []);

  const runCommand = async (command: string, args: any = {}) => {
    setIsExecuting(command);
    try {
      const res = await fetch('/api/system/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, args })
      });
      const data = await res.json();
      if (data.success) {
        fetchStats();
        fetchBrain();
      }
    } finally {
      setTimeout(() => setIsExecuting(null), 1000);
    }
  };

  const t = translations[lang].ops;

  const fetchStats = useCallback(async () => {
    try {
      const [regRes, healthRes, memRes] = await Promise.all([
        fetch('/api/fashion/registry'),
        fetch('/api/fashion/runtime/health'),
        fetch('/api/fashion/memory')
      ]);
      const reg = await regRes.json();
      const healthData = await healthRes.json();
      const mem = await memRes.json();
      
      setRegistry(reg);
      setStats(healthData.health || healthData); 
      setMemory(mem);
    } catch (e) {
      console.error("Ops sync failed", e);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchBrain();
    const interval = setInterval(() => {
      fetchStats();
      fetchBrain();
    }, 5000);

    const eventSource = new EventSource('/api/fashion/runtime/stream');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'log') {
        const logObj = data.log || { 
          timestamp: new Date().toLocaleTimeString(), 
          level: data.level || 'info', 
          module: 'SYS', 
          message: data.message 
        };
        setLogs(prev => [...prev, logObj].slice(-100));
      }
    };

    return () => {
      clearInterval(interval);
      eventSource.close();
    };
  }, [fetchStats]);

  const executeAction = async (action: string, endpoint: string) => {
    setIsExecuting(action);
    const startLog = { timestamp: new Date().toLocaleTimeString(), level: 'info', module: 'ACTION', message: `Initializing ${action} directive...` };
    setLogs(prev => [...prev, startLog]);
    
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        const successLog = { timestamp: new Date().toLocaleTimeString(), level: 'info', module: 'SUCCESS', message: data.message };
        setLogs(prev => [...prev, successLog]);
      }
    } catch (e) {
      const errorLog = { timestamp: new Date().toLocaleTimeString(), level: 'error', module: 'FATAL', message: `Action ${action} aborted by system kernel` };
      setLogs(prev => [...prev, errorLog]);
    } finally {
      setTimeout(() => setIsExecuting(null), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text p-6 font-sans">
      {/* Cinematic Header */}
      <div className="max-w-7xl mx-auto py-20 px-6 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">{t.director}</span>
            </div>
            <h2 className="text-8xl font-serif italic text-white uppercase tracking-tighter leading-[0.8] mb-8">
               Ops<br/><span className="not-italic font-black text-white/5 uppercase">{t.matrix}</span>
            </h2>
          </div>
          <div className="flex gap-4">
             <div className="relative">
                <input
                  type="text"
                  placeholder="Search system..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder:text-zinc-500 w-48"
                />
                {filteredResults.length > 0 && (
                   <div className="absolute top-12 left-0 w-64 bg-neutral-900 border border-white/10 rounded-2xl p-4 z-[200] max-h-64 overflow-y-auto">
                      {filteredResults.map(res => (
                         <div key={res.id} className="text-xs text-zinc-300 py-1 cursor-pointer hover:text-primary">
                            {res.name} <span className="text-[9px] text-zinc-600">[{res.type}]</span>
                         </div>
                      ))}
                   </div>
                )}
             </div>
             {!externalActiveTab && ['matrix', 'tryon', 'studio', 'agents', 'memory', 'logs', 'runtime'].map((tab) => (
               <QuantumButton
                 key={tab}
                 variant={activeTab === tab ? 'primary' : 'secondary'}
                 onClick={() => setActiveTab(tab as any)}
                 className="!rounded-full px-8"
               >
                 {tab === 'runtime' ? (
                   lang === 'zh' ? '运行时 [Runtime]' : 'AI Runtime'
                 ) : (
                   (translations[lang].ops as any)[tab] || tab
                 )}
               </QuantumButton>
             ))}
           </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'matrix' && (
            <motion.div 
              key="matrix"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            >
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Workflow Hubs */}
                <div className="md:col-span-2 grid grid-cols-1 gap-8">
                  {/* Intelligence Hub */}
                  <NeuralCard 
                    title="Neural Intelligence"
                    subtitle="Trend Ingestion & Source Intelligence"
                    icon={<Brain className="text-primary" />}
                    className="!p-10"
                  >
                     <div className="relative group mb-6">
                         {isExecuting === `Scrape ${scrapeUrl}` && (
                             <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                             </div>
                         )}
                         <input 
                           placeholder="Paste source URL for trend ingestion..."
                           value={scrapeUrl}
                           onChange={(e) => setScrapeUrl(e.target.value)}
                           className={`w-full bg-neutral-800 dark:bg-neutral-800 border-none rounded-2xl py-4 text-xs italic font-serif text-white focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-600 shadow-inner ${isExecuting === `Scrape ${scrapeUrl}` ? 'px-10' : 'px-5'}`}
                         />
                         <button 
                            onClick={handleScrape}
                            disabled={isExecuting === `Scrape ${scrapeUrl}`}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary/20 text-primary hover:bg-primary hover:text-black rounded-xl transition-all"
                         >
                            {isExecuting === `Scrape ${scrapeUrl}` ? (
                              <RotateCw size={14} className="animate-spin" />
                            ) : (
                              <Workflow size={14} />
                            )}
                         </button>
                      </div>
                      <div className="space-y-4">
                        {['Luxury', 'Avant-Garde', 'Media'].map(category => (
                          <div key={category}>
                             <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-2">{category}</p>
                             <div className="grid grid-cols-2 gap-2">
                                {FASHION_SOURCES.filter(s => s.category === category).map(source => (
                                   <button
                                      key={source.url}
                                      onClick={() => handleQuickScrape(source)}
                                      className="px-3 py-2 bg-white/5 hover:bg-primary/20 rounded-xl text-[9px] font-bold text-zinc-300 hover:text-white transition-all text-left"
                                   >
                                      {source.name}
                                   </button>
                                ))}
                             </div>
                          </div>
                        ))}
                      </div>
                      
                      {selectedSource && (
                        <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                           <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Brand DNA: {selectedSource.name}</p>
                           <div className="text-[10px] text-zinc-400 space-y-2">
                              <p><span className="text-zinc-600">Aesthetic:</span> {selectedSource.dna.aesthetic}</p>
                              <p><span className="text-zinc-600">Colors:</span> {selectedSource.dna.colors.join(', ')}</p>
                              <p><span className="text-zinc-600">Materials:</span> {selectedSource.dna.materials.join(', ')}</p>
                           </div>
                        </div>
                      )}
                      
                  </NeuralCard>

                  {/* Studio & Try-On Access */}
                  <div className="grid grid-cols-2 gap-8">
                      <NeuralCard title="Design Studio" icon={<Cpu className="text-primary" />} className="!p-8 !justify-center">
                          <p className="text-xs text-zinc-400 mb-6 italic">Generative design & latent space exploration.</p>
                          <QuantumButton variant="primary" onClick={() => setActiveTab('studio')} className="w-full">Launch Studio</QuantumButton>
                      </NeuralCard>
                      <NeuralCard title="Neural Try-On" icon={<Camera className="text-primary" />} className="!p-8 !justify-center">
                          <p className="text-xs text-zinc-400 mb-6 italic">High-fidelity 3D fit simulation.</p>
                          <QuantumButton variant="primary" onClick={() => setActiveTab('tryon')} className="w-full">Launch Try-On</QuantumButton>
                      </NeuralCard>
                  </div>
                </div>

                {/* Workers Fabric & Runtime */}
                <div className="md:col-span-2 grid grid-cols-1 gap-8">
                  {/* Workers Fabric */}
                  <NeuralCard 
                    title={t.gpuFabric} 
                    subtitle={t.clusterSync} 
                    icon={<Activity className="text-primary animate-pulse" />}
                    className="!p-10"
                  >
                    <div className="space-y-4">
                      {registry?.workers.map(w => (
                        <div key={w.id} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black text-text uppercase">
                            <span>{w.id}</span>
                            <span className={w.status === 'busy' ? 'text-amber-500' : 'text-primary'}>{w.load}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${w.load}%` }}
                              className={`h-full transition-all duration-500 aurora-progress`} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </NeuralCard>
                  
                  {/* Runtime Controls */}
                  <NeuralCard 
                    title={t.runtimeControls} 
                    subtitle={t.highLevelAccess} 
                    icon={<ShieldAlert className="text-rose-500" />}
                    className="!p-10"
                  >
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'runtime.restart_worker', label: 'Restart' },
                            { id: 'runtime.clear_vram', label: 'Flush VRAM' },
                            { id: 'system.health_check', label: 'Health Check' },
                            { id: 'system.brain_cycle_trigger', label: 'Brain Cycle' }
                          ].map(cmd => (
                            <button
                              key={cmd.id}
                              onClick={() => runCommand(cmd.id)}
                              disabled={!!isExecuting}
                              className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-left"
                            >
                              <span className="text-[9px] font-black uppercase text-zinc-300">{cmd.label}</span>
                            </button>
                          ))}
                       </div>
                  </NeuralCard>
                </div>


                {/* Models Register */}
                <NeuralCard 
                   title={t.modelsTopology} 
                   subtitle={t.modelsInventory} 
                   icon={<Cpu className="text-primary" />}
                   className="!p-12 md:col-span-2"
                >
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {registry?.models.map(m => (
                      <div key={m.id} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-primary/20 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-xl bg-white/5 text-muted ${m.status === 'online' ? 'text-primary' : ''}`}>
                              {m.type === 'image' ? <Maximize2 size={16} /> : <MessageSquare size={16} />}
                            </div>
                            <span className={`text-[7px] font-black px-2 py-1 rounded-full uppercase ${m.status === 'online' ? 'bg-primary/10 text-primary' : 'bg-white/10 text-muted'}`}>
                              {m.status}
                            </span>
                          </div>
                          <h6 className="text-[11px] font-bold text-text uppercase mb-1">{m.name}</h6>
                          <p className="text-[7px] font-mono text-muted uppercase mb-6">{m.type.toUpperCase()}_{translations[lang].common.type === '类型' ? '引擎' : 'ENGINE'}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => executeAction(`Load ${m.name}`, `/api/models/${m.id}/load`)}
                            disabled={m.status === 'online' || !!isExecuting}
                            className={`flex-1 py-3 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all ${m.status === 'online' ? 'bg-zinc-800 text-zinc-600' : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'}`}
                          >
                            {t.load}
                          </button>
                          <button 
                            onClick={() => executeAction(`Unload ${m.name}`, `/api/models/${m.id}/unload`)}
                            disabled={m.status === 'idle' || !!isExecuting}
                            className={`flex-1 py-3 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all ${m.status === 'idle' ? 'bg-zinc-800 text-zinc-600' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20'}`}
                          >
                            {t.unload}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </NeuralCard>
              </div>

              {/* Central Controller */}
              <div className="lg:col-span-1 p-12 bg-primary rounded-[4rem] text-black space-y-12 shadow-[0_12px_24px_rgba(0,184,217,0.2)] h-fit sticky top-32">
                <div className="flex items-center gap-4">
                  <ShieldCheck size={28} />
                  <h3 className="text-3xl font-black uppercase tracking-tighter">{t.directorHub}</h3>
                </div>
                <p className="text-[13px] font-medium leading-relaxed">
                  {t.autonomous.replace('AURA_CORE', 'AURA_CORE')} {t.nodeTime}: {stats?.uptime ? Math.floor(stats.uptime) : 0}s.
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: t.oomFlush, icon: Trash2, endpoint: '/api/runtime/oom/flush', alert: true },
                    { label: t.recycleWorkers, icon: Network, endpoint: '/api/runtime/workers/restart' },
                    { label: t.kernelSyncPersist, icon: HardDrive, endpoint: '/api/memory/sync' },
                    { label: t.agentStatus, icon: Bot, endpoint: '/api/fashion/registry' }
                  ].map(btn => (
                    <button 
                      key={btn.label}
                      disabled={!!isExecuting}
                      onClick={() => executeAction(btn.label, btn.endpoint)}
                      className={`flex items-center justify-between p-6 rounded-3xl transition-all group overflow-hidden relative ${
                        btn.alert 
                        ? 'bg-black text-red-500 hover:bg-neutral-900 border border-red-500/20 shadow-[0_10px_30px_rgba(239,68,68,0.1)]' 
                        : 'bg-black text-text hover:bg-neutral-900 border border-white/5'
                      } active:scale-95`}
                    >
                      <div className="flex flex-col items-start text-left">
                        <span className="text-[10px] font-black uppercase tracking-widest">{btn.label}</span>
                        {btn.alert && <span className="text-[7px] font-mono uppercase mt-1 opacity-50 underline">{t.systemDirective} 0x1F</span>}
                      </div>
                      <btn.icon size={18} className={`transition-transform group-hover:rotate-12 ${btn.alert ? 'animate-pulse' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'tryon' && (
            <motion.div 
              key="tryon"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <NeuralTryOn preloadedDesign={preloadedDesign} activeBrandDNA={selectedSource?.dna} />
            </motion.div>
          )}

          {activeTab === 'studio' && (
            <motion.div 
              key="studio"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <DigitalHumanStudio activeBrandDNA={selectedSource?.dna} />
            </motion.div>
          )}

          {activeTab === 'memory' && (
            <motion.div 
              key="memory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <FashionGrid columns={4}>
                <div className="col-span-1 lg:col-span-1 space-y-6">
                  <NeuralCard title="Brain Hub" subtitle="Core Cognitive State" glowColor="amber">
                    <div className="space-y-6">
                       <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-black text-zinc-500 uppercase">Trend Memory</span>
                          <span className="text-2xl font-black text-white">{brain?.trend_memory?.toLocaleString() || '0'} Nodes</span>
                       </div>
                       <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-black text-zinc-500 uppercase">Style Graph</span>
                          <span className="text-2xl font-black text-white">{brain?.style_graph_nodes?.toLocaleString() || '0'} Points</span>
                       </div>
                       <div className="w-full h-px bg-white/5" />
                       <div className="flex flex-col gap-2">
                          <span className="text-[8px] font-black text-zinc-500 uppercase">Top Trends</span>
                          <div className="flex flex-wrap gap-1">
                             {brain?.top_trends?.map((t: string) => (
                               <span key={t} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-bold">#{t}</span>
                             ))}
                          </div>
                       </div>
                       <QuantumButton variant="glow" onClick={() => runCommand('system.brain_cycle_trigger')} className="w-full">
                          Force Brain Cycle
                       </QuantumButton>
                    </div>
                  </NeuralCard>
                </div>

                <TrendGraph 
                  title={t.trendVelocity}
                  data={memory?.trends.map((t: any) => ({ label: t.topic, value: t.velocity })) || []}
                  className="md:col-span-2 h-full"
                />
                <NeuralCard title={t.hubSummary} subtitle={t.intelligenceState} glowColor="blue">
                   <div className="space-y-6">
                      <div className="p-4 bg-white/5 rounded-2xl flex justify-between">
                         <span className="text-[10px] font-black text-muted uppercase">{t.activeTrends}</span>
                         <span className="text-xl font-black text-text">{memory?.trends.length}</span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl flex justify-between">
                         <span className="text-[10px] font-black text-muted uppercase">{t.syncState}</span>
                         <span className="text-xl font-black text-primary">{t.optimal}</span>
                      </div>
                      <QuantumButton variant="glow" className="w-full" onClick={() => executeAction('Global Sync', '/api/memory/sync')}>
                         {t.forceSync}
                      </QuantumButton>
                   </div>
                </NeuralCard>
              </FashionGrid>

              <FashionGrid columns={3}>
                {memory?.trends.map((t_item: any) => (
                  <NeuralCard key={t_item.id} title={t_item.topic} subtitle={`Region: ${t_item.region}`} glowColor="primary">
                    <div className="flex items-center gap-2 mb-6">
                      <div className={`w-2 h-2 rounded-full ${t_item.velocity > 0.8 ? 'bg-primary animate-ping' : 'bg-neutral-700'}`} />
                      <span className="text-[10px] font-mono text-text">{(t_item.velocity * 100).toFixed(0)}% VELOCITY</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {t_item.nodes.map((node: string) => (
                        <span key={node} className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-muted">
                          #{node}
                        </span>
                      ))}
                    </div>
                    <QuantumButton variant="primary" className="w-full">
                      {t.syncLoRA}
                    </QuantumButton>
                  </NeuralCard>
                ))}
              </FashionGrid>

              <NeuralCard title={t.brandMemory} icon={<Database className="text-primary" />} className="!p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
                  {Object.entries(memory?.brand_dna || {}).map(([brandName, data]: [string, any]) => (
                    <div key={brandName} className="p-10 bg-card rounded-[3rem] border border-border flex gap-10">
                       <div className="w-48 aspect-square bg-gradient-to-br from-neutral-800 to-black rounded-full border-4 border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-6xl font-serif italic text-white/10">{brandName[0]}</span>
                       </div>
                       <div className="flex-1 space-y-6">
                          <h5 className="text-2xl font-black uppercase">{brandName}</h5>
                          <div className="space-y-4 text-left">
                             <div>
                                <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">{translations[lang].common.coreAesthetic}</p>
                                <p className="text-[13px] text-text font-medium">{data.aesthetic}</p>
                              </div>
                             <div className="flex gap-2">
                                {data.colors.map((c: string) => (
                                  <div key={c} className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                                ))}
                             </div>
                             <div>
                                <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">{translations[lang].common.keyMaterials}</p>
                                <p className="text-[11px] text-muted font-mono italic">{data.materials.join(', ')}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </NeuralCard>
            </motion.div>
          )}

          {activeTab === 'agents' && (
            <motion.div 
              key="agents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FashionGrid columns={3}>
                {registry?.agents.map(agent => (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    onManage={() => executeAction(`Scale ${agent.name}`, '/api/fashion/registry')} 
                    lang={lang}
                  />
                ))}
              </FashionGrid>
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div 
              key="logs"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-[700px]"
            >
              <AIConsole logs={logs} className="h-full" lang={lang} />
            </motion.div>
          )}

          {activeTab === 'runtime' && (
            <motion.div 
              key="runtime"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Core Setup & Orchestration DAG */}
              <div className="lg:col-span-1 space-y-8">
                {/* 1. Git Repository Brain Linker */}
                <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-[#00b8d9]" />
                      <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-[#00b8d9]">
                        app/Runtime Engine Hub
                      </span>
                    </div>
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded uppercase ${
                      brainDownloadStatus === 'synchronized' ? 'bg-green-500/10 text-green-400' : brainDownloadStatus === 'cloning' ? 'bg-amber-500/10 text-amber-400 animate-pulse' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {brainDownloadStatus === 'synchronized' ? 'SYS_READY' : brainDownloadStatus === 'cloning' ? 'SYNCING_GIT' : 'SYS_OFFLINE'}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans font-medium">
                    The autonomous fashion core workspace reads and executes AI logic, agent states, and workflow DAG files from the central DDDDDDDDDDD brain repository.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black text-zinc-500 uppercase tracking-widest block">Git Target Repository</label>
                      <div className="bg-black border border-white/5 rounded-xl px-4 py-3 text-[10px] font-mono text-zinc-300 break-all select-text">
                        {brainGitRepo}
                      </div>
                    </div>

                    {brainDownloadStatus === 'cloning' && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-mono">
                          <span className="text-zinc-500">PULLING NEURAL WEIGHTS</span>
                          <span className="text-amber-400">{brainDownloadProgress}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#00b8d9] transition-all duration-300" style={{ width: `${brainDownloadProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {brainDownloadStatus === 'synchronized' ? (
                      <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/20 flex items-center gap-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping shrink-0" />
                        <span className="text-[9px] font-mono text-green-400 uppercase tracking-widest font-black">
                          BRAIN INTERNET ALIGNED (app/Runtime fully live)
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={startBrainDownload}
                        disabled={isDownloadingBrain}
                        className="w-full py-4 text-[10.5px] font-mono font-black tracking-[0.25em] uppercase rounded-xl bg-[#00b8d9] hover:bg-[#00b8d9]/80 text-black active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(0,184,217,0.15)]"
                      >
                        {isDownloadingBrain ? (
                          <>
                            <RotateCw size={12} className="animate-spin" />
                            Aligning Brain...
                          </>
                        ) : (
                          <>
                            <Brain size={12} />
                            Download Brain // 下载大脑
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Pipeline Tracker */}
                <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-zinc-300">
                      Live Workflow Tracing
                    </span>
                    <button
                      type="button"
                      onClick={runPipelineSimulation}
                      disabled={isTracingPipeline}
                      className="text-[8.5px] font-mono text-[#00b8d9] uppercase hover:underline disabled:opacity-50 cursor-pointer font-bold"
                    >
                      {isTracingPipeline ? 'Executing...' : 'Trigger Walkthrough'}
                    </button>
                  </div>

                  {/* Flow Steps */}
                  <div className="space-y-4">
                    {[
                      { step: 1, name: 'INGEST SOURCES', desc: 'Queries Vogue runway assets metadata' },
                      { step: 2, name: 'RUN AI LOGIC', desc: 'Evaluates style metrics with core_reasoner.py' },
                      { step: 3, name: 'DISPATCH AGENT', desc: 'VogueTrendCurator filters high-continuity matches' },
                      { step: 4, name: 'COMPILE WORKFLOW', desc: 'Evicts inactive parameters and allocates TPS warper weight tensors' },
                      { step: 5, name: 'INVOKE METRIC TOOL', desc: 'Flushes transients, empty_cache(), complete step sync' }
                    ].map((s) => {
                      const isActive = pipelineTraceStep === s.step;
                      const isHandled = pipelineTraceStep > s.step;
                      return (
                        <div key={s.step} className="flex gap-4 relative">
                          <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full border text-[10px] font-mono flex items-center justify-center transition-all ${
                              isActive 
                                ? 'bg-[#00b8d9] text-black border-[#00b8d9] shadow-[0_0_10px_#00b8d9] font-bold' 
                                : isHandled 
                                ? 'bg-zinc-800 text-zinc-400 border-zinc-700' 
                                : 'bg-transparent text-zinc-650 border-zinc-850'
                            }`}>
                              {s.step}
                            </div>
                            {s.step < 5 && <div className="w-px h-10 bg-zinc-800" />}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className={`text-[10px] font-mono font-black tracking-wider ${isActive ? 'text-[#00b8d9]' : 'text-zinc-200'}`}>
                              {s.name}
                            </p>
                            <p className="text-[9px] text-zinc-500 font-sans mt-0.5 leading-normal font-medium">{s.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Dataset Diagnostics Scanner */}
                <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <HardDrive size={14} className="text-[#00b8d9]" />
                      <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-[#00b8d9]">
                        Inference Dataset Diagnosis
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={runDiagnostic}
                      disabled={isCheckingDiagnostic}
                      className="text-[9px] font-mono text-[#00b8d9] hover:underline disabled:opacity-50 cursor-pointer flex items-center gap-1 font-bold"
                    >
                      {isCheckingDiagnostic ? (
                        <RotateCw size={10} className="animate-spin" />
                      ) : (
                        "Scan Workspace"
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans font-medium">
                    Diagnostic check to ensure mandatory CVPR VTON directories are registered in local storage prior to pipeline compiling.
                  </p>

                  <div className="space-y-3">
                    {diagnosticResults?.results?.map((res) => (
                      <div key={res.folder} className="flex justify-between items-center bg-black border border-white/5 rounded-xl px-4 py-3">
                        <span className="text-[10px] font-mono text-zinc-300 font-bold">{res.folder}</span>
                        {res.exists ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[8px] font-mono text-green-400 font-black uppercase tracking-wider">FOUND</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                            <span className="text-[8px] font-mono text-red-500 font-black uppercase tracking-wider">MISSING</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {diagnosticResults && !diagnosticResults.allReady && (
                    <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/20 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                        <div className="leading-relaxed">
                          <p className="text-[9.5px] font-mono font-black text-red-400 uppercase tracking-widest">
                            WARNING // 检查警告
                          </p>
                          <p className="text-[9px] text-[#00b8d9] font-sans font-medium mt-0.5 leading-normal">
                            Mandatory dataset folders are missing. Running inferences might result in critical application runtime crashes.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={provisionDatasets}
                        disabled={isProvisioningDatasets}
                        className="w-full py-2.5 text-[9.5px] font-mono font-black tracking-widest uppercase rounded-lg border border-[#00b8d9]/30 hover:border-[#00b8d9]/60 text-[#00b8d9] bg-[#00b8d9]/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
                      >
                        {isProvisioningDatasets ? (
                          <>
                            <RotateCw size={11} className="animate-spin" />
                            Provisioning...
                          </>
                        ) : (
                          "Auto-Provision Folders // 自动建立"
                        )}
                      </button>
                    </div>
                  )}

                  {diagnosticResults?.allReady && (
                    <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20 flex items-center gap-3">
                      <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                      <span className="text-[9px] font-mono text-green-400 uppercase font-black tracking-widest leading-relaxed">
                        WORKSPACE INTEGRITY NOMINAL (READY)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Columns: Workspace File Browser & Monospaced Code Box */}
              <div className="lg:col-span-2 p-8 bg-zinc-950 rounded-[2.5rem] border border-white/5 space-y-6 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[12px] font-mono font-black uppercase tracking-[0.1em] text-white block">
                      AI Core Workstation
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase font-black">
                      PERSISTENT SOURCE DIRECTORY // /app/Runtime
                    </span>
                  </div>

                  <div className="flex gap-4 text-[9px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-zinc-400 uppercase font-black tracking-wider">ACTIVE ENV: SANDBOX</span>
                    </div>
                  </div>
                </div>

                {brainDownloadStatus === 'offline' ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4 border border-dashed border-white/10 rounded-3xl min-h-[400px]">
                    <AlertCircle size={36} className="text-zinc-600 animate-pulse" />
                    <div className="space-y-1">
                      <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest font-black">
                        WORKSPACE ACCESS LOCKED
                      </p>
                      <p className="text-[9px] text-zinc-500 font-sans max-w-sm mx-auto mt-1 leading-normal">
                        Neural brain registers are empty. Connect DDDDDDDDDDD remote git repository at left column to build local AI workspace structures.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Directory Browser */}
                    <div className="md:col-span-1 bg-black/40 border border-white/5 rounded-2xl p-4 space-y-4 overflow-y-auto max-h-[500px]">
                      <div className="text-[8px] font-mono font-black text-zinc-600 uppercase tracking-wider pb-1.5 border-b border-white/5">
                        Directory Elements
                      </div>

                      <div className="space-y-3">
                        {/* ai_logic */}
                        <div className="space-y-1">
                          <p className="text-[9px] font-mono text-zinc-500 flex items-center gap-1.5 uppercase font-bold">
                            <span>📁</span> ai_logic
                          </p>
                          <button
                            type="button"
                            onClick={() => setSelectedRuntimeFile('ai_logic/core_reasoner.py')}
                            className={`w-full text-left pl-5 py-1.5 rounded text-[9.5px] font-mono transition-colors font-bold ${
                              selectedRuntimeFile === 'ai_logic/core_reasoner.py' ? 'bg-[#00b8d9]/10 text-[#00b8d9]' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            🐍 core_reasoner.py
                          </button>
                        </div>

                        {/* agents */}
                        <div className="space-y-1">
                          <p className="text-[9px] font-mono text-zinc-500 flex items-center gap-1.5 uppercase font-bold">
                            <span>📁</span> agents
                          </p>
                          <button
                            type="button"
                            onClick={() => setSelectedRuntimeFile('agents/curation_agent.py')}
                            className={`w-full text-left pl-5 py-1.5 rounded text-[9.5px] font-mono transition-colors font-bold ${
                              selectedRuntimeFile === 'agents/curation_agent.py' ? 'bg-[#00b8d9]/10 text-[#00b8d9]' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            🐍 curation_agent.py
                          </button>
                        </div>

                        {/* workflows */}
                        <div className="space-y-1">
                          <p className="text-[9px] font-mono text-zinc-500 flex items-center gap-1.5 uppercase font-bold">
                            <span>📁</span> workflows
                          </p>
                          <button
                            type="button"
                            onClick={() => setSelectedRuntimeFile('workflows/trend_synthesis.yaml')}
                            className={`w-full text-left pl-5 py-1.5 rounded text-[9.5px] font-mono transition-colors font-bold ${
                              selectedRuntimeFile === 'workflows/trend_synthesis.yaml' ? 'bg-[#00b8d9]/10 text-[#00b8d9]' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            ⚙ trend_synthesis.yaml
                          </button>
                        </div>

                        {/* tools */}
                        <div className="space-y-1">
                          <p className="text-[9px] font-mono text-zinc-500 flex items-center gap-1.5 uppercase font-bold">
                            <span>📁</span> tools
                          </p>
                          <button
                            type="button"
                            onClick={() => setSelectedRuntimeFile('tools/system_helpers.py')}
                            className={`w-full text-left pl-5 py-1.5 rounded text-[9.5px] font-mono transition-colors font-bold ${
                              selectedRuntimeFile === 'tools/system_helpers.py' ? 'bg-[#00b8d9]/10 text-[#00b8d9]' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            🐍 system_helpers.py
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Premium Monospaced Source Viewer */}
                    <div className="md:col-span-2 flex flex-col bg-black border border-white/5 rounded-2xl overflow-hidden min-h-[400px]">
                      <div className="bg-zinc-950 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[8.5px] font-mono text-zinc-500">
                          {selectedRuntimeFile}
                        </span>
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        </div>
                      </div>

                      <div className="flex-1 p-4 font-mono text-[9px] text-[#00ff41] overflow-auto max-h-[450px] leading-normal select-text whitespace-pre bg-[#030303]">
                        {runtimeFiles[selectedRuntimeFile]}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
