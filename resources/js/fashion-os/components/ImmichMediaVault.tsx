import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Image, 
  Video, 
  MapPin, 
  Calendar, 
  Cpu, 
  User, 
  Folder, 
  Settings, 
  Download, 
  Share2, 
  Heart, 
  Archive, 
  Plus, 
  Grid, 
  Tag, 
  Sliders, 
  Globe, 
  Sparkles, 
  Key, 
  RefreshCw, 
  Play, 
  Pause, 
  Compass, 
  Eye, 
  Camera, 
  Lock, 
  Search, 
  LogOut, 
  SlidersHorizontal 
} from 'lucide-react';

interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'motion-photo' | 'panorama-360';
  url: string;
  thumbnailUrl: string;
  date: string;
  epoch: 'May 2026' | 'April 2026' | 'December 2025';
  size: string;
  format: 'RAW (.ARW)' | 'RAW (.CR3)' | 'TIFF' | 'JPEG' | 'DNG';
  favorite: boolean;
  archived: boolean;
  // EXIF fields
  cameraModel: string;
  lensModel: string;
  shutterSpeed: string;
  aperture: string;
  iso: number;
  focalLength: string;
  gps: {
    lat: number;
    lng: number;
    locationName: string;
  };
  // Inteligences Face Clustering and CLIP tags
  detectedFaces: string[];
  objectsDetected: string[];
  clipMatches: string[];
  // Backup owner
  owner: string;
}

// Global user list
const USER_PROFILES = [
  { id: 'dir-1', name: 'Creative Director (Bosisio)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', storageUsed: '412.8 GB', quota: '1 TB' },
  { id: 'stylist-2', name: 'Lead Campaign Stylist', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', storageUsed: '198.5 GB', quota: '500 GB' },
  { id: 'model-3', name: 'Studio Guest Reviewer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', storageUsed: '12.4 GB', quota: '50 GB' },
];

const INITIAL_ASSETS: MediaAsset[] = [
  {
    id: 'as-1',
    name: 'DSC_9281_MILAN_BRUTALIST_COAT.ARW',
    type: 'panorama-360', // Interactive 360-deg viewing item
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    date: '2026-05-18',
    epoch: 'May 2026',
    size: '84.2 MB',
    format: 'RAW (.ARW)',
    favorite: true,
    archived: false,
    cameraModel: 'Sony Alpha 1',
    lensModel: 'FE 50mm F1.2 GM',
    shutterSpeed: '1/400s',
    aperture: 'f/1.2',
    iso: 100,
    focalLength: '50mm',
    gps: { lat: 45.4642, lng: 9.1900, locationName: 'Duomo Square, Milan, Italy' },
    detectedFaces: ['Cara', 'Alex'],
    objectsDetected: ['Overcoat', 'Concrete Pillar', 'Streetwear', 'Brutalism Structure'],
    clipMatches: ['futuristic heavy textile outer layer with architectural lines', 'stark monochromatic design statement'],
    owner: 'Creative Director (Bosisio)'
  },
  {
    id: 'as-2',
    name: 'MV_9002_PARIS_SILK_DRAPING_MOTION.HEIC',
    type: 'motion-photo', // MotionPhoto playback support
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    date: '2026-05-14',
    epoch: 'May 2026',
    size: '12.4 MB',
    format: 'DNG',
    favorite: false,
    archived: false,
    cameraModel: 'Hasselblad X2D 100C',
    lensModel: 'XCD 38mm F2.5 V',
    shutterSpeed: '1/250s',
    aperture: 'f/2.8',
    iso: 64,
    focalLength: '38mm',
    gps: { lat: 48.8566, lng: 2.3522, locationName: 'Grand Palais, Paris, France' },
    detectedFaces: ['Kate'],
    objectsDetected: ['Neo-Silk Dress', 'Generative Drapery', 'Pastel Hue', 'White Studio Arc'],
    clipMatches: ['fluid silk sculpture wind animation', 'soft light rays illuminating hanging synthetic lace'],
    owner: 'Creative Director (Bosisio)'
  },
  {
    id: 'as-3',
    name: 'DSC_8490_SHIBUYA_CHROMIUM_SHIELD.CR3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    date: '2026-04-10',
    epoch: 'April 2026',
    size: '76.8 MB',
    format: 'RAW (.CR3)',
    favorite: true,
    archived: false,
    cameraModel: 'Canon EOS R3',
    lensModel: 'RF 85mm F1.2L USM DS',
    shutterSpeed: '1/800s',
    aperture: 'f/1.4',
    iso: 200,
    focalLength: '85mm',
    gps: { lat: 35.6580, lng: 139.7016, locationName: 'Shibuya Crossing, Tokyo, Japan' },
    detectedFaces: ['Cara', 'Leon'],
    objectsDetected: ['Metallic Shield', 'Reflective Jacket', 'Cyberpunk Neon Glow'],
    clipMatches: ['futuristic latex with mercury liquid reflection', 'tokyo rain puddle refraction portrait'],
    owner: 'Lead Campaign Stylist'
  },
  {
    id: 'as-4',
    name: 'BERLIN_MONO_CAMPAIGN_03.TIFF',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    date: '2025-12-05',
    epoch: 'December 2025',
    size: '143.5 MB',
    format: 'TIFF',
    favorite: false,
    archived: true,
    cameraModel: 'Fujifilm GFX 100 II',
    lensModel: 'GF 55mm F1.7 R WR',
    shutterSpeed: '1/160s',
    aperture: 'f/4.0',
    iso: 400,
    focalLength: '55mm',
    gps: { lat: 52.5200, lng: 13.4050, locationName: 'Tresor Concrete Yard, Berlin, Germany' },
    detectedFaces: ['Leon'],
    objectsDetected: ['Knit Oversized Vest', 'Brushed Aluminum Collar', 'Industrial Railing'],
    clipMatches: ['high contrast raw warehouse portrait', 'graphene woven structure design concept'],
    owner: 'Lead Campaign Stylist'
  },
  {
    id: 'as-5',
    name: 'DSC_9910_ALABASTER_KNIT_PARIS.ARW',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=1600&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=800&q=80',
    date: '2026-05-19',
    epoch: 'May 2026',
    size: '92.1 MB',
    format: 'RAW (.ARW)',
    favorite: false,
    archived: false,
    cameraModel: 'Sony Alpha 1',
    lensModel: 'FE 50mm F1.2 GM',
    shutterSpeed: '1/250s',
    aperture: 'f/2.2',
    iso: 160,
    focalLength: '50mm',
    gps: { lat: 48.8566, lng: 2.3522, locationName: 'Grand Palais, Paris, France' },
    detectedFaces: ['Kate', 'Alex'],
    objectsDetected: ['Off-white Knitwear', 'Asymmetric Framework', 'Minimal Backdrop'],
    clipMatches: ['architectural alabaster synth textile folds', 'contemporary paris lookbook design'],
    owner: 'Creative Director (Bosisio)'
  }
];

export const ImmichMediaVault: React.FC = () => {
  // State variables for Immich gallery
  const [assets, setAssets] = useState<MediaAsset[]>(INITIAL_ASSETS);
  const [activeUser, setActiveUser] = useState(USER_PROFILES[0]);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(INITIAL_ASSETS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Intelligent Search Filters
  const [selectedFace, setSelectedFace] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [selectedRawFormat, setSelectedRawFormat] = useState<string | null>(null);
  const [viewScope, setViewScope] = useState<'all' | 'favorites' | 'archived'>('all');

  // Album navigation states
  const [activeAlbumTab, setActiveAlbumTab] = useState<'all-photos' | 'albums' | 'admin-tools'>('all-photos');
  const [customAlbums, setCustomAlbums] = useState([
    { id: 'al-1', name: 'Milan Cyber Brutalism Campaign', count: 2, cover: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80', shared: true, contributors: 2 },
    { id: 'al-2', name: 'Paris Silk Drapery Dreams', count: 2, cover: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80', shared: false, contributors: 1 },
    { id: 'al-3', name: 'Shibuya Chrome Metallurgy', count: 1, cover: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80', shared: true, contributors: 3 },
  ]);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);

  // Timeline position slider state (months mapping)
  const [selectedTimelineEpoch, setSelectedTimelineEpoch] = useState<'all' | 'May 2026' | 'April 2026' | 'December 2025'>('all');

  // Interactive Custom Storage Path
  const [customStorageStructure, setCustomStorageStructure] = useState('/creative-vault/{year}/{month_name}/{camera_model}/{filename}');
  const [isPathSaved, setIsPathSaved] = useState(false);

  // LivePhoto motion playing simulation state
  const [livePlayingAssetId, setLivePlayingAssetId] = useState<string | null>(null);
  const [motionFrame, setMotionFrame] = useState(0);

  // 360-degree interactive viewer states
  const [pan360Deg, setPan360Deg] = useState(0);
  const [isPanning360, setIsPanning360] = useState(false);
  const [panStartX, setPanStartX] = useState(0);

  // Security parameters & Admin settings
  const [vaultAPIKey, setVaultAPIKey] = useState('immich_ai_node_bosisio_9210_live_v4');
  const [isKeyCopied, setIsKeyCopied] = useState(false);
  const [oauthStatus, setOauthStatus] = useState<'idle' | 'linking' | 'linked'>('linked');

  // Sync simulated frame rotation for LivePhotos when active
  useEffect(() => {
    let timer: any = null;
    if (livePlayingAssetId) {
      timer = setInterval(() => {
        setMotionFrame(prev => (prev + 1) % 6);
      }, 180);
    } else {
      setMotionFrame(0);
    }
    return () => clearInterval(timer);
  }, [livePlayingAssetId]);

  // Handle CLIP, Object, metadata search logic
  const filteredAssets = assets.filter(asset => {
    // Search Query (CLIP, title, EXIF body)
    const matchesSearch = searchQuery === '' || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.cameraModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.objectsDetected.some(o => o.toLowerCase().includes(searchQuery.toLowerCase())) ||
      asset.clipMatches.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFace = !selectedFace || asset.detectedFaces.includes(selectedFace);
    const matchesObject = !selectedObject || asset.objectsDetected.includes(selectedObject);
    const matchesFormat = !selectedRawFormat || asset.format === selectedRawFormat;
    const matchesEpoch = selectedTimelineEpoch === 'all' || asset.epoch === selectedTimelineEpoch;

    // View scope filter
    const matchesScope = 
      viewScope === 'all' ? !asset.archived :
      viewScope === 'favorites' ? asset.favorite && !asset.archived :
      asset.archived; // viewScope === 'archived'

    return matchesSearch && matchesFace && matchesObject && matchesFormat && matchesScope && matchesEpoch;
  });

  // Extract all faces & objects from asset database for clustering UI
  const allFaces = Array.from(new Set(assets.flatMap(a => a.detectedFaces)));
  const allObjects = Array.from(new Set(assets.flatMap(a => a.objectsDetected)));
  const allFormats = Array.from(new Set(assets.map(a => a.format)));

  // Generate public shares simulation
  const [copiedShareLink, setCopiedShareLink] = useState<string | null>(null);
  const triggerShareSimulation = (asset: MediaAsset) => {
    const link = `https://immich.creative.os/share/token_${asset.id}_f3d4`;
    navigator.clipboard.writeText(link);
    setCopiedShareLink(link);
    setTimeout(() => setCopiedShareLink(null), 3000);
  };

  // Archive and favorite toggle actions
  const toggleFavorite = (id: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        const nextFav = !a.favorite;
        if (selectedAsset && selectedAsset.id === id) {
          setSelectedAsset({ ...selectedAsset, favorite: nextFav });
        }
        return { ...a, favorite: nextFav };
      }
      return a;
    }));
  };

  const toggleArchive = (id: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        const nextArch = !a.archived;
        if (selectedAsset && selectedAsset.id === id) {
          setSelectedAsset({ ...selectedAsset, archived: nextArch });
        }
        return { ...a, archived: nextArch };
      }
      return a;
    }));
  };

  // Simulated 360-degree pan drag handling
  const handle360MouseDown = (e: React.MouseEvent) => {
    setIsPanning360(true);
    setPanStartX(e.clientX);
  };

  const handle360MouseMove = (e: React.MouseEvent) => {
    if (!isPanning360) return;
    const deltaX = e.clientX - panStartX;
    setPan360Deg(prev => (prev + deltaX * 0.5) % 360);
    setPanStartX(e.clientX);
  };

  const handle360MouseUp = () => {
    setIsPanning360(false);
  };

  // Add new folder path config
  const handleSaveStoragePath = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPathSaved(true);
    setTimeout(() => setIsPathSaved(false), 2000);
  };

  // Create customized album
  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;

    const newAl = {
      id: `al-${Date.now()}`,
      name: newAlbumName,
      count: 0,
      cover: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',
      shared: true,
      contributors: 1
    };

    setCustomAlbums(prev => [...prev, newAl]);
    setNewAlbumName('');
    setShowCreateAlbum(false);
  };

  // Simulate downloading asset photo directly
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const handleLocalDeviceDownload = (asset: MediaAsset) => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev !== null && prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloadProgress(null), 1000);
          return 100;
        }
        return (prev || 0) + 20;
      });
    }, 150);
  };

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 p-6 md:p-10 rounded-3xl border border-white/5 space-y-8 select-none font-sans relative overflow-hidden shadow-2xl">
      {/* Background radial ambient lens */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffaa00]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00ddff]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header & Multi-user Profile Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8 relative z-20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-[#f25f0e]/10 text-[#f25f0e] text-[9px] font-mono rounded font-black tracking-widest uppercase">
              IMMICH CORE v1.112
            </span>
            <span className="text-zinc-600 font-mono text-[9px]">// SYSTEM_VAULT</span>
          </div>
          <h2 className="text-xl md:text-3xl font-serif font-semibold tracking-tight text-white flex items-center gap-3">
            Intelligent Media & Creative Asset Vault
          </h2>
          <p className="text-[10.5px] text-zinc-500 font-mono leading-relaxed">
            NEURAL NETWORK ENGINE FOR OFF-GRID RUNWAY RETRIEVAL & HIGH-RESOLUTION SECURE CLUSTERING.
          </p>
        </div>

        {/* Multi-user Profiles Switching System */}
        <div className="bg-zinc-900/60 p-2.5 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="space-y-1">
            <p className="text-[8px] text-zinc-500 font-mono text-right font-black uppercase tracking-widest">ACTIVE SECTOR ARCHITECT</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-white uppercase">{activeUser.name}</span>
            </div>
          </div>
          <div className="flex gap-1.5 border-l border-white/10 pl-4">
            {USER_PROFILES.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  setActiveUser(u);
                  // Dynamic user filter matches
                }}
                className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all relative group ${
                  activeUser.id === u.id ? 'border-[#ffaa00] scale-105' : 'border-transparent hover:border-zinc-500'
                }`}
                title={u.name}
              >
                <img src={u.avatar} className="w-full h-full object-cover" alt={u.name} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Navigation & Statistics Indicators */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-950/80 p-2.5 rounded-2xl border border-white/5 backdrop-blur-3xl relative z-10">
        <div className="flex bg-zinc-900% p-1 rounded-xl border border-white/10 w-full sm:w-auto overflow-x-auto gap-1">
          <button
            onClick={() => setActiveAlbumTab('all-photos')}
            className={`px-4 py-2 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-2 whitespace-nowrap ${
              activeAlbumTab === 'all-photos' ? 'bg-white text-zinc-950 font-black' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <Grid size={11} />
            Unified Gallery
          </button>
          
          <button
            onClick={() => {
              setActiveAlbumTab('albums');
              setShowCreateAlbum(false);
            }}
            className={`px-4 py-2 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-2 whitespace-nowrap ${
              activeAlbumTab === 'albums' ? 'bg-white text-zinc-950 font-black' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <Folder size={11} />
            Shared Albums ({customAlbums.length})
          </button>

          <button
            onClick={() => setActiveAlbumTab('admin-tools')}
            className={`px-4 py-2 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-2 whitespace-nowrap ${
              activeAlbumTab === 'admin-tools' ? 'bg-white text-zinc-950 font-black' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <Settings size={11} />
            Vault Administration
          </button>
        </div>

        {/* User quota visualization */}
        <div className="hidden lg:flex items-center gap-4 pr-3 text-[10px] font-mono text-zinc-400">
          <div className="text-right space-y-0.5">
            <span className="text-zinc-500">USED STORAGE CAPACITY:</span>
            <p className="text-white font-black">{activeUser.storageUsed} / {activeUser.quota}</p>
          </div>
          <div className="w-24 h-2 bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-[#ffaa00]" 
              style={{ width: activeUser.id === 'dir-1' ? '41%' : activeUser.id === 'stylist-2' ? '39%' : '24%' }}
            />
          </div>
        </div>
      </div>

      {/* Main Container Sections based on Navigation Tab */}
      <AnimatePresence mode="wait">
        {activeAlbumTab === 'all-photos' && (
          <motion.div 
            key="all-photos"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-20"
          >
            {/* Lighter Left Workspace Panel: Smart Neural Filters & Face Clusters (4 grid cols) */}
            <div className="xl:col-span-4 flex flex-col gap-6">
              
              {/* AI Object Categories & Face Clustering Box */}
              <div className="bg-zinc-900/45 p-6 rounded-3xl border border-white/5 space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2 text-[#ffaa00]">
                    <Cpu size={14} />
                    <span className="text-[10px] font-black tracking-widest uppercase font-mono">Neural Clustering Core</span>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500">REAL-TIME ANNOTATION</span>
                </div>

                {/* Face recognition cluster list */}
                <div className="space-y-3">
                  <label className="text-[9.5px] font-mono text-zinc-400 block tracking-[0.1em] uppercase">
                    Face Clusters Detected (People List)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedFace(null)}
                      className={`px-3 py-1.5 rounded-full text-[9px] font-mono transition-all ${
                        selectedFace === null 
                          ? 'bg-[#ffaa00] text-zinc-950 font-black' 
                          : 'bg-zinc-950 border border-white/5 text-zinc-500 hover:text-white'
                      }`}
                    >
                      ALL FACES
                    </button>
                    {allFaces.map(face => (
                      <button
                        key={face}
                        onClick={() => setSelectedFace(face)}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-mono transition-all flex items-center gap-1.5 shadow ${
                          selectedFace === face 
                            ? 'bg-[#ffaa00] text-zinc-950 font-black' 
                            : 'bg-zinc-950 border border-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <User size={10} />
                        {face}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Object Categories list */}
                <div className="space-y-3 pt-2">
                  <label className="text-[9.5px] font-mono text-zinc-400 block tracking-[0.1em] uppercase">
                    Auto-Object Classifications
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setSelectedObject(null)}
                      className={`px-2.5 py-1 rounded text-[8px] font-mono transition-all uppercase ${
                        selectedObject === null
                          ? 'bg-white text-zinc-950 font-bold'
                          : 'bg-zinc-950 border border-white/5 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      All Classes
                    </button>
                    {allObjects.map(obj => (
                      <button
                        key={obj}
                        onClick={() => setSelectedObject(obj)}
                        className={`px-2.5 py-1 rounded text-[8px] font-mono transition-all uppercase flex items-center gap-1 border border-white/5 ${
                          selectedObject === obj
                            ? 'bg-white text-zinc-950 font-bold border-transparent'
                            : 'bg-zinc-950 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Tag size={8} />
                        {obj}
                      </button>
                    ))}
                  </div>
                </div>

                {/* RAW format filters */}
                <div className="space-y-3 pt-2">
                  <span className="text-[9px] font-mono text-zinc-400 block tracking-[0.1em] uppercase">Camera RAW Format Filter</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedRawFormat(null)}
                      className={`py-2 rounded-lg text-[9px] font-mono border text-center transition-all ${
                        selectedRawFormat === null
                          ? 'bg-zinc-800 border-[#ffaa00] text-white font-bold'
                          : 'bg-zinc-950 border-white/5 text-zinc-500 hover:text-white'
                      }`}
                    >
                      ANY FORMAT
                    </button>
                    {allFormats.map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => setSelectedRawFormat(fmt)}
                        className={`py-2 rounded-lg text-[9px] font-mono border text-center transition-all ${
                          selectedRawFormat === fmt
                            ? 'bg-zinc-800 border-[#ffaa00] text-white font-bold'
                            : 'bg-zinc-950 border-white/5 text-zinc-500 hover:text-white'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Infinite Chronology Timeline Scroll Slider (Immich Style) */}
              <div className="bg-zinc-900/45 p-6 rounded-3xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <Calendar size={13} className="text-[#db7811]" />
                  <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-zinc-300">
                    Timeline Epoch Drag-Slider
                  </span>
                </div>
                <p className="text-[9px] text-zinc-500 font-mono">
                  DRAG THE TIMELINE SLIDER TO SCRUB RETRIEVAL OF CACHED FASHION BACKUPS.
                </p>

                <div className="relative py-4 space-y-4">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>Dec 2025</span>
                    <span>April 2026</span>
                    <span className="text-[#ffaa00]">May 2026</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="1"
                    value={
                      selectedTimelineEpoch === 'all' ? 0 :
                      selectedTimelineEpoch === 'December 2025' ? 1 :
                      selectedTimelineEpoch === 'April 2026' ? 2 : 3
                    }
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v === 0) setSelectedTimelineEpoch('all');
                      else if (v === 1) setSelectedTimelineEpoch('December 2025');
                      else if (v === 2) setSelectedTimelineEpoch('April 2026');
                      else setSelectedTimelineEpoch('May 2026');
                    }}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ffaa00]"
                  />

                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                    <span className="text-[8.5px] font-mono text-zinc-500">EPOCH FILTER OUTPUT:</span>
                    <span className="text-[9px] font-mono font-black text-[#ffaa00] uppercase tracking-wider">
                      {selectedTimelineEpoch === 'all' ? 'All History' : selectedTimelineEpoch}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Scope Select Panel (All, Favorites, Archives) */}
              <div className="bg-zinc-900/45 p-6 rounded-3xl border border-white/5">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {(['all', 'favorites', 'archived'] as const).map(scope => (
                    <button
                      key={scope}
                      onClick={() => setViewScope(scope)}
                      className={`py-3 px-1 rounded-xl font-mono text-[9px] font-bold uppercase transition-all flex flex-col items-center justify-center gap-1.5 ${
                        viewScope === scope
                          ? 'bg-zinc-100 text-zinc-950'
                          : 'bg-zinc-950/60 border border-white/5 text-zinc-500 hover:text-zinc-200'
                      }`}
                    >
                      {scope === 'all' && <Grid size={12} />}
                      {scope === 'favorites' && <Heart size={12} className="fill-red-500 text-red-500" />}
                      {scope === 'archived' && <Archive size={12} />}
                      {scope}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Middle Panel: Visual Grid with virtual load and live photo trigger (5 grid cols) */}
            <div className="xl:col-span-5 flex flex-col gap-5">
              
              {/* Intelligent Search bar & CLIP trigger */}
              <div className="bg-zinc-900/30 p-1.5 rounded-2xl border border-white/5 flex items-center gap-3">
                <div className="p-2 text-zinc-500 bg-zinc-950 rounded-xl border border-white/5">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="CLIP SEMANTIC SEARCH (e.g., 'metal reflection', 'silk巴黎')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-[11.5px] font-mono text-white placeholder-zinc-700 outline-none flex-grow"
                />
                <div className="flex items-center gap-1 text-[8px] font-mono text-zinc-600 px-3 bg-zinc-950 py-2.5 rounded-xl border border-white/5">
                  <Sparkles size={11} className="text-[#ffaa00] animate-pulse" />
                  <span>CLIP EMBEDDING ATTACHED</span>
                </div>
              </div>

              {/* Grid panel */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                    Backups Found // {filteredAssets.length} Artifacts
                  </span>
                  <div className="flex gap-1.5">
                    {selectedFace || selectedObject || selectedRawFormat || searchQuery ? (
                      <button
                        onClick={() => {
                          setSelectedFace(null);
                          setSelectedObject(null);
                          setSelectedRawFormat(null);
                          setSearchQuery('');
                          setSelectedTimelineEpoch('all');
                        }}
                        className="text-[8px] font-mono text-[#ffaa00] hover:underline"
                      >
                        RESET FILTERS
                      </button>
                    ) : null}
                  </div>
                </div>

                {filteredAssets.length === 0 ? (
                  <div className="aspect-[4/3] w-full rounded-3xl bg-zinc-900/20 border border-white/5 flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div className="p-4 bg-zinc-900/80 rounded-full text-zinc-600 border border-white/5 shadow-inner">
                      <Image size={24} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono font-bold tracking-widest text-white uppercase">
                        // NO BACKUP ARTIFACTS FOUND
                      </p>
                      <p className="text-[8.5px] text-zinc-500 max-w-[240px]">
                        No local items match your criteria. Expand filters, drag timeline slider, or clean semantic CLIP parameters.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-3 max-h-[720px] overflow-y-auto pr-1">
                    {filteredAssets.map(asset => {
                      const isSelected = selectedAsset?.id === asset.id;
                      const isLivePlaying = livePlayingAssetId === asset.id;

                      return (
                        <div
                          key={asset.id}
                          onClick={() => setSelectedAsset(asset)}
                          onMouseEnter={() => {
                            if (asset.type === 'motion-photo') {
                              setLivePlayingAssetId(asset.id);
                            }
                          }}
                          onMouseLeave={() => {
                            if (asset.type === 'motion-photo') {
                              setLivePlayingAssetId(null);
                            }
                          }}
                          className={`relative aspect-[4/5] bg-zinc-900 rounded-2xl overflow-hidden cursor-crosshair group transition-all duration-300 ${
                            isSelected ? 'ring-2 ring-[#ffaa00] scale-[0.99]' : 'border border-white/5 hover:border-zinc-700'
                          }`}
                        >
                          {/* Photo frame visualizer */}
                          <div className="absolute inset-0 w-full h-full">
                            <img
                              src={asset.thumbnailUrl}
                              alt={asset.name}
                              referrerPolicy="no-referrer"
                              className={`w-full h-full object-cover transition-all duration-700 ${
                                isLivePlaying ? 'scale-105 saturate-150 brightness-110' : 'grayscale group-hover:grayscale-0 group-hover:scale-102 filter contrast-105 brightness-[0.62] group-hover:brightness-90'
                              }`}
                              style={{
                                filter: isLivePlaying ? `hue-rotate(${motionFrame * 12}deg)` : undefined
                              }}
                            />
                          </div>

                          {/* Gradient shader overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/10 to-transparent pointer-events-none" />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
                            <span className="text-[7.5px] font-mono font-black tracking-widest bg-black/80 px-1.5 py-0.5 rounded border border-white/10 text-zinc-300">
                              {asset.format}
                            </span>
                            {asset.type === 'motion-photo' && (
                              <span className="text-[7.5px] font-mono font-black tracking-widest bg-orange-600 text-white px-1.5 py-0.5 rounded animate-pulse">
                                LIVE PHOTO
                              </span>
                            )}
                            {asset.type === 'panorama-360' && (
                              <span className="text-[7.5px] font-mono font-black tracking-widest bg-[#00ddff] text-zinc-950 px-1.5 py-0.5 rounded">
                                Interactive 360
                              </span>
                            )}
                          </div>

                          {/* Bottom Info text inside card view */}
                          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-10 pointer-events-none">
                            <div className="space-y-0.5 max-w-[70%]">
                              <p className="text-[9.5px] font-mono font-bold text-white truncate">{asset.name}</p>
                              <p className="text-[7.5px] font-mono text-zinc-400">{asset.date}</p>
                            </div>
                            <div className="flex gap-1">
                              {asset.favorite && (
                                <Heart size={10} className="fill-red-500 text-red-500" />
                              )}
                              {asset.archived && (
                                <Archive size={10} className="text-zinc-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Right Panel: Selected EXIF metadata detail inspect & mini-map (3 grid cols) */}
            <div className="xl:col-span-3">
              <AnimatePresence mode="wait">
                {selectedAsset ? (
                  <motion.div
                    key={selectedAsset.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 space-y-6"
                  >
                    {/* Visual miniature preview */}
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-zinc-950 border border-white/5">
                      {selectedAsset.type === 'panorama-360' ? (
                        <div 
                          onMouseDown={handle360MouseDown}
                          onMouseMove={handle360MouseMove}
                          onMouseUp={handle360MouseUp}
                          onMouseLeave={handle360MouseUp}
                          className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden group flex items-center justify-center p-2 text-center"
                        >
                          <img 
                            src={selectedAsset.thumbnailUrl} 
                            alt="360 view source" 
                            referrerPolicy="no-referrer"
                            className="absolute h-full object-cover opacity-50 filter saturate-150 scale-125 transition-transform"
                            style={{
                              transform: `translateX(${pan360Deg * 0.4}px) scale(1.4)`
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                          <div className="relative text-[9.5px] font-mono text-cyan-400 space-y-1 z-10 pointer-events-none">
                            <Globe className="mx-auto text-cyan-400 animate-spin" size={24} style={{ animationDuration: '20s' }} />
                            <p className="font-bold">// DRAG TO ROTATE 360 PANORAMA</p>
                            <p className="text-[8px] text-zinc-500">Curvature Pan degree: {Math.round(pan360Deg)}°</p>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={selectedAsset.thumbnailUrl} 
                          alt={selectedAsset.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Metadata tags */}
                    <div className="space-y-4">
                      <div className="text-center font-mono py-1 border-b border-white/5 pb-2">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">// RAW EXIF PARSER</p>
                        <h4 className="text-[11.5px] font-bold text-white truncate mt-1">{selectedAsset.name}</h4>
                      </div>

                      {/* EXIF camera details row grid */}
                      <div className="grid grid-cols-2 gap-3 text-left font-mono text-[9px]">
                        <div className="bg-zinc-950/50 p-2.5 rounded-lg border border-white/5 space-y-1">
                          <span className="text-zinc-600 block text-[7.5px] uppercase">CAM BODY</span>
                          <span className="text-white font-black truncate block">{selectedAsset.cameraModel}</span>
                        </div>
                        <div className="bg-zinc-950/50 p-2.5 rounded-lg border border-white/5 space-y-1">
                          <span className="text-zinc-600 block text-[7.5px] uppercase">LENS PROFILE</span>
                          <span className="text-white font-black truncate block">{selectedAsset.lensModel}</span>
                        </div>
                        <div className="bg-zinc-950/50 p-2.5 rounded-lg border border-white/5 space-y-1">
                          <span className="text-zinc-600 block text-[7.5px] uppercase">CAMERA ISO</span>
                          <span className="text-white font-black block">ISO {selectedAsset.iso}</span>
                        </div>
                        <div className="bg-zinc-950/50 p-2.5 rounded-lg border border-white/5 space-y-1">
                          <span className="text-zinc-600 block text-[7.5px] uppercase">APERTURE / SPEED</span>
                          <span className="text-white font-black block">{selectedAsset.shutterSpeed} @ {selectedAsset.aperture}</span>
                        </div>
                      </div>

                      {/* Custom interactive mini-map simulation based on GPS */}
                      <div className="bg-zinc-950/60 p-4 rounded-2xl border border-white/5 space-y-3">
                        <div className="flex items-center gap-1.5 text-orange-400">
                          <MapPin size={11} />
                          <span className="text-[8.5px] font-mono tracking-widest uppercase">GPS METADATA LOCATOR</span>
                        </div>
                        <p className="text-[9px] font-mono text-zinc-300 tracking-wide font-sans">{selectedAsset.gps.locationName}</p>
                        
                        {/* Interactive schematic map view box */}
                        <div className="h-24 bg-black border border-white/5 rounded-xl relative overflow-hidden flex items-center justify-center">
                          <svg className="absolute inset-0 w-full h-full text-zinc-800" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <line x1="10" y1="0" x2="10" y2="100" stroke="currentColor" strokeWidth="0.5" />
                            <line x1="30" y1="0" x2="30" y2="100" stroke="currentColor" strokeWidth="0.5" />
                            <line x1="60" y1="0" x2="60" y2="100" stroke="currentColor" strokeWidth="0.5" />
                            <line x1="80" y1="0" x2="80" y2="100" stroke="currentColor" strokeWidth="0.5" />
                            <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" />
                            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
                            <line x1="0" y1="70" x2="100" y2="70" stroke="currentColor" strokeWidth="0.5" />
                            {/* Marker dot */}
                            <circle cx="50" cy="45" r="4" fill="#ff7700" className="animate-pulse" />
                            <circle cx="50" cy="45" r="8" stroke="#ff7700" strokeWidth="0.5" fill="none" className="animate-ping" />
                          </svg>
                          <div className="absolute top-2 left-2 text-[6.5px] font-mono text-zinc-600 bg-black/80 px-1 py-0.5 rounded">
                            LAT: {selectedAsset.gps.lat.toFixed(4)} / LNG: {selectedAsset.gps.lng.toFixed(4)}
                          </div>
                          <p className="text-[8px] font-mono text-zinc-600 tracking-widest z-10 bottom-2 absolute uppercase">MAPPING MATRIX CONV</p>
                        </div>
                      </div>

                      {/* Download Device Progress Bar */}
                      {downloadProgress !== null ? (
                        <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 space-y-2 font-mono text-[9px] text-[#ffaa00]">
                          <div className="flex justify-between items-center text-zinc-400">
                            <span>DOWNLOADING DEVICE ATOM...</span>
                            <span>{downloadProgress}%</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-[#ffaa00]" style={{ width: `${downloadProgress}%` }} />
                          </div>
                        </div>
                      ) : null}

                      {/* Management control actions (Download, Share, Favorite, Archive) */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleLocalDeviceDownload(selectedAsset)}
                          className="py-3.5 bg-zinc-950 border border-white/5 rounded-xl text-[9px] font-mono font-black hover:text-white uppercase flex items-center justify-center gap-1.5 hover:bg-zinc-900/40 transition-all text-zinc-400"
                        >
                          <Download size={11} />
                          Pull Device
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerShareSimulation(selectedAsset)}
                          className="py-3.5 bg-zinc-950 border border-white/5 rounded-xl text-[9px] font-mono font-black hover:text-white uppercase flex items-center justify-center gap-1.5 hover:bg-zinc-900/40 transition-all text-zinc-400"
                        >
                          <Share2 size={11} />
                          Public Share
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(selectedAsset.id)}
                          className={`py-3.5 border rounded-xl text-[9px] font-mono font-black uppercase flex items-center justify-center gap-1.5 transition-all ${
                            selectedAsset.favorite
                              ? 'bg-red-950/20 border-red-500/20 text-red-400'
                              : 'bg-zinc-950 border-white/5 hover:text-red-400 hover:border-red-500/10 text-zinc-400'
                          }`}
                        >
                          <Heart size={11} className={selectedAsset.favorite ? 'fill-red-400' : ''} />
                          {selectedAsset.favorite ? 'Favorited' : 'Favorite'}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleArchive(selectedAsset.id)}
                          className={`py-3.5 border rounded-xl text-[9px] font-mono font-black uppercase flex items-center justify-center gap-1.5 transition-all ${
                            selectedAsset.archived
                              ? 'bg-[#ffaa00]/10 border-[#ffaa00]/20 text-[#ffaa00]'
                              : 'bg-zinc-950 border-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Archive size={11} />
                          {selectedAsset.archived ? 'Archived' : 'Archive'}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('send-to-try-on', { detail: { imageUrl: selectedAsset.url } }));
                        }}
                        className="w-full py-4 text-[9.5px] font-mono font-black tracking-[0.25em] uppercase rounded-xl border border-[#00b8d9]/20 bg-[#00b8d9]/10 text-[#00b8d9] hover:bg-[#00b8d9]/20 transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_4px_12px_rgba(0,184,217,0.1)] active:scale-[0.98]"
                      >
                        <Sparkles size={11} className="animate-pulse" />
                        DEPLOY MODEL TO NEURAL TRY-ON [VTON]
                      </button>

                      {/* Shared link indicator popup */}
                      {copiedShareLink && (
                        <div className="text-center text-[8.5px] font-mono text-zinc-500 underline py-2 break-all bg-zinc-950 p-2 rounded border border-white/5">
                          Copied Public Share Link: {copiedShareLink}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 text-center space-y-4 py-16">
                    <div className="p-4 bg-zinc-900 rounded-full text-zinc-600 block max-w-max mx-auto border border-white/5 shadow-inner">
                      <Camera size={26} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">// INSPECT PROFILE DETAILS</p>
                      <p className="text-[8.5px] text-zinc-500">Tap or hover any brand resource asset on the workspace mesh column to overlay deep camera EXIF and geolocation matrices.</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
            
          </motion.div>
        )}

        {/* COMPONENT TAB 2: Custom folder, albums list integration */}
        {activeAlbumTab === 'albums' && (
          <motion.div 
            key="albums"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 block relative z-20"
          >
            <div className="flex justify-between items-center bg-zinc-900/40 p-5 rounded-2xl border border-white/5">
              <div className="space-y-1">
                <h3 className="text-sm font-black font-mono tracking-widest uppercase text-white">// SHARED ALBUMS SYSTEM</h3>
                <p className="text-[9.5px] text-zinc-500 font-mono">Create localized image grids and grant individual contributor authentication keys.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateAlbum(!showCreateAlbum)}
                className="py-2.5 px-4 bg-white text-zinc-950 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-1.5"
              >
                <Plus size={11} />
                Create Shared Album
              </button>
            </div>

            {/* Album builder modal inline */}
            {showCreateAlbum && (
              <form onSubmit={handleCreateAlbum} className="bg-zinc-900 p-6 rounded-2xl border border-white/10 max-w-md space-y-3.5 mx-auto">
                <span className="text-[7.5px] font-mono uppercase text-[#ffaa00] font-black tracking-widest">// NEW VAULT BUCKET</span>
                <input
                  type="text"
                  placeholder="e.g. Prada Lookbook Spring '26 Scrapes..."
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-[11px] font-mono text-white outline-none focus:border-[#ffaa00]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateAlbum(false)}
                    className="px-4 py-2 border border-white/5 rounded-xl text-[9px] font-mono uppercase text-zinc-500 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#ffaa00] text-zinc-950 font-black rounded-xl text-[9px] font-mono uppercase"
                  >
                    Build
                  </button>
                </div>
              </form>
            )}

            {/* Grid list of shared albums */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {customAlbums.map(al => (
                <div key={al.id} className="bg-zinc-900/45 p-5 rounded-3xl border border-white/5 space-y-4 group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative border border-white/5">
                    <img src={al.cover} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={al.name} />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all" />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/80 px-2 py-0.5 rounded border border-white/10 text-[7px] font-mono text-zinc-400 uppercase">
                      <User size={8} />
                      {al.contributors} Collaborator
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11.5px] font-bold font-mono text-white tracking-wide truncate group-hover:text-[#ffaa00] transition-all">
                      {al.name}
                    </p>
                    <div className="flex justify-between text-[8px] font-mono text-zinc-500">
                      <span>{al.count} RAW IMAGES INC.</span>
                      <span>{al.shared ? 'PUBLICLY SHARED' : 'WORKSPACE LOCKED'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* COMPONENT TAB 3: Vault Administration API configuration */}
        {activeAlbumTab === 'admin-tools' && (
          <motion.div 
            key="admin-tools"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20"
          >
            {/* Custom Storage Structure configuration */}
            <div className="bg-zinc-900/45 p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Folder size={15} className="text-[#ffaa00]" />
                <span className="text-[10.5px] font-black tracking-widest font-mono uppercase text-white">Custom Storage Template Path</span>
              </div>
              <p className="text-[9.5px] text-zinc-500 font-mono leading-relaxed">
                Define the template structure for photos uploaded to the server backing directory. Rebuilds file hierarchy dynamically.
              </p>

              <form onSubmit={handleSaveStoragePath} className="space-y-3.5 pt-1">
                <div className="space-y-2">
                  <span className="text-[8px] font-mono text-zinc-400 block tracking-widest uppercase">// PHYSICAL MAPPING PATH</span>
                  <input
                    type="text"
                    value={customStorageStructure}
                    onChange={(e) => setCustomStorageStructure(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/15 rounded-xl p-3 text-[10.5px] font-mono text-white outline-none focus:border-[#ffaa00]"
                  />
                </div>

                {/* Structure Variables references */}
                <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 space-y-1.5 font-mono text-[8px] text-zinc-500">
                  <p className="text-zinc-400 uppercase font-bold">// DYNAMIC STRUCTURE TAGS AVAILABLE:</p>
                  <p>• <span className="text-[#ffaa00]">{`{year}`}</span> - 4-digit camera trigger year (e.g. 2026)</p>
                  <p>• <span className="text-[#ffaa00]">{`{month_name}`}</span> - Full calendar month name (e.g. May)</p>
                  <p>• <span className="text-[#ffaa00]">{`{camera_model}`}</span> - Captured EXIF camera body name</p>
                  <p>• <span className="text-[#ffaa00]">{`{filename}`}</span> - Original RAW layout asset filename</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-white text-zinc-950 font-black tracking-widest text-[9.5px] rounded-xl font-mono uppercase hover:bg-zinc-200 transition-all"
                >
                  {isPathSaved ? 'TEMPLATE APPLIED OK' : 'REBUILD AND APPLY STRUCTURE'}
                </button>
              </form>
            </div>

            {/* API key & OAuth integrations credentials */}
            <div className="bg-zinc-900/45 p-6 rounded-3xl border border-white/5 space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Key size={15} className="text-cyan-400" />
                  <span className="text-[10.5px] font-black tracking-widest font-mono uppercase text-zinc-200">OAuth & API Secret Keys</span>
                </div>
                <span className="text-[8px] font-mono text-zinc-500">SECURITY SUITE</span>
              </div>

              {/* API Section */}
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-zinc-500 block uppercase tracking-widest">Immich Authenticated CLI API Key</label>
                  <div className="flex bg-zinc-950 p-2 rounded-xl border border-white/10 gap-2 items-center">
                    <span className="text-zinc-600 select-none font-mono text-[9px]">API_KEY:</span>
                    <input
                      type="password"
                      readOnly
                      value={vaultAPIKey}
                      className="bg-transparent border-none outline-none font-mono text-[10px] text-zinc-400 flex-grow"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(vaultAPIKey);
                        setIsKeyCopied(true);
                        setTimeout(() => setIsKeyCopied(false), 2000);
                      }}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-[8px] text-white rounded-lg font-mono tracking-wider transition-all"
                    >
                      {isKeyCopied ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>

                {/* OAuth settings section */}
                <div className="space-y-3.5 pt-3">
                  <div className="flex justify-between items-center text-[8.5px] font-mono">
                    <span className="text-zinc-500 uppercase tracking-widest">SSO DEPLOYER OAUTH:</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] ${
                      oauthStatus === 'linked' ? 'bg-green-500/10 text-green-400 border border-green-500/10' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {oauthStatus === 'linked' ? 'OAUTH_ACTIVE' : 'IDLE'}
                    </span>
                  </div>

                  <p className="text-[9px] text-zinc-500 font-sans leading-relaxed">
                    Synchronize campaign photos natively with external digital platforms like GitHub, Google Cloud Drive, or Figma.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setOauthStatus('linking');
                        setTimeout(() => setOauthStatus('linked'), 1500);
                      }}
                      className="py-3 bg-zinc-950 border border-white/5 hover:border-white/10 text-[9px] font-mono uppercase tracking-wider text-zinc-300 font-bold hover:text-white rounded-xl transition-all"
                    >
                      LINK THIRD PARTIES
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOauthStatus('idle');
                      }}
                      className="py-3 bg-zinc-950 border border-white/5 hover:border-white/10 text-[9px] font-mono uppercase tracking-wider text-zinc-500 hover:text-red-400 rounded-xl transition-all"
                    >
                      DISABLE OAUTH
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
