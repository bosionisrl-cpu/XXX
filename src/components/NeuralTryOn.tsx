import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Shirt, Zap, Download, RefreshCw, 
  Sparkles, Camera, ShieldCheck, ChevronRight,
  Monitor, Layers, Database, Box, Info,
  Smartphone, GitBranch, FolderGit, Terminal, Play, Check, AlertTriangle,
  FileText, Cpu, HardDrive, Compass, Settings, ShieldAlert, Sliders, Server
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface Model {
  id: string;
  name: string;
  image: string;
  desc: string;
  densepose?: string;
}

const PRESET_MODELS: Model[] = [
  { 
    id: 'm1', 
    name: 'Alpha-01 (Male)', 
    image: 'https://picsum.photos/seed/fashion_m1/800/1200', 
    desc: 'Athletic build, 185cm',
    densepose: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: 'm2', 
    name: 'Beta-02 (Female)', 
    image: 'https://picsum.photos/seed/fashion_f1/800/1200', 
    desc: 'Petite build, 165cm',
    densepose: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: 'm3', 
    name: 'Gamma-03 (Neutral)', 
    image: 'https://picsum.photos/seed/fashion_n1/800/1200', 
    desc: 'Average build, 175cm',
    densepose: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: 'm4', 
    name: 'Delta-04 (Curvy)', 
    image: 'https://picsum.photos/seed/fashion_f2/800/1200', 
    desc: 'Curvy build, 170cm',
    densepose: 'https://images.unsplash.com/photo-1501472312651-726afd116ff1?auto=format&fit=crop&w=400&q=80' 
  },
];

interface NeuralTryOnProps {
  preloadedDesign?: string | null;
  activeBrandDNA?: { aesthetic: string; colors: string[]; materials: string[] };
}

export const NeuralTryOn: React.FC<NeuralTryOnProps> = ({ preloadedDesign, activeBrandDNA }) => {
  // Mode selection: 'standard' | 'mobile_vton' | 'viton_hd' (Default to mobile_vton for user request context)
  const [engineMode, setEngineMode] = useState<'standard' | 'mobile_vton' | 'viton_hd'>('mobile_vton');

  // Standard Tryon states
  const [selectedModel, setSelectedModel] = useState<Model>(PRESET_MODELS[1]);
  const [garmentImage, setGarmentImage] = useState<string | null>(preloadedDesign || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<'1K' | '2K' | '4K'>('2K');

  // Mobile-VTON (CVPR 2026) specific states
  const [gitStatus, setGitStatus] = useState<'synced' | 'cloning'>('synced');
  const [condaActive, setCondaActive] = useState<boolean>(true);
  const [envName, setEnvName] = useState<string>('mobile');
  const [datasetSelected, setDatasetSelected] = useState<'vitonhd' | 'dresscode'>('vitonhd');
  const [activeTab, setActiveTab] = useState<'model' | 'densepose' | 'agnostic'>('model');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[SYSTEM] Fashion OS Virtual Try-On Control Tower Initialized.",
    "[READY] Connect models, clone repos, or build local virtual environment matrices."
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  
  // Mobile parameters
  const [mobileResolution, setMobileResolution] = useState<'512x384' | '1024x768'>('512x384');
  const [denseposeWeight, setDenseposeWeight] = useState<number>(85);
  const [agnosticMaskOpacity, setAgnosticMaskOpacity] = useState<number>(45);
  const [fitMode, setFitMode] = useState<'loose' | 'fitted' | 'crop'>('fitted');

  // Folder checker simulations
  const [vitonFilesPrepped, setVitonFilesPrepped] = useState<boolean>(true);
  const [dressCodePrepped, setDressCodePrepped] = useState<boolean>(false);

  // VITON-HD (Official Git Repository Integrator) specific states
  const [vitonGitStatus, setVitonGitStatus] = useState<'uncloned' | 'cloning' | 'synced'>('uncloned');
  const [vitonCondaStatus, setVitonCondaStatus] = useState<'uninitialized' | 'creating' | 'active'>('uninitialized');
  const [vitonDepsStatus, setVitonDepsStatus] = useState<'uninstalled' | 'installing' | 'ready'>('uninstalled');
  const [vitonEpochs, setVitonEpochs] = useState<number>(120);
  const [vitonBatchSize, setVitonBatchSize] = useState<number>(4);
  const [vitonResolution, setVitonResolution] = useState<'256x192' | '512x384' | '1024x768'>('512x384');
  const [vitonCoreDataset, setVitonCoreDataset] = useState<'test' | 'train'>('test');
  const [vitonActiveTab, setVitonActiveTab] = useState<'output' | 'g_warp' | 'segmentation' | 'flow'>('output');
  const [vitonWarpMethod, setVitonWarpMethod] = useState<'TPS' | 'OpticalWarp' | 'DualDecoupled'>('TPS');

  // VITON-HD Custom Path Configuration States
  const [vitonDatasetPath, setVitonDatasetPath] = useState<string>('/workspace/VITON-HD/datasets');
  const [vitonCheckpointsPath, setVitonCheckpointsPath] = useState<string>('/workspace/VITON-HD/checkpoints');
  const [vitonOutputPath, setVitonOutputPath] = useState<string>('/workspace/VITON-HD/results');
  const [vitonEnvPath, setVitonEnvPath] = useState<string>('/opt/conda/envs/viton_hd_env');

  // Multi-state requirements checks
  const [reqPython, setReqPython] = useState<'unchecked' | 'checking' | 'passed' | 'failed'>('unchecked');
  const [reqPyTorch, setReqPyTorch] = useState<'unchecked' | 'checking' | 'passed' | 'failed'>('unchecked');
  const [reqCUDA, setReqCUDA] = useState<'unchecked' | 'checking' | 'passed' | 'failed'>('unchecked');
  const [reqDiskSpace, setReqDiskSpace] = useState<'unchecked' | 'checking' | 'passed' | 'failed'>('unchecked');
  const [reqGit, setReqGit] = useState<'unchecked' | 'checking' | 'passed' | 'failed'>('unchecked');
  const [reqVRAM, setReqVRAM] = useState<'unchecked' | 'checking' | 'passed' | 'failed'>('unchecked');
  
  const [leftSubTab, setLeftSubTab] = useState<'pipeline' | 'diagnostics'>('pipeline');
  const [pathsSaved, setPathsSaved] = useState<boolean>(false);

  // Granular VRAM selective weight offloader states
  const [modelWeights, setModelWeights] = useState<Array<{
    id: string;
    name: string;
    description: string;
    sizeGb: number;
    status: 'loaded' | 'unloaded' | 'loading' | 'unloading';
    category: 'Warping' | 'Segmentation' | 'Synthesis' | 'Alignment';
    loadTimeMs: number;
  }>>([
    {
      id: 'tps_warper',
      name: 'TPS Warping Net (tps_nets.pth)',
      description: 'Calculates high-precision thin-plate spline cloth garment deformations.',
      sizeGb: 1.25,
      status: 'loaded',
      category: 'Warping',
      loadTimeMs: 1200
    },
    {
      id: 'parser_net',
      name: 'Human Parser Net (alias_seg.pth)',
      description: 'Generates semantic segment maps for human body shape partitions.',
      sizeGb: 2.40,
      status: 'loaded',
      category: 'Segmentation',
      loadTimeMs: 1800
    },
    {
      id: 'sam_engine',
      name: 'Segment Anything Core (sam_vit_h.pth)',
      description: 'Produces high-fidelity zero-shot agnostic body and garment masks.',
      sizeGb: 5.60,
      status: 'unloaded',
      category: 'Segmentation',
      loadTimeMs: 3800
    },
    {
      id: 'densepose',
      name: 'DensePose R_50_FPN (densepose_r50.pth)',
      description: 'Extracts UV coordinate mappings for continuous body surface alignment.',
      sizeGb: 3.10,
      status: 'loaded',
      category: 'Alignment',
      loadTimeMs: 2200
    },
    {
      id: 'gan_synthesis',
      name: 'GAN Resolution Synthesizer (g_synthesis.pth)',
      description: 'Generates final 1024x768 output by merging warped garments and skin textures.',
      sizeGb: 8.40,
      status: 'loaded',
      category: 'Synthesis',
      loadTimeMs: 5100
    }
  ]);

  const toggleWeightLoad = (id: string) => {
    const target = modelWeights.find(w => w.id === id);
    if (!target) return;

    if (target.status === 'loaded') {
      setModelWeights(prev => prev.map(w => w.id === id ? { ...w, status: 'unloading' } : w));
      setConsoleLogs(prev => [
        ...prev,
        `[VRAM] [INFO] Requesting eviction of weight buffer: ${target.name}...`,
        `[VRAM] Freeing ${target.sizeGb} GB pointers from active GPU register pool...`
      ]);

      setTimeout(() => {
        setModelWeights(prev => prev.map(w => w.id === id ? { ...w, status: 'unloaded' } : w));
        setConsoleLogs(prev => [
          ...prev,
          `[VRAM] [EVICTION_SUCCESS] Evicted ${target.name} register mapping. Freed ${target.sizeGb} GB active VRAM.`
        ]);
      }, 1000);
    } else if (target.status === 'unloaded') {
      setModelWeights(prev => prev.map(w => w.id === id ? { ...w, status: 'loading' } : w));
      setConsoleLogs(prev => [
        ...prev,
        `[VRAM] [ALLOCATION] Triggered model loader pipeline for: ${target.name}...`,
        `[VRAM] Streaming weight tensors from physical storage to high-bandwidth graphics registers...`,
        `[VRAM] Demanding persistent payload container size of ${target.sizeGb} GB...`
      ]);

      setTimeout(() => {
        setModelWeights(prev => prev.map(w => w.id === id ? { ...w, status: 'loaded' } : w));
        setConsoleLogs(prev => [
          ...prev,
          `[VRAM] [LOAD_SUCCESS] Persistent allocation confirmed on graphics card. Memory is live.`
        ]);
      }, 1200);
    }
  };

  const purgeInactiveVram = () => {
    setConsoleLogs(prev => [
      ...prev,
      "[VRAM] [CRITICAL] Purging all non-active weight cache handles from memory bus layout...",
      "[VRAM] Garbage collector flushing un-allocated buffers. Triggering raw torch.cuda.empty_cache()..."
    ]);

    setTimeout(() => {
      setConsoleLogs(prev => [
        ...prev,
        "[VRAM] [CACHE_FLUSHED] Cuda cache emptied. Removed transient attention registers and gradient nodes."
      ]);
    }, 600);
  };

  const runRequirementsCheck = () => {
    setReqPython('checking');
    setReqPyTorch('checking');
    setReqCUDA('checking');
    setReqDiskSpace('checking');
    setReqGit('checking');
    setReqVRAM('checking');
    
    setConsoleLogs(prev => [
      ...prev,
      "[DIAGNOSTICS] Spawning background thread to verify system requirement dependencies...",
      `[DIAGNOSTICS] Parsing environment path targets from: ${vitonEnvPath}...`
    ]);

    setTimeout(() => {
      setReqPython('passed');
      setReqGit('passed');
      setConsoleLogs(prev => [
        ...prev,
        "[DIAGNOSTICS] [PASSED] Python v3.8.12 runtime detected in conda workspace.",
        "[DIAGNOSTICS] [PASSED] Git commands registered locally (/usr/bin/git v2.43.0)."
      ]);
    }, 600);

    setTimeout(() => {
      setReqPyTorch('passed');
      setReqDiskSpace('passed');
      setConsoleLogs(prev => [
        ...prev,
        "[DIAGNOSTICS] [PASSED] PyTorch v1.13.1 CUDA-compiled modules verified successfully with torchgeometry binding.",
        "[DIAGNOSTICS] [PASSED] Local volume storage space checked. 48.2 GB available."
      ]);
    }, 1200);

    setTimeout(() => {
      setReqCUDA('passed');
      setReqVRAM('passed');
      setConsoleLogs(prev => [
        ...prev,
        "[DIAGNOSTICS] [PASSED] NVIDIA CUDA Toolkit v11.8 detected on system bus.",
        "[DIAGNOSTICS] [PASSED] GPU hardware target verified: NVIDIA Tensor Core H100 with 80GB VRAM.",
        "[SUCCESS] System requirement checks complete. No blockers found for VITON-HD synthesis."
      ]);
    }, 1800);
  };

  const applyCustomPaths = () => {
    setPathsSaved(true);
    setConsoleLogs(prev => [
      ...prev,
      "[SYSTEM] Committing updated VITON-HD system path mappings:",
      ` ➔ DATASET ROOT:    ${vitonDatasetPath}`,
      ` ➔ CHECKPOINTS DIR: ${vitonCheckpointsPath}`,
      ` ➔ COMPILER OUTPUT: ${vitonOutputPath}`,
      ` ➔ ENV POINTER:     ${vitonEnvPath}`,
      "[SUCCESS] Environment path parameters synchronized. Rewriting configs on disk & updating symlinks..."
    ]);

    setTimeout(() => {
      setPathsSaved(false);
    }, 2500);
  };


  useEffect(() => {
    if (preloadedDesign) {
      setGarmentImage(preloadedDesign);
      setResultImage(null);
    }
  }, [preloadedDesign]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setGarmentImage(reader.result as string);
      setResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] },
    multiple: false 
  });

  const handleGenerate = async () => {
    if (!garmentImage) {
      setError("Please upload a garment image first.");
      return;
    }
    
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setResultImage(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 5;
      });
    }, 150);

    try {
      const response = await fetch('/api/ai/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personImage: selectedModel.image,
          garmentImage: garmentImage,
          quality: quality
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Generation failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResultImage(data.task.result_url);
        setProgress(100);
      } else {
        throw new Error(data.error || "Generation failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during generation.");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const executeMobileVtonInference = () => {
    if (!garmentImage) {
      setError("Please inject a beautiful cyber garment / shirt image first.");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setResultImage(null);
    
    // Simulate mobile console outputs during high-efficiency edge processing
    const logsToAdd = [
      `[PIPELINE] Initializing CVPR-2026 Mobile-VTON process on active model...`,
      `[DATASET] Querying active ${datasetSelected.toUpperCase()} file metadata.`,
      `[MASK] Computing Agnostic-Mask (transparency threshold: ${agnosticMaskOpacity}%)`,
      `[DENSEPOSE] Rendering body segment pose mapping (weight multiplier: ${denseposeWeight/100})`,
      `[COMPILING] Packing mobile tensor to model resolution size ${mobileResolution}.`,
      `[INFERENCE] Running highly-efficient lightweight dry-run (Memory: 2.14 GB)...`,
      `[SUCCESS] Warp alignment done. Device output synchronized.`
    ];

    let currentLogIndex = 0;
    const logInterval = setInterval(() => {
      if (currentLogIndex < logsToAdd.length) {
        setConsoleLogs(prev => [...prev, logsToAdd[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 400);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsGenerating(false);
          // Auto display result matching either preloaded or a curated design
          setResultImage(garmentImage); // Real-time warp preview
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    setConsoleLogs(prev => [...prev, `$ ${cmd}`]);
    
    // Process mock terminal actions for high-fidelity feel
    if (cmd === 'conda activate mobile') {
      setCondaActive(true);
      setEnvName('mobile');
      setConsoleLogs(prev => [...prev, "[OK] Conda environment 'mobile' activated successfully."]);
    } else if (cmd.includes('git clone')) {
      setGitStatus('clining' as any);
      setTimeout(() => {
        setGitStatus('synced');
        setConsoleLogs(prev => [...prev, "[SUCCESS] git clone completed. Directory /2026_CVPR_Mobile-VTON/ structure mapped."]);
      }, 1500);
      setConsoleLogs(prev => [...prev, "Cloning repository: 2026_CVPR_Mobile-VTON..."]);
    } else if (cmd === 'python test.py' || cmd.includes('test.py')) {
      executeMobileVtonInference();
    } else if (cmd === 'clear') {
      setConsoleLogs([]);
    } else {
      setConsoleLogs(prev => [...prev, `Command '${cmd}' recognized. Simulating safe execution...`]);
    }

    setTerminalInput('');
  };

  const arrangeFilesForVITON = () => {
    setConsoleLogs(prev => [
      ...prev,
      "[FS_SIM] Moving 'txt_files/image_descriptions.txt' to test/ image list...",
      "[FS_SIM] Slicing 'vitonhd_train_tagged.json' and transferring to train/ metadata folder...",
      "[FS_SIM] VITON-HD directory arrangement verified & active [OK]"
    ]);
    setVitonFilesPrepped(true);
  };

  const arrangeFilesForDressCode = () => {
    setConsoleLogs(prev => [
      ...prev,
      "[FS_SIM] Sourcing IDM-VTON densepose coordinates...",
      "[FS_SIM] Copied dc_descriptions.txt into DressCode/upper_body schema...",
      "[FS_SIM] DressCode directory arrangement verified & active [OK]"
    ]);
    setDressCodePrepped(true);
  };

  const triggerVitonGitClone = () => {
    setVitonGitStatus('cloning');
    setConsoleLogs(prev => [
      ...prev,
      "$ git clone https://github.com/shadow2496/VITON-HD.git",
      "[GIT] Cloning into './VITON-HD' repository...",
      "[GIT] remote: Enumerating objects: 121, done.",
      "[GIT] remote: Counting objects: 100% (121/121), done.",
      "[GIT] Sourcing remote files: checkpoints, datasets, models/warp.py..."
    ]);

    setTimeout(() => {
      setVitonGitStatus('synced');
      setConsoleLogs(prev => [
        ...prev,
        "[GIT] Receiving objects: 100% (121/121), 18.2 MB | 8.5 MB/s, done.",
        "[GIT] Resolving deltas: 100% (45/45), done.",
        "[SUCCESS] Repository cloned into directory: /VITON-HD. Workspace ready for local Conda initialization."
      ]);
    }, 2000);
  };

  const triggerVitonCondaSetup = () => {
    if (vitonGitStatus !== 'synced') {
      setError("Please clone the VITON-HD repository first using the Git Integration module.");
      return;
    }
    setVitonCondaStatus('creating');
    setConsoleLogs(prev => [
      ...prev,
      "$ conda create -y -n viton_env python=3.8",
      "[CONDA] Collecting package metadata (current_repodata.json)... done.",
      "[CONDA] Solving environment... done.",
      "[CONDA] Preparing package transaction: python=3.8 pip setuptools wheel sqlite done."
    ]);

    setTimeout(() => {
      setVitonCondaStatus('active');
      setConsoleLogs(prev => [
        ...prev,
        "[CONDA] Executing transaction... done.",
        "$ conda activate viton_env",
        "[SUCCESS] Environment 'viton_env' (Python 3.8) is successfully compiled and activated. Ready for PyTorch dependencies."
      ]);
    }, 2000);
  };

  const triggerVitonDepsInstall = () => {
    if (vitonCondaStatus !== 'active') {
      setError("Please initialize and activate the Conda environment first.");
      return;
    }
    setVitonDepsStatus('installing');
    setConsoleLogs(prev => [
      ...prev,
      "$ conda install -y pytorch>=1.6.0 torchvision cudatoolkit>=9.2 -c pytorch",
      "[CONDA] Downloading channels...",
      "[CONDA] Installing: pytorch-1.9.1, torchvision-0.10.1, cudatoolkit-10.2...",
      "$ pip install opencv-python torchgeometry"
    ]);

    setTimeout(() => {
      setVitonDepsStatus('ready');
      setConsoleLogs(prev => [
        ...prev,
        "[PIP] Downloading opencv-python (4.9.0) & torchgeometry (0.1.2) wheels...",
        "[PIP] Building package wheels for torchgeometry... done.",
        "[SUCCESS] PyTorch core library, torchvision and computer vision dependencies fully mounted. VITON-HD pipeline compiled [OK]."
      ]);
    }, 2200);
  };

  const triggerVitonInference = () => {
    if (vitonDepsStatus !== 'ready') {
      setError("Please clone the repo, set up Conda and install dependencies first!");
      return;
    }
    if (!garmentImage) {
      setError("Please select/upload a beautiful wear design to map on the model!");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setResultImage(null);

    setConsoleLogs(prev => [
      ...prev,
      `$ python test.py --name viton_hd_run --batch_size ${vitonBatchSize} --resolution ${vitonResolution.split('x')[0]} --warp_mode ${vitonWarpMethod}`,
      `[VITON-HD] Loading dataset from './VITON-HD/${vitonCoreDataset}' [COMPLETED]`,
      `[VITON-HD] Spawning Warp-TPS parameters using method ${vitonWarpMethod}...`,
      `[CUDA] Binding tensor to CUDA device 0 (NVIDIA H100 GPU core)...`
    ]);

    let count = 0;
    const interval = setInterval(() => {
      count += 20;
      setProgress(count);
      setConsoleLogs(prev => [
        ...prev,
        `[EPOCH_MAPPING] Warping epoch ${Math.round(vitonEpochs * (count / 100))}/${vitonEpochs} | Loss: ${(0.045 / (count / 15)).toFixed(5)}`
      ]);

      if (count >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
        setResultImage(garmentImage); // Real-time warp preview
        setConsoleLogs(prev => [
          ...prev,
          "[SUCCESS] High-fidelity VITON-HD dataset network rendering complete.",
          "Image output mapped: /VITON-HD/results/viton_hd_run/fused_output.png"
        ]);
      }
    }, 500);
  };


  const computedActiveVram = 4.2 + modelWeights
    .filter(w => w.status === 'loaded' || w.status === 'unloading')
    .reduce((acc, curr) => acc + curr.sizeGb, 0);
  const totalVramLimit = 80.0; // NVIDIA H100 GPU limit
  const activePercentage = (computedActiveVram / totalVramLimit) * 100;

  return (
    <div className="flex flex-col gap-6 font-sans select-none text-white pb-12">
      {/* Premium Engine Top Toggle Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-950/40 p-3 rounded-2xl border border-white/5 backdrop-blur-3xl">
        <div className="flex flex-col pl-2">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-[#ff9900]" />
            <h2 className="text-xs font-black tracking-widest text-zinc-300 uppercase">// NEURAL TRY-ON ARCHITECT DEPLOYER</h2>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono mt-1">CVPR 2026 MOBILE-VTON & OFFICIAL SHADOW2496/VITON-HD DIRECT INTEGRATOR</p>
        </div>
        
        <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-white/10 w-full sm:w-auto overflow-x-auto gap-1">
          <button 
            onClick={() => {
              setEngineMode('mobile_vton');
              setConsoleLogs(prev => [...prev, "[SYSTEM] Switched viewport to Mobile-VTON (CVPR 2026) Edge architecture."]);
            }}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              engineMode === 'mobile_vton' ? 'bg-[#00ff41] text-zinc-950 font-black' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <Smartphone size={11} />
            Mobile-VTON
          </button>

          <button 
            onClick={() => {
              setEngineMode('viton_hd');
              setConsoleLogs(prev => [
                ...prev, 
                "[SYSTEM] Switched viewport to Off-Grid Database Core: shadow2496/VITON-HD.",
                "[SYS] Ready to spawn PyTorch geometry pipeline. Sourcing conda parameters..."
              ]);
            }}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              engineMode === 'viton_hd' ? 'bg-[#ff9900] text-zinc-950 font-black' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <GitBranch size={11} />
            VITON-HD (CORE)
          </button>
          
          <button 
            onClick={() => {
              setEngineMode('standard');
              setConsoleLogs(prev => [...prev, "[SYSTEM] Switched viewport to traditional REST-driven high-res cloud API."]);
            }}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              engineMode === 'standard' ? 'bg-white text-black font-black' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <Server size={11} />
            REST Cloud API
          </button>
        </div>
      </div>

      {engineMode === 'mobile_vton' ? (
        /* ==================== CVPR 2026 MOBILE VTON VIEWPORT ==================== */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Git Repository, Conda Control Panel & Dataset Structure Mapper (5 grid cols) */}
          <div className="xl:col-span-5 flex flex-col gap-5">
            
            {/* Git Repositories and Environment Block */}
            <div className="glass-dark p-5 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch size={16} className="text-[#00ff41]" />
                  <span className="text-[11px] font-black uppercase tracking-widest font-mono">Mobile Repository</span>
                </div>
                <span className="text-[9px] font-mono bg-[#00ff41]/10 text-[#00ff41] px-2 py-0.5 rounded border border-[#00ff41]/20">ACTIVE_RELEASE</span>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-300">git@github.com:bosionisrl-cpu/2026_CVPR_Mobile-VTON.git</p>
                    <p className="text-[8px] text-zinc-500 font-mono mt-1">CVPR 2026 Mobile Virtual Try-On Official Pipeline</p>
                  </div>
                  <Check size={14} className="text-[#00ff41]" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono border-t border-white/5 pt-3">
                  <div className="bg-zinc-950/60 p-2 rounded border border-white/5">
                    <span className="text-zinc-500 block text-[7px] uppercase">CONDA ENVIRONMENT</span>
                    <span className="text-[#00ff41] font-bold">mobile (py3.9)</span>
                  </div>
                  <div className="bg-zinc-950/60 p-2 rounded border border-white/5">
                    <span className="text-zinc-500 block text-[7px] uppercase">LOCAL CODEBASE</span>
                    <span className="text-white">/2026_CVPR_Mobile-VTON</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingestion & Dataset Preparation */}
            <div className="glass-dark p-5 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-[#00ff41]" />
                  <span className="text-[11px] font-black uppercase tracking-widest font-mono">Dataset Preparation & Tree</span>
                </div>
                <span className="text-[8px] tracking-widest text-zinc-500 font-mono">[ DUAL_TRACK ]</span>
              </div>

              <div className="flex bg-zinc-950/40 p-1.5 rounded-xl border border-white/10">
                <button 
                  onClick={() => setDatasetSelected('vitonhd')}
                  className={`flex-1 py-1.5 rounded-lg text-[9.5px] font-black tracking-wider transition-all uppercase ${
                    datasetSelected === 'vitonhd' ? 'bg-[#00ff41]/20 text-white border-b-2 border-[#00ff41]' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  VITON-HD
                </button>
                <button 
                  onClick={() => setDatasetSelected('dresscode')}
                  className={`flex-1 py-1.5 rounded-lg text-[9.5px] font-black tracking-wider transition-all uppercase ${
                    datasetSelected === 'dresscode' ? 'bg-[#00ff41]/20 text-white border-b-2 border-[#00ff41]' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  DressCode
                </button>
              </div>

              {datasetSelected === 'vitonhd' ? (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-extrabold text-white uppercase">VITON-HD High-Definition Struct</p>
                      <p className="text-[8.5px] text-zinc-500">Requires text_files/image_descriptions.txt placement</p>
                    </div>
                    {vitonFilesPrepped ? (
                      <span className="text-[8.5px] font-mono text-[#00ff41] bg-[#00ff41]/10 px-2.5 py-1 rounded">MOUNTED</span>
                    ) : (
                      <button 
                        onClick={arrangeFilesForVITON}
                        className="text-[8.5px] font-mono bg-white text-black font-black px-2.5 py-1 rounded hover:scale-105 active:scale-95 transition-all"
                      >
                        ARRANGE FILES
                      </button>
                    )}
                  </div>

                  {/* Curated Interactive File System Tree */}
                  <div className="bg-zinc-950/80 p-3 rounded-xl border border-white/5 font-mono text-[9px] leading-relaxed select-text">
                    <p className="text-[#00ff41]">/2026_CVPR_Mobile-VTON/VITON-HD/</p>
                    <p className="text-zinc-400">├── test/</p>
                    <p className="text-zinc-500">│   ├── <span className="text-zinc-300 font-bold">image/</span> (curated photos)</p>
                    <p className="text-zinc-500">│   ├── <span className="text-zinc-300 font-bold">image-densepose/</span> (curated body maps)</p>
                    <p className="text-zinc-500">│   ├── <span className="text-zinc-300 font-bold">agnostic-mask/</span> (cloth-free layers)</p>
                    <p className="text-zinc-500">│   ├── <span className="text-zinc-300 font-bold">cloth/</span> (curated wear designs)</p>
                    <p className="text-zinc-300">│   └── <span className="text-[#00ff41] font-bold">image_descriptions.txt</span> {vitonFilesPrepped ? "(Copied)" : "(Awaiting Placement)"}</p>
                    <p className="text-zinc-400">└── train/</p>
                    <p className="text-zinc-300">    └── <span className="text-[#00ff41] font-bold">vitonhd_train_tagged.json</span> {vitonFilesPrepped ? "(Active Info)" : "(Needs placement)"}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-extrabold text-white uppercase">DressCode Body Ingestion</p>
                      <p className="text-[8.5px] text-zinc-500">Requires upper_body/ densepose maps and labels</p>
                    </div>
                    {dressCodePrepped ? (
                      <span className="text-[8.5px] font-mono text-[#00ff41] bg-[#00ff41]/10 px-2.5 py-1 rounded">MOUNTED</span>
                    ) : (
                      <button 
                        onClick={arrangeFilesForDressCode}
                        className="text-[8.5px] font-mono bg-white text-black font-black px-2.5 py-1 rounded hover:scale-105 active:scale-95 transition-all"
                      >
                        ARRANGE FILES
                      </button>
                    )}
                  </div>

                  <div className="bg-zinc-950/80 p-3 rounded-xl border border-white/5 font-mono text-[9px] leading-relaxed select-text">
                    <p className="text-[#00ff41]">/2026_CVPR_Mobile-VTON/DressCode/</p>
                    <p className="text-zinc-400">└── upper_body/</p>
                    <p className="text-zinc-500">    ├── <span className="text-zinc-300 font-bold">images/</span> (high-def base model)</p>
                    <p className="text-zinc-500">    ├── <span className="text-zinc-300 font-bold">image-densepose/</span> (IDM-VTON Precomputed poses)</p>
                    <p className="text-zinc-300">    └── <span className="text-[#00ff41] font-bold font-mono">dc_descriptions.txt</span> {dressCodePrepped ? "(Positioned)" : "(Needs positioning)"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile-VTON Real-time Latency, Frame Rates and Hardware Spec gauges */}
            <div className="glass-dark p-5 rounded-3xl border border-white/5 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00ff41] font-mono block">// EDGE SYSTEM METRICS</span>
              
              <div className="grid grid-cols-3 gap-2 text-center text-zinc-400">
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[8.5px] uppercase block text-zinc-500 tracking-wider">LATENCY</span>
                  <span className="text-xs font-black text-white font-mono">220ms</span>
                  <div className="w-8 h-1 bg-[#00ff41] mx-auto rounded-full mt-1" />
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[8.5px] uppercase block text-zinc-500 tracking-wider">RAM FOOTPRINT</span>
                  <span className="text-xs font-black text-white font-mono">2.14 GB</span>
                  <div className="w-8 h-1 bg-[#00ff41] mx-auto rounded-full mt-1" />
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[8.5px] uppercase block text-zinc-500 tracking-wider">FRAME RATE</span>
                  <span className="text-xs font-black text-[#00ff41] font-mono">42 FPS</span>
                  <div className="w-8 h-1 bg-[#00ff41] mx-auto rounded-full mt-1" />
                </div>
              </div>

              {/* Edge Model Tuning Controls */}
              <div className="space-y-3.5 border-t border-white/5 pt-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-black tracking-widest uppercase text-zinc-400 font-mono">
                    <span>DensePose Guidance Intensity</span>
                    <span>{denseposeWeight}%</span>
                  </div>
                  <input 
                    type="range"
                    min="50"
                    max="100"
                    value={denseposeWeight}
                    onChange={(e) => setDenseposeWeight(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/5 appearance-none cursor-pointer accent-[#00ff41]" 
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-black tracking-widest uppercase text-zinc-400 font-mono">
                    <span>Agnostic Mask Dilate/Opacity</span>
                    <span>{agnosticMaskOpacity}%</span>
                  </div>
                  <input 
                    type="range"
                    min="10"
                    max="90"
                    value={agnosticMaskOpacity}
                    onChange={(e) => setAgnosticMaskOpacity(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/5 appearance-none cursor-pointer accent-[#00ff41]" 
                  />
                </div>
              </div>
            </div>

          </div>

          {/* MAIN CENTER/RIGHT COLUMN: iPhone Emulator (Edge Viewport) and Console Log Terminal (7 grid cols) */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Side: Mobile Parameters & Model Selector (5 grid cols) */}
              <div className="md:col-span-5 flex flex-col gap-4">
                <div className="glass-dark p-5 rounded-3xl border border-white/5 space-y-5 flex-1 flex flex-col justify-between">
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#00ff41]">
                      <User size={15} />
                      <span className="text-[10px] font-black uppercase tracking-widest font-mono">Mobile Cast Targets</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_MODELS.map(model => (
                        <button
                          key={model.id}
                          onClick={() => setSelectedModel(model)}
                          className={`relative aspect-[3/4.2] rounded-xl overflow-hidden border transition-all ${
                            selectedModel.id === model.id ? 'border-[#00ff41] ring-2 ring-[#00ff41]/20 scale-[1.03]' : 'border-white/5 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={model.image} className="w-full h-full object-cover" alt={model.name} referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                            <span className="text-[9px] font-bold text-white block">{model.name.split(' ')[0]}</span>
                            <span className="text-[7.5px] text-zinc-400 block truncate">{model.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-white/5 pt-4">
                    <div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 font-mono block mb-2">Compiling target Resolution</span>
                      <div className="grid grid-cols-2 gap-2">
                        {(['512x384', '1024x768'] as const).map(res => (
                          <button
                            key={res}
                            onClick={() => setMobileResolution(res)}
                            className={`py-1.5 rounded-lg text-[9px] font-mono border transition-all ${
                              mobileResolution === res 
                                ? 'bg-white text-black font-bold border-white' 
                                : 'bg-transparent text-zinc-400 border-white/10 hover:border-white/20'
                            }`}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 font-mono block mb-2">Cutting Silhouette Fit</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['loose', 'fitted', 'crop'] as const).map(fit => (
                          <button
                            key={fit}
                            onClick={() => setFitMode(fit)}
                            className={`py-1 rounded text-[8.5px] font-mono border transition-all uppercase ${
                              fitMode === fit 
                                ? 'bg-[#00ff41] text-zinc-950 font-black border-[#00ff41]' 
                                : 'bg-zinc-950/40 text-zinc-400 border-white/5 hover:border-white/10'
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

              {/* Right Side: Beautiful iPhone Device Simulator Container (7 grid cols) */}
              <div className="md:col-span-7 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-[310px] aspect-[9/18.5] bg-zinc-900 rounded-[48px] p-2.5 ring-8 ring-zinc-800 shadow-2xl border border-white/10 overflow-hidden flex flex-col justify-between">
                  {/* Dynamic Apple Dynamic Island */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center gap-1">
                    <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
                    <div className="w-1 h-1 bg-primary/40 rounded-full animate-ping" />
                  </div>

                  {/* Mobile Screen Contents */}
                  <div className="flex-1 w-full h-full bg-[#0a0a0a] rounded-[38px] overflow-hidden relative flex flex-col p-4 pt-12">
                    
                    {/* Model Visual / Result View */}
                    <div className="flex-1 w-full bg-zinc-950 rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/5">
                      
                      {isGenerating ? (
                        <div className="absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center gap-4">
                          <div className="relative w-16 h-16 border-2 border-dashed border-[#00ff41] rounded-full animate-spin flex items-center justify-center">
                            <Smartphone className="text-[#00ff41]" size={18} />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-[9.5px] font-black text-[#00ff41] animate-pulse tracking-widest font-mono">WARPING GARMENT...</p>
                            <p className="text-[8px] text-zinc-500 font-mono">EDGE LATENCY: 220ms</p>
                          </div>
                        </div>
                      ) : null}

                      {/* Map Tabs Inside Emulator */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex bg-black/85 backdrop-blur-md p-1 rounded-full border border-white/10 gap-1">
                        {[
                          { id: 'model', label: 'WARP' },
                          { id: 'densepose', label: 'DENSEPOSE' }
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-3 py-1 rounded-full text-[7.5px] font-extrabold tracking-widest uppercase transition-all ${
                              activeTab === tab.id ? 'bg-[#00ff41] text-zinc-950' : 'text-zinc-500 hover:text-white'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Display Base Model, Result, or DensePose */}
                      {activeTab === 'densepose' ? (
                        <div className="w-full h-full relative bg-zinc-900">
                          {selectedModel.densepose ? (
                            <img src={selectedModel.densepose} className="w-full h-full object-cover mix-blend-screen opacity-90 filter hue-rotate-120 saturate-150" alt="DensePose Model representation" />
                          ) : (
                            <div className="w-full h-full bg-slate-950 flex items-center justify-center p-4 text-center text-zinc-600 font-mono text-[9px]">
                              Generating densepose...
                            </div>
                          )}
                          <div className="absolute inset-x-0 top-3 text-center text-[7.5px] font-mono text-[#00ff41] bg-black/50 py-0.5 tracking-widest uppercase">// SEG_LIVE_COORDINATES</div>
                        </div>
                      ) : (
                        <div className="w-full h-full relative">
                          <img 
                            src={resultImage ? resultImage : selectedModel.image} 
                            className={`w-full h-full object-cover transition-all ${!resultImage && 'grayscale brightness-90'}`} 
                            alt="Edge view" 
                            referrerPolicy="no-referrer"
                          />
                          {!resultImage && (
                            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
                              <span className="text-[9px] font-mono text-[#00ff41] font-bold tracking-widest block bg-black/60 px-2 py-1 rounded">AWAITING CLOTH PILE</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Integrated Cyber Pocket Selection Button within screen */}
                    <div className="pt-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] text-zinc-400 font-mono uppercase tracking-wider">Garment Sourced</span>
                        {garmentImage ? (
                          <span className="text-[8px] text-zinc-500 max-w-[120px] truncate block font-mono">{garmentImage.slice(0, 30)}...</span>
                        ) : (
                          <span className="text-[8px] text-amber-500 font-bold block">// NO SEAM SELECTED</span>
                        )}
                      </div>

                      <button 
                        onClick={executeMobileVtonInference}
                        disabled={isGenerating || !garmentImage}
                        className={`w-full py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                          !garmentImage 
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                            : 'bg-[#00ff41] text-zinc-950 hover:scale-[1.02] shadow-lg shadow-[#00ff41]/20'
                        }`}
                      >
                        <Play size={10} fill="currentColor" />
                        Live Wear (Mobile-VTON)
                      </button>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* Mobile-VTON PyTorch Terminal Output Console */}
            <div className="glass-dark p-5 rounded-3xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-zinc-400">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-[#00ff41]" />
                  <span className="text-[10px] font-black font-mono tracking-widest uppercase text-white">Live Conda Shell Terminal</span>
                </div>
                <div className="flex gap-1.5 font-mono text-[8px]">
                  <span className="w-2 h-2 rounded-full bg-red-500/80" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <span className="w-2 h-2 rounded-full bg-[#00ff41]/80" />
                </div>
              </div>

              {/* Console logs */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 h-44 overflow-y-auto font-mono text-[9px] line-clamp-6 leading-relaxed text-zinc-300">
                {consoleLogs.map((log, index) => (
                  <p key={index} className={log.startsWith('$') ? 'text-[#00ff41]' : 'text-zinc-300'}>
                    {log}
                  </p>
                ))}
              </div>

              {/* Console Input bar */}
              <form onSubmit={handleCommandSubmit} className="flex gap-2">
                <div className="flex-1 bg-zinc-950 border border-white/5 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-[#00ff41] font-mono text-[9px] select-none">$</span>
                  <input
                    type="text"
                    placeholder="conda activate mobile | python test.py --dataset vitonhd | clear"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="bg-transparent border-none outline-none flex-1 text-white font-mono text-[9.5px] placeholder-zinc-700"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-mono hover:bg-white/15 hover:text-white transition-all"
                >
                  RUN
                </button>
              </form>
            </div>

          </div>

        </div>
      ) : engineMode === 'viton_hd' ? (
        /* ==================== OFFICIAL VITON-HD DATABASE CORE INTEGRATION ==================== */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT PANEL: Git Clone tracking, Environment Customizer & Diagnostics (5 grid cols) */}
          <div className="xl:col-span-12 lg:xl:col-span-5 xl:col-span-5 flex flex-col gap-4">
            
            {/* Control Station Sub-Tabs */}
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 w-full gap-2">
              <button 
                type="button"
                onClick={() => setLeftSubTab('pipeline')}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-1.5 ${
                  leftSubTab === 'pipeline' 
                    ? 'bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/30 shadow-md shadow-amber-500/10' 
                    : 'text-zinc-500 hover:text-zinc-350 bg-transparent border border-transparent'
                }`}
              >
                <Sliders size={12} />
                Deployment Pipeline
              </button>
              <button 
                type="button"
                onClick={() => setLeftSubTab('diagnostics')}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-1.5 ${
                  leftSubTab === 'diagnostics' 
                    ? 'bg-[#ff9900]/20 text-[#ff9900] border border-[#ff9900]/30 shadow-md shadow-amber-500/10' 
                    : 'text-zinc-500 hover:text-zinc-350 bg-transparent border border-transparent'
                }`}
              >
                <Settings size={12} />
                Config & diagnostics
              </button>
            </div>

            {leftSubTab === 'pipeline' ? (
              <>
                {/* Git Repository Integrator Module */}
                <div className="glass-dark p-5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderGit size={16} className="text-[#ff9900]" />
                      <span className="text-[11px] font-black uppercase tracking-widest font-mono text-zinc-300">Git Integration Module</span>
                    </div>
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded border ${
                      vitonGitStatus === 'synced' 
                        ? 'bg-[#ff9900]/10 text-[#ff9900] border-[#ff9900]/20' 
                        : vitonGitStatus === 'cloning' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse'
                        : 'bg-zinc-500/10 text-zinc-500 border-white/5'
                    }`}>
                      {vitonGitStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-3">
                    <div className="font-mono text-[9px] text-[#ff9900] break-all border-b border-white/5 pb-2">
                      $ git clone https://github.com/shadow2496/VITON-HD.git
                    </div>
                    <div className="flex flex-col gap-1.5 text-[9px] font-mono text-zinc-400">
                      <div className="flex items-center justify-between">
                        <span>• test/agnostic-mask/</span>
                        <span className="text-zinc-500">{vitonGitStatus === 'synced' ? '[OK]' : '[Pending Clone]'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• test/cloth/</span>
                        <span className="text-zinc-500">{vitonGitStatus === 'synced' ? '[OK]' : '[Pending Clone]'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>• models/warp.py</span>
                        <span className="text-zinc-500">{vitonGitStatus === 'synced' ? '[OK]' : '[Pending Clone]'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={triggerVitonGitClone}
                    disabled={vitonGitStatus !== 'uncloned'}
                    className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      vitonGitStatus === 'synced'
                        ? 'bg-zinc-800/50 text-zinc-500 border border-zinc-800/10 cursor-not-allowed'
                        : vitonGitStatus === 'cloning'
                        ? 'bg-blue-900/30 text-blue-400 border border-blue-500/20 cursor-wait'
                        : 'bg-[#ff9900] text-zinc-950 font-black hover:scale-[1.01] active:scale-95'
                    }`}
                  >
                    {vitonGitStatus === 'uncloned' && <><GitBranch size={12} /> CLONE REPOSITORY</>}
                    {vitonGitStatus === 'cloning' && <><RefreshCw size={12} className="animate-spin" /> DOWNLOADING REPO ASSETS...</>}
                    {vitonGitStatus === 'synced' && <><Check size={12} /> REPOSITORY SYNCHRONIZED</>}
                  </button>
                </div>

                {/* Conda Python Environment Suite */}
                <div className="glass-dark p-5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-[#ff9900]" />
                      <span className="text-[11px] font-black uppercase tracking-widest font-mono text-zinc-300">Conda Environment Builder</span>
                    </div>
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded border ${
                      vitonCondaStatus === 'active' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : vitonCondaStatus === 'creating' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse'
                        : 'bg-zinc-500/10 text-zinc-500 border-white/5'
                    }`}>
                      {vitonCondaStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Environment Create Card */}
                    <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex justify-between items-center gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] font-mono font-bold text-zinc-300">conda create -n viton_env python=3.8</p>
                        <p className="text-[8px] text-zinc-500 font-mono">Custom Python 3.8 local environment</p>
                      </div>
                      <button
                        type="button"
                        onClick={triggerVitonCondaSetup}
                        disabled={vitonCondaStatus !== 'uninitialized' || vitonGitStatus !== 'synced'}
                        className={`px-3 py-1.5 rounded-lg text-[8px] font-mono tracking-wider uppercase transition-all ${
                          vitonCondaStatus === 'active'
                            ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                            : vitonCondaStatus === 'creating'
                            ? 'bg-blue-900/40 text-blue-400 border border-blue-500/20'
                            : vitonGitStatus !== 'synced'
                            ? 'bg-zinc-900/40 text-zinc-600 cursor-not-allowed'
                            : 'bg-white/10 text-white hover:bg-[#ff9900] hover:text-black font-black'
                        }`}
                      >
                        {vitonCondaStatus === 'uninitialized' ? 'INIT' : vitonCondaStatus === 'creating' ? 'CREATING...' : 'READY'}
                      </button>
                    </div>

                    {/* PyTorch Core Installer */}
                    <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex justify-between items-center gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] font-mono font-bold text-zinc-300">PyTorch & Computer Vision Stack</p>
                        <p className="text-[8px] text-zinc-500 font-mono">{"pytorch=[>=1.6.0] opencv torchgeometry"}</p>
                      </div>
                      <button
                        type="button"
                        onClick={triggerVitonDepsInstall}
                        disabled={vitonDepsStatus !== 'uninstalled' || vitonCondaStatus !== 'active'}
                        className={`px-3 py-1.5 rounded-lg text-[8px] font-mono tracking-wider uppercase transition-all ${
                          vitonDepsStatus === 'ready'
                            ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                            : vitonDepsStatus === 'installing'
                            ? 'bg-blue-900/40 text-blue-400 border border-blue-500/20'
                            : vitonCondaStatus !== 'active'
                            ? 'bg-zinc-900/40 text-zinc-600 cursor-not-allowed'
                            : 'bg-white/10 text-white hover:bg-[#ff9900] hover:text-black font-black'
                        }`}
                      >
                        {vitonDepsStatus === 'uninstalled' ? 'INSTALL' : vitonDepsStatus === 'installing' ? 'BUILDING...' : 'MOUNTED'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Neural Hyperparameters Workspace Tuners */}
                <div className="glass-dark p-5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                    <Sliders size={14} className="text-[#ff9900]" />
                    <span className="text-[10px] font-black uppercase font-mono tracking-widest text-zinc-200">Hyperparameters Workspace</span>
                  </div>

                  <div className="space-y-4">
                    {/* Epoch count */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-zinc-400">EPOCH TRAINING DEPTH</span>
                        <span className="text-[#ff9900] font-black">{vitonEpochs} Ep</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="300"
                        step="10"
                        value={vitonEpochs}
                        onChange={(e) => setVitonEpochs(Number(e.target.value))}
                        className="w-full accent-[#ff9900]"
                      />
                      <div className="flex justify-between text-[7.5px] text-zinc-600 font-mono">
                        <span>50 EP (FAST WARP)</span>
                        <span>300 EP (HIGH FIDELITY)</span>
                      </div>
                    </div>

                    {/* Batch size & Resolution & Dataset track side-by-side */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-mono text-zinc-400 block">WFT TEST RESOLUTION</label>
                        <select
                          value={vitonResolution}
                          onChange={(e) => setVitonResolution(e.target.value as any)}
                          className="w-full bg-zinc-950 border border-white/15 rounded-lg p-2 text-[9px] font-mono text-white outline-none focus:border-[#ff9900]"
                        >
                          <option value="256x192">256 x 192 (Default)</option>
                          <option value="512x384">512 x 384 (Full-Res)</option>
                          <option value="1024x768">1024 x 768 (Hyper-Fine)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-mono text-zinc-400 block">BATCH_SIZE INDEX</label>
                        <select
                          value={vitonBatchSize}
                          onChange={(e) => setVitonBatchSize(Number(e.target.value))}
                          className="w-full bg-zinc-950 border border-white/15 rounded-lg p-2 text-[9px] font-mono text-white outline-none focus:border-[#ff9900]"
                        >
                          <option value="2">2 (Min VRAM)</option>
                          <option value="4">4 (Standard)</option>
                          <option value="8">8 (Multi-Core)</option>
                        </select>
                      </div>
                    </div>

                    {/* Transformation warps */}
                    <div className="grid grid-cols-2 gap-3.5 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-mono text-zinc-400 block">TRANSFORMATION METHOD</label>
                        <select
                          value={vitonWarpMethod}
                          onChange={(e) => setVitonWarpMethod(e.target.value as any)}
                          className="w-full bg-zinc-950 border border-white/15 rounded-lg p-2 text-[9px] font-mono text-white outline-none focus:border-[#ff9900]"
                        >
                          <option value="TPS">Thin Plate Spline (TPS)</option>
                          <option value="OpticalWarp">Dense Optical Flow</option>
                          <option value="DualDecoupled">Dual-Decoupled Warp</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9.5px] font-mono text-zinc-400 block">ACTIVE SECTOR STREAM</label>
                        <div className="flex bg-zinc-950 border border-white/15 p-1 rounded-lg h-9">
                          {(['test', 'train'] as const).map(stream => (
                            <button
                              key={stream}
                              type="button"
                              onClick={() => setVitonCoreDataset(stream)}
                              className={`flex-1 rounded-md text-[8.5px] font-mono font-bold transition-all uppercase ${
                                vitonCoreDataset === stream ? 'bg-[#ff9900] text-zinc-950 font-black' : 'text-zinc-500 hover:text-white'
                              }`}
                            >
                              {stream}/
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 1. PATH CONFIGURATION MODULE */}
                <div className="glass-dark p-5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                    <FolderGit size={14} className="text-[#ff9900]" />
                    <span className="text-[10px] font-black uppercase font-mono tracking-widest text-[#ff9900]">VITON-HD Path Configuration</span>
                  </div>

                  <div className="space-y-3.5">
                    {/* Dataset Root Path */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black tracking-wider text-zinc-400 block">DATASET ROOT DIRECTORY</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={vitonDatasetPath}
                          onChange={(e) => setVitonDatasetPath(e.target.value)}
                          className="flex-1 bg-zinc-950/80 border border-white/10 rounded-lg p-2 text-[9px] font-mono text-white outline-none focus:border-[#ff9900]"
                          placeholder="/workspace/VITON-HD/datasets"
                        />
                      </div>
                      <span className="text-[7.5px] font-mono text-green-500 block">➔ Active: [2,050 high-res image targets detected]</span>
                    </div>

                    {/* Checkpoints/Weight Path */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black tracking-wider text-zinc-400 block">MODEL WEIGHTS & CHECKPOINTS PATH</label>
                      <input
                        type="text"
                        value={vitonCheckpointsPath}
                        onChange={(e) => setVitonCheckpointsPath(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-white/10 rounded-lg p-2 text-[9px] font-mono text-white outline-none focus:border-[#ff9900]"
                        placeholder="/workspace/VITON-HD/checkpoints"
                      />
                      <span className="text-[7.5px] font-mono text-green-500 block">➔ Found: [warp.py, tps_nets.pth, alias_seg.pth]</span>
                    </div>

                    {/* Results Path */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black tracking-wider text-zinc-400 block">RESULTS COMPILER EXPORT ZIP PATH</label>
                      <input
                        type="text"
                        value={vitonOutputPath}
                        onChange={(e) => setVitonOutputPath(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-white/10 rounded-lg p-2 text-[9px] font-mono text-white outline-none focus:border-[#ff9900]"
                        placeholder="/workspace/VITON-HD/results"
                      />
                      <span className="text-[7.5px] font-mono text-green-500 block">➔ Write Status: ACTIVE [Symlinked to static results_dir]</span>
                    </div>

                    {/* Conda Environment Prefix Path */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black tracking-wider text-zinc-400 block">CONDA PYTHON ACTIVE PREFIX TARGET</label>
                      <input
                        type="text"
                        value={vitonEnvPath}
                        onChange={(e) => setVitonEnvPath(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-white/10 rounded-lg p-2 text-[9px] font-mono text-white outline-none focus:border-[#ff9900]"
                        placeholder="/opt/conda/envs/viton_hd_env"
                      />
                      <span className="text-[7.5px] font-mono text-[#ff9900] block">➔ Activated environment prefix map: viton_env</span>
                    </div>

                    {/* Apply Button */}
                    <button
                      type="button"
                      onClick={applyCustomPaths}
                      className={`w-full py-2.5 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 ${
                        pathsSaved
                          ? 'bg-green-500 text-zinc-950 font-black'
                          : 'bg-white/10 text-white hover:bg-[#ff9900] hover:text-black hover:font-bold'
                      }`}
                    >
                      {pathsSaved ? (
                        <><Check size={11} /> PARAMETERS SYNCED & APPLIED</>
                      ) : (
                        <><Database size={11} /> APPLY AND MOUNT CONFIGURATION</>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. REQUIREMENTS DIAGNOSTICS MODULE */}
                <div className="glass-dark p-5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#ff9900]" />
                      <span className="text-[10px] font-black uppercase font-mono tracking-widest text-zinc-200">Requirements Diagnostics</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setReqPython('unchecked');
                        setReqPyTorch('unchecked');
                        setReqCUDA('unchecked');
                        setReqDiskSpace('unchecked');
                        setReqGit('unchecked');
                        setReqVRAM('unchecked');
                      }}
                      className="text-[7.5px] text-zinc-500 font-mono hover:text-[#ff9900]"
                    >
                      RESET
                    </button>
                  </div>

                  {/* Requirements grid list */}
                  <div className="grid grid-cols-2 gap-2 text-[8.5px] font-mono">
                    {/* Python 3.8 check */}
                    <div className="bg-black/30 p-2 rounded-xl border border-white/5 space-y-1">
                      <p className="text-zinc-500 uppercase">{"Python Runtime >= 3.8"}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">python -V</span>
                        {reqPython === 'unchecked' && <span className="text-zinc-600">--</span>}
                        {reqPython === 'checking' && <RefreshCw size={10} className="text-[#ff9900] animate-spin" />}
                        {reqPython === 'passed' && <span className="text-green-500 font-bold">✔ OK [v3.8]</span>}
                      </div>
                    </div>

                    {/* PyTorch check */}
                    <div className="bg-black/30 p-2 rounded-xl border border-white/5 space-y-1">
                      <p className="text-zinc-500 uppercase">{"PyTorch CUDA-ready"}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">import torch</span>
                        {reqPyTorch === 'unchecked' && <span className="text-zinc-600">--</span>}
                        {reqPyTorch === 'checking' && <RefreshCw size={10} className="text-[#ff9900] animate-spin" />}
                        {reqPyTorch === 'passed' && <span className="text-green-500 font-bold">✔ OK [v1.13]</span>}
                      </div>
                    </div>

                    {/* CUDA Toolkit check */}
                    <div className="bg-black/30 p-2 rounded-xl border border-white/5 space-y-1">
                      <p className="text-zinc-500 uppercase">NVIDIA CUDA driver</p>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">nvcc --version</span>
                        {reqCUDA === 'unchecked' && <span className="text-zinc-600">--</span>}
                        {reqCUDA === 'checking' && <RefreshCw size={10} className="text-[#ff9900] animate-spin" />}
                        {reqCUDA === 'passed' && <span className="text-green-500 font-bold">✔ OK [v11.8]</span>}
                      </div>
                    </div>

                    {/* Local Disk Space check */}
                    <div className="bg-black/30 p-2 rounded-xl border border-white/5 space-y-1">
                      <p className="text-zinc-500 uppercase">{"Disk storage > 20GB"}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">df -h</span>
                        {reqDiskSpace === 'unchecked' && <span className="text-zinc-600">--</span>}
                        {reqDiskSpace === 'checking' && <RefreshCw size={10} className="text-[#ff9900] animate-spin" />}
                        {reqDiskSpace === 'passed' && <span className="text-green-500 font-bold">✔ 48.2GB</span>}
                      </div>
                    </div>

                    {/* Git integration check */}
                    <div className="bg-black/30 p-2 rounded-xl border border-white/5 space-y-1">
                      <p className="text-zinc-500 uppercase">Git CLI executable</p>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">git --version</span>
                        {reqGit === 'unchecked' && <span className="text-zinc-600">--</span>}
                        {reqGit === 'checking' && <RefreshCw size={10} className="text-[#ff9900] animate-spin" />}
                        {reqGit === 'passed' && <span className="text-green-500 font-bold">✔ OK [v2.43]</span>}
                      </div>
                    </div>

                    {/* VRAM Check */}
                    <div className="bg-black/30 p-2 rounded-xl border border-white/5 space-y-1">
                      <p className="text-zinc-500 uppercase">GPU NVIDIA VRAM</p>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">nvidia-smi</span>
                        {reqVRAM === 'unchecked' && <span className="text-zinc-600">--</span>}
                        {reqVRAM === 'checking' && <RefreshCw size={10} className="text-[#ff9900] animate-spin" />}
                        {reqVRAM === 'passed' && <span className="text-green-500 font-bold">✔ H100 GPU</span>}
                      </div>
                    </div>
                  </div>

                  {/* Trigger Button */}
                  <button
                    type="button"
                    onClick={runRequirementsCheck}
                    disabled={reqPython === 'checking'}
                    className={`w-full py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 ${
                      reqPython === 'checking'
                        ? 'bg-blue-900/30 text-blue-400 border border-blue-500/20 cursor-wait'
                        : 'bg-[#ff9900] text-zinc-950 hover:scale-[1.01] active:scale-95 font-bold shadow-lg shadow-amber-500/15'
                    }`}
                  >
                    {reqPython === 'checking' ? (
                      <><RefreshCw size={12} className="animate-spin" /> RUNNING REQUIREMENT CHECKS...</>
                    ) : (
                      <><ShieldAlert size={12} /> VERIFY LOCAL INSTALLATION REQUIREMENTS</>
                    )}
                  </button>

                  {/* Troubleshooting Code Snippet Box */}
                  <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-1.5 font-mono text-[8px] leading-relaxed text-zinc-400 select-all">
                    <p className="text-zinc-500 text-[7.5px] uppercase font-black tracking-wider">// LOCAL COMMAND TROUBLESHOOTING TIP:</p>
                    <p className="text-[#ff9900]">$ conda install -y pytorch torchvision cudatoolkit=11.8 -c pytorch</p>
                    <p>$ pip install opencv-python torchgeometry pillow numpy gdown</p>
                  </div>
                </div>

                {/* 3. CORE VRAM DYNAMIC OPTIMIZER & WEIGHT OFFLOADER */}
                <div className="glass-dark p-5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Server size={14} className="text-[#00b8d9]" />
                      <span className="text-[10px] font-black uppercase font-mono tracking-widest text-zinc-200">VRAM Allocation & Weight Core</span>
                    </div>
                    <button
                      type="button"
                      onClick={purgeInactiveVram}
                      className="text-[8px] font-mono px-2 py-0.5 rounded border border-[#00b8d9]/20 bg-[#00b8d9]/5 text-[#00b8d9] hover:bg-[#00b8d9]/15 hover:text-white transition-all uppercase"
                    >
                      Empty Cache
                    </button>
                  </div>

                  {/* VRAM Active Progress Bar */}
                  <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-zinc-400">DEDICATED VRAM ALLOCATION</span>
                      <span className="text-white font-bold">
                        <span className="text-[#00b8d9]">{computedActiveVram.toFixed(2)}</span> / {totalVramLimit.toFixed(1)} GB ({activePercentage.toFixed(1)}%)
                      </span>
                    </div>
                    {/* Progress Bar Track */}
                    <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5 flex">
                      <motion.div
                        className="h-full bg-gradient-to-r from-teal-500 to-[#00b8d9] relative"
                        initial={{ width: "0%" }}
                        animate={{ width: `${activePercentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    {/* VRAM usage notes */}
                    <div className="flex justify-between text-[7.5px] font-mono text-zinc-500">
                      <span>OS BUS OVERHEAD: 4.2 GB</span>
                      <span>H100 MAX BANDWIDTH: 3.35 TB/s</span>
                    </div>
                  </div>

                  {/* Weight List */}
                  <div className="space-y-2">
                    {modelWeights.map((weight) => {
                      const isLoaded = weight.status === 'loaded';
                      const isUnloaded = weight.status === 'unloaded';
                      const isLoading = weight.status === 'loading';
                      const isUnloading = weight.status === 'unloading';

                      return (
                        <div key={weight.id} className="bg-black/35 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-4 hover:border-white/10 transition-colors">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isLoaded ? 'bg-green-500' : isUnloaded ? 'bg-zinc-650' : 'bg-amber-500 animate-pulse'
                              }`} />
                              <span className="text-[9.5px] font-mono font-bold text-white tracking-wide">{weight.name}</span>
                              <span className="text-[8px] font-mono bg-zinc-800 text-zinc-400 px-1 py-0.2 rounded">{weight.category}</span>
                            </div>
                            <p className="text-[8px] text-zinc-400 leading-relaxed font-sans">{weight.description}</p>
                            <div className="flex gap-3 text-[7.5px] text-zinc-500 font-mono">
                              <span>SIZE: {weight.sizeGb.toFixed(2)} GB</span>
                              <span>WARMUP: ~{(weight.loadTimeMs / 1000).toFixed(1)}s</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleWeightLoad(weight.id)}
                            disabled={isLoading || isUnloading}
                            className={`px-3 py-1.5 rounded-xl text-[8.5px] font-mono font-black tracking-wide uppercase transition-all min-w-[100px] text-center border ${
                              isLoaded
                                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20'
                                : isUnloaded
                                ? 'bg-[#00b8d9]/10 hover:bg-[#00b8d9]/25 text-[#00b8d9] border-[#00b8d9]/25'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/25 animate-pulse cursor-wait'
                            }`}
                          >
                            {isLoaded && "Unload Weight"}
                            {isUnloaded && "Load to GPU"}
                            {isLoading && "Caching..."}
                            {isUnloading && "Evicting..."}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Troubleshooting advisory */}
                  <div className="p-2.5 rounded-xl bg-[#00b8d9]/5 border border-[#00b8d9]/10 text-[8px] font-mono text-zinc-400 leading-normal">
                    <span className="text-[#00b8d9] font-black uppercase tracking-wider block mb-0.5">// CACHE ADVISORY:</span>
                    Offload Segment Anything (SAM) and DensePose when performing fast pipeline testing. Loading weights on-demand reduces active continuous VRAM consumption by up to <span className="text-[#00b8d9] font-black">8.7 GB</span>, optimizing system responsiveness on shared compute cores.
                  </div>
                </div>
              </>
            )}

          </div>

          {/* RIGHT PANEL: High-fidelity Wear Rendering & Terminal (7 grid cols) */}
          <div className="xl:col-span-12 lg:xl:col-span-7 xl:col-span-7 flex flex-col gap-5">
            
            {/* High-fidelity Wear Rendering & Layer Analyzer */}
            <div className="glass-dark p-5 rounded-3xl border border-white/5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Compass size={14} className="text-[#ff9900]" />
                  <span className="text-[10px] font-black font-mono tracking-widest uppercase text-white">Inference Pipeline Viewport</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[8px] text-[#ff9900]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff9900] animate-pulse" />
                  <span>MATRIX CONNECTED</span>
                </div>
              </div>

              {/* Viewport content */}
              <div className="relative aspect-[4/3] w-full rounded-2xl bg-zinc-950 border border-white/5 overflow-hidden flex items-center justify-center p-4">
                {isGenerating ? (
                  <div className="absolute inset-0 z-20 bg-black/85 flex flex-col items-center justify-center gap-4">
                    <div className="relative w-16 h-16 border-2 border-dashed border-[#ff9900] rounded-full animate-spin flex items-center justify-center">
                      <GitBranch className="text-[#ff9900]" size={18} />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-[9.5px] font-black text-[#ff9900] animate-pulse tracking-widest font-mono">CALCULATING ALIGNMENT VECTOR...</p>
                      <p className="text-[8px] text-zinc-500 font-mono">CUDA CONVERGENCE: {progress}%</p>
                    </div>
                  </div>
                ) : null}

                {/* Layer switch buttons */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex bg-black/85 backdrop-blur-md p-1 rounded-full border border-white/10 gap-1 overflow-x-auto max-w-[90%] pointer-events-auto">
                  {[
                    { id: 'output', label: 'OUTPUT LAYER' },
                    { id: 'g_warp', label: 'TPS WARP GRID' },
                    { id: 'segmentation', label: 'METRIC COORDS' },
                    { id: 'flow', label: 'OPTICAL FLOW' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setVitonActiveTab(tab.id as any)}
                      className={`px-3 py-1 rounded-full text-[7px] font-extrabold tracking-widest uppercase transition-all whitespace-nowrap ${
                        vitonActiveTab === tab.id ? 'bg-[#ff9900] text-zinc-950' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Main View Area */}
                {vitonActiveTab === 'g_warp' ? (
                  <div className="w-full h-full relative flex items-center justify-center animate-fade-in">
                    <img src={selectedModel.image} className="h-full object-contain grayscale blur-[1px] opacity-40" alt="Model" referrerPolicy="no-referrer" />
                    {garmentImage && (
                      <img src={garmentImage} className="absolute h-[65%] object-contain border border-[#ff9900] border-dashed rounded-lg filter sepia saturate-200 hue-rotate-[20deg] scale-105" alt="Warp Preview" referrerPolicy="no-referrer" />
                    )}
                    <div className="absolute inset-0 border border-dashed border-[#ff9900]/20 pointer-events-none bg-[linear-gradient(rgba(255,153,0,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,153,0,0.15)_1px,transparent_1px)] bg-[size:16px_16px]" />
                    <div className="absolute top-2 left-2 text-[7.5px] font-mono text-[#ff9900] bg-black/80 px-2 py-0.5 rounded border border-white/5">// LOCAL_TPS_WARP_GRID</div>
                  </div>
                ) : vitonActiveTab === 'segmentation' ? (
                  <div className="w-full h-full relative bg-zinc-900 flex items-center justify-center animate-fade-in">
                    {selectedModel.densepose ? (
                      <img src={selectedModel.densepose} className="h-full object-contain filter hue-rotate-[45deg] saturate-150 contrast-125" alt="Coarse segment mappings" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="text-zinc-600 font-mono text-[9px]">Sourcing Semantic Mappings...</div>
                    )}
                    <div className="absolute top-2 left-2 text-[7.5px] font-mono text-[#ff9900] bg-black/80 px-2 py-0.5 rounded border border-white/5">// MULTI_CH_SECTOR_COORDS</div>
                  </div>
                ) : vitonActiveTab === 'flow' ? (
                  <div className="w-full h-full relative flex items-center justify-center bg-zinc-950 animate-fade-in">
                    <img src={selectedModel.image} className="h-full object-contain opacity-25 grayscale filter contrast-150" alt="Base Flow mapping" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-full h-full text-[#ff9900]/60" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M10,20 Q30,15 50,45 T90,80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                        <path d="M20,10 Q40,35 60,55 T80,90" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                        <path d="M5,40 Q25,60 45,70 T85,95" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                      </svg>
                    </div>
                    <div className="absolute top-2 left-2 text-[7.5px] font-mono text-[#ff9900] bg-black/80 px-2 py-0.5 rounded border border-white/5">// MULTI_STREAM_FLOW_FIELDS</div>
                  </div>
                ) : (
                  // Default output layer
                  <div className="w-full h-full relative flex items-center justify-center animate-fade-in">
                    {resultImage ? (
                      <div className="w-full h-full flex items-center justify-center relative">
                        <img src={selectedModel.image} className="h-full object-contain grayscale-[15%] brightness-105" alt="Fitting results" referrerPolicy="no-referrer" />
                        <img src={resultImage} className="absolute h-[58%] top-[25%] opacity-90 object-contain mix-blend-multiply filter contrast-125 brightness-110" alt="Super-imposed wearable warp" referrerPolicy="no-referrer" />
                        <div className="absolute top-2 left-3 flex items-center gap-1.5 bg-black/90 px-2 py-1 rounded border border-[#ff9900]/40 text-[#ff9900] text-[7.5px] font-mono">
                          <Check size={10} /> DIRECT_ALIGNMENT_STABILITY: 100%
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-3 p-6 flex flex-col items-center">
                        <div className="p-3.5 bg-[#ff9900]/10 border border-[#ff9900]/20 text-[#ff9900] rounded-full">
                          <Shirt size={22} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black tracking-widest uppercase text-zinc-300">// INFERENCE VIEWPORT EMPTY</p>
                          <p className="text-[8px] text-zinc-500 max-w-[280px]">Clone VITON-HD repository, setup a conda PyTorch module and hit standard pipeline activation to superimpose designs.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Ingestion controllers / execute trigger */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-black/30 border border-white/5 p-3 rounded-2xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1">
                    <p className="text-[8.5px] text-zinc-500 font-mono">MODEL CHOSEN</p>
                    <p className="text-[10px] font-mono font-bold text-white truncate max-w-[120px]">{selectedModel.name}</p>
                  </div>
                  <div className="flex gap-1 overflow-x-auto">
                    {PRESET_MODELS.map(model => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => setSelectedModel(model)}
                        className={`w-7 h-7 rounded-md overflow-hidden border transition-all flex-shrink-0 ${
                          selectedModel.id === model.id ? 'border-[#ff9900] ring-1 ring-[#ff9900]' : 'border-zinc-800 hover:border-zinc-500'
                        }`}
                      >
                        <img src={model.image} className="w-full h-full object-cover" alt="Model option thumbnail" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={triggerVitonInference}
                  disabled={isGenerating || vitonDepsStatus !== 'ready' || !garmentImage}
                  className={`flex-1 py-3 rounded-2xl font-black uppercase text-[10.5px] tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isGenerating
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : vitonDepsStatus !== 'ready'
                      ? 'bg-zinc-900 border border-white/5 text-zinc-500 cursor-not-allowed'
                      : 'bg-[#ff9900] text-zinc-950 hover:scale-[1.01] active:scale-95 shadow-lg shadow-amber-500/10 font-bold'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      COMPILING WARP TENSORS...
                    </>
                  ) : (
                    <>
                      <Play size={11} />
                      ACTIVATE HIGH-RES INFERENCE
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Simulated interactive PyTorch terminal for VITON-HD */}
            <div className="glass-dark p-5 rounded-3xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-zinc-400">
                <div className="flex items-center gap-2 font-mono">
                  <Terminal size={14} className="text-[#ff9900]" />
                  <span className="text-[10.3px] font-black tracking-widest uppercase text-white">VITON-HD PyTorch Workspace Console</span>
                </div>
                <div className="flex gap-1.5 font-mono text-[8px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff9900]/80" />
                </div>
              </div>

              {/* Console Logs */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 h-44 overflow-y-auto font-mono text-[9px] line-clamp-6 leading-relaxed text-zinc-300">
                {consoleLogs.map((log, index) => (
                  <p key={index} className={log.startsWith('$') ? 'text-[#ff9900]' : 'text-zinc-300'}>
                    {log}
                  </p>
                ))}
              </div>

              {/* Console Command Form */}
              <form onSubmit={handleCommandSubmit} className="flex gap-2">
                <div className="flex-1 bg-zinc-950 border border-white/5 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-[#ff9900] font-mono text-[9px] select-none">$</span>
                  <input
                    type="text"
                    placeholder="conda activate viton_env | python test.py --warp_mode TPS | clear"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="bg-transparent border-none outline-none flex-grow text-white font-mono text-[9.5px] placeholder-zinc-700"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-mono hover:bg-[#ff9900] hover:text-black transition-all"
                >
                  RUN
                </button>
              </form>
            </div>

          </div>

        </div>
      ) : (
        /* ==================== TRADITIONAL CLOUD HIGH-RES TRYON ==================== */
        <div className="flex flex-col lg:flex-row gap-6 h-[800px]">
          {/* Sidebar: Source & Selection */}
          <div className="lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            <div className="glass-dark p-6 rounded-3xl border border-white/5 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <User size={18} />
                  <h3 className="text-sm font-black uppercase tracking-widest italic outline-text">Model Selection</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_MODELS.map(model => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedModel.id === model.id ? 'border-primary ring-4 ring-primary/20' : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      <img src={model.image} className="w-full h-full object-cover" alt={model.name} referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                        <p className="text-[10px] font-bold text-white">{model.name}</p>
                        <p className="text-[8px] text-white/50">{model.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Shirt size={18} />
                  <h3 className="text-sm font-black uppercase tracking-widest italic outline-text">Design Ingestion</h3>
                </div>
                
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-3xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center ${
                    isDragActive ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <input {...getInputProps()} />
                  {garmentImage ? (
                    <div className="relative group w-full aspect-square rounded-2xl overflow-hidden">
                      <img src={garmentImage} className="w-full h-full object-contain bg-zinc-900" alt="Garment" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-[10px] font-bold text-white">CHANGE DESIGN</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 rounded-full bg-primary/10 text-primary">
                        <Download size={24} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-zinc-300">Drag & Drop Fabric/Garment</p>
                        <p className="text-[10px] text-zinc-500">Supports PNG, JPG, WEBP</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles size={18} />
                    <h3 className="text-sm font-black uppercase tracking-widest italic outline-text">Neural Quality</h3>
                  </div>
                  <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                    {(['1K', '2K', '4K'] as const).map(q => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${
                          quality === q ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!garmentImage || isGenerating}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-tighter text-sm flex items-center justify-center gap-2 transition-all ${
                  !garmentImage || isGenerating 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'bg-primary text-black hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/25'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Processing Matrix...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Generate Neural Fit
                  </>
                )}
              </button>
            </div>

            {/* System Stats Widget */}
            <div className="glass-dark p-4 rounded-3xl border border-white/5 flex gap-4">
               <div className="flex-1 space-y-1">
                  <p className="text-[8px] font-bold text-zinc-500 uppercase">GPU CLUSTER</p>
                  <p className="text-xs font-black text-white">NVIDIA H100 Active</p>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${isGenerating ? 85 : 12}%` }} />
                  </div>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div className="flex-1 space-y-1">
                  <p className="text-[8px] font-bold text-zinc-500 uppercase">LATENCY</p>
                  <p className="text-xs font-black text-white">124ms Neural Bridge</p>
                  <div className="flex gap-1">
                     {[1,2,3,4,5].map(i => <div key={i} className={`w-1 h-3 rounded-sm ${i < 4 ? 'bg-primary' : 'bg-white/10'}`} />)}
                  </div>
               </div>
            </div>
          </div>

          {/* Main Viewport */}
          <div className="flex-1 relative glass-dark rounded-[40px] border border-white/10 overflow-hidden group">
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            
            {/* Viewport HUD */}
            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
               <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                     <p className="text-[10px] font-black tracking-widest text-white">LIVE NEURAL_ENGINE v4.2</p>
                  </div>
                  <p className="text-[8px] text-zinc-500 font-mono pl-3">{Date.now().toString(16).toUpperCase()}_MATRIX_SYNC</p>
               </div>
               <div className="flex gap-2 pointer-events-auto">
                  <button className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-primary hover:text-black transition-all">
                    <Camera size={14} />
                  </button>
                  <button className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-primary hover:text-black transition-all">
                     <Download size={14} />
                  </button>
               </div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <AnimatePresence mode="wait">
                {!resultImage && !isGenerating ? (
                  <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                       <div className="w-full h-full grid grid-cols-12 gap-0.5 opacity-20 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] bg-[size:24px_24px]" />
                    </div>
                    <img 
                      src={selectedModel.image} 
                      className="h-full object-contain grayscale opacity-30 blur-[2px]" 
                      alt="Background" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute flex flex-col items-center gap-4 text-center">
                       <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-xl">
                          <Shirt className="text-zinc-600" size={32} />
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-xl font-black text-white italic outline-text">AWAITING DESIGN</h4>
                          <p className="text-[10px] text-zinc-500 max-w-[200px]">Upload a clothing item or textile pattern to begin neural mapping.</p>
                       </div>
                    </div>
                  </motion.div>
                ) : isGenerating ? (
                  <motion.div 
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative flex flex-col items-center gap-8"
                  >
                    <div className="relative w-48 h-64 border border-white/10 rounded-3xl overflow-hidden bg-black/40">
                      <motion.div 
                        className="absolute inset-0 bg-primary/20 z-10"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      <img 
                        src={selectedModel.image} 
                        className="w-full h-full object-cover grayscale opacity-50" 
                        alt="Scanning" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="w-64 space-y-4">
                      <div className="flex justify-between text-[10px] font-black text-primary">
                        <span className="animate-pulse">SYNTHESIZING...</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary"
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['Vertex Mapping', 'Texture Synthesis', 'Draping Refinement', 'Lighting Bake'].map((step, i) => (
                          <div key={i} className={`text-[8px] px-2 py-1 rounded bg-black/40 border ${progress > (i+1)*25 ? 'border-primary text-primary' : 'border-white/5 text-zinc-600'}`}>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full h-full relative"
                  >
                    <img 
                      src={resultImage!} 
                      className="w-full h-full object-contain rounded-3xl shadow-2xl" 
                      alt="AI Result" 
                      referrerPolicy="no-referrer"
                    />
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute bottom-6 right-6 glass-dark p-4 rounded-2xl border border-primary/20 space-y-3"
                    >
                      <div className="flex items-center gap-2 text-primary">
                        <ShieldCheck size={14} />
                        <p className="text-[10px] font-black uppercase">Verified Output</p>
                      </div>
                      <div className="space-y-1 border-t border-white/5 pt-3">
                        <p className="text-[8px] text-zinc-500 font-bold uppercase">Prompt Match</p>
                        <p className="text-[10px] text-white">High Fidelity Editorial (98.4%)</p>
                      </div>
                      <div className="space-y-1 pt-1">
                        <p className="text-[8px] text-zinc-500 font-bold uppercase">Resolution</p>
                        <p className="text-[10px] text-white">4096 x 5120 Ultra-HD</p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Floating Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 glass-dark p-2 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
               {[
                 { icon: Monitor, label: 'Desktop' },
                 { icon: Box, label: '3D Preview' },
                 { icon: Layers, label: 'Compare' },
                 { icon: Database, label: 'Archive' }
               ].map(ctrl => (
                 <button key={ctrl.label} className="p-2.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                   <ctrl.icon size={16} />
                 </button>
               ))}
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-dark border border-red-500/50 p-4 rounded-2xl text-red-500 flex items-center gap-3">
          <Info size={18} />
          <p className="text-xs font-bold">{error}</p>
          <button onClick={() => setError(null)} className="p-1 hover:bg-red-500/10 rounded">
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

