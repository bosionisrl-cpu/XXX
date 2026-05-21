import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { useTheme } from '../../design-system/ThemeContext';

interface ModelPreset {
  id: string;
  name: string;
  color: number;
  roughness: number;
  metalness: number;
  structure: string;
}

const MODELS: ModelPreset[] = [
  {
    id: 'alpha',
    name: 'MODEL_ALPHA_COLD_SLATE',
    color: 0xdddddd, // Cold slate alabaster
    roughness: 0.1,
    metalness: 0.8,
    structure: 'torusKnot'
  },
  {
    id: 'beta',
    name: 'MODEL_BETA_VOID_OBSIDIAN',
    color: 0x050505, // Black shiny leather
    roughness: 0.2,
    metalness: 0.9,
    structure: 'octahedron'
  },
  {
    id: 'gamma',
    name: 'MODEL_GAMMA_GLOWING_QUARTZ',
    color: 0xc5a880, // Gold quartz fabric
    roughness: 0.4,
    metalness: 0.6,
    structure: 'icosahedron'
  }
];

export const TryOnStudio: React.FC = () => {
  const { theme } = useTheme();
  const [activeModel, setActiveModel] = useState<ModelPreset>(MODELS[0]);
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.5);
  const [spotLightIntensity, setSpotLightIntensity] = useState(1);
  const [backgroundType, setBackgroundType] = useState<'STUDIO' | 'DRAMATIC'>('STUDIO');
  
  // Right-click context menus
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // References for ThreeJS
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  
  // Custom camera dolly zoom level (starts at 7, scrolls in/out)
  const cameraDollyRef = useRef<number>(6.5);
  // Inertia and Auto Rotation status
  const isHoveredRef = useRef<boolean>(false);
  const lastMouseX = useRef<number>(0);
  const rotationVelocityY = useRef<number>(0.005);
  const lastTimeRef = useRef<number>(0);

  // Track Mouse position to dynamically transition lights & style based on model distance
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      
      // Distance from center of layout
      const dx = clientX - rect.width / 2;
      const dy = clientY - rect.height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
      
      // Proximity ratio: 1 when mouse is perfectly centered, 0 when far away
      const proximity = Math.max(0, Math.min(1, 1 - dist / (maxDist * 0.55)));
      
      // Interpolate light intensities
      // Near center -> STUDIO cold-white lighting (higher ambient)
      // Far edges -> DRAMATIC moody spotlight shadow
      if (proximity > 0.45) {
        setBackgroundType('STUDIO');
        setAmbientLightIntensity(0.7);
        setSpotLightIntensity(0.6);
      } else {
        setBackgroundType('DRAMATIC');
        setAmbientLightIntensity(0.12);
        setSpotLightIntensity(2.5);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update light intensities in three.js scene helper
  useEffect(() => {
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = ambientLightIntensity;
    }
    if (spotLightRef.current) {
      spotLightRef.current.intensity = spotLightIntensity;
    }
  }, [ambientLightIntensity, spotLightIntensity]);

  // Handle Wheel Scroll for Dolly In/Out
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Very slow dolly speed scale
      const zoomFactor = e.deltaY * 0.002;
      const nextDolly = Math.max(4.0, Math.min(12.0, cameraDollyRef.current + zoomFactor));
      cameraDollyRef.current = nextDolly;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Initiate Three.JS
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientLightIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const spotLight = new THREE.SpotLight(0xffffff, spotLightIntensity, 50, Math.PI / 6, 0.5, 1);
    spotLight.position.set(4, 8, 4);
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    const pointLight = new THREE.PointLight(0xc5a880, 2, 10);
    pointLight.position.set(-4, -2, -2);
    scene.add(pointLight);

    // Initial clothing geometry (Luxury sculpted body block)
    const geometry = new THREE.TorusKnotGeometry(1.6, 0.45, 120, 16, 2, 5);
    const material = new THREE.MeshStandardMaterial({
      color: activeModel.color,
      roughness: activeModel.roughness,
      metalness: activeModel.metalness,
      bumpScale: 0.1,
      wireframe: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Handle hovering for automatic orbital velocity change & inertia gliding
    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };
    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      // Start sliding inertia glide block
      rotationVelocityY.current = 0.05; // 1 second glide speed initiation
    };

    const canvasEl = canvasRef.current;
    canvasEl.addEventListener('mouseenter', handleMouseEnter);
    canvasEl.addEventListener('mouseleave', handleMouseLeave);

    // Render loop
    let animId: number;
    lastTimeRef.current = Date.now();

    const render = () => {
      animId = requestAnimationFrame(render);

      const now = Date.now();
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Dolly-in interpolation
      if (cameraRef.current) {
        cameraRef.current.position.z += (cameraDollyRef.current - cameraRef.current.position.z) * 0.1;
      }

      if (meshRef.current) {
        if (isHoveredRef.current) {
          // Slow continuous rotation when mouse is over
          meshRef.current.rotation.y += 0.015;
        } else {
          // Glides with friction to simulate a physical turntable
          if (rotationVelocityY.current > 0.005) {
            rotationVelocityY.current -= delta * 0.045; // Friction over 1-2 seconds
          } else {
            rotationVelocityY.current = 0.005; // Base rotation rate
          }
          meshRef.current.rotation.y += rotationVelocityY.current;
        }
      }

      renderer.render(scene, camera);
    };

    render();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('mouseenter', handleMouseEnter);
      canvasEl.removeEventListener('mouseleave', handleMouseLeave);
      renderer.dispose();
    };
  }, []);

  // Update physical structure in-place on same 3D scene smoothly
  useEffect(() => {
    if (!sceneRef.current || !meshRef.current) return;

    // Save previous rotation so swap is seamless without jumping
    const prevRotationY = meshRef.current.rotation.y;

    sceneRef.current.remove(meshRef.current);
    meshRef.current.geometry.dispose();
    if (Array.isArray(meshRef.current.material)) {
      meshRef.current.material.forEach(m => m.dispose());
    } else {
      meshRef.current.material.dispose();
    }

    let geometry: THREE.BufferGeometry;
    if (activeModel.structure === 'octahedron') {
      geometry = new THREE.OctahedronGeometry(1.8, 2);
    } else if (activeModel.structure === 'icosahedron') {
      geometry = new THREE.IcosahedronGeometry(1.8, 1);
    } else {
      geometry = new THREE.TorusKnotGeometry(1.5, 0.45, 120, 16, 2, 5);
    }

    const material = new THREE.MeshPhysicalMaterial({
      color: activeModel.color,
      roughness: activeModel.roughness,
      metalness: activeModel.metalness,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      roughnessMap: null,
      metalnessMap: null
    });

    const newMesh = new THREE.Mesh(geometry, material);
    newMesh.rotation.y = prevRotationY; // Preserve angle
    sceneRef.current.add(newMesh);
    meshRef.current = newMesh;
  }, [activeModel]);

  // Context menu events
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const triggerAlert = (text: string) => {
    setNotice(text);
    setTimeout(() => {
      setNotice(null);
    }, 2000);
  };

  return (
    <div 
      ref={containerRef}
      onContextMenu={handleContextMenu}
      className="absolute inset-0 bg-transparent text-white overflow-hidden flex flex-col items-center justify-center select-none"
    >
      {/* Immersive Lighting-receptive background fill */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000 ease-out"
        style={{
          background: backgroundType === 'STUDIO' 
            ? 'radial-gradient(circle_at_center, rgba(255, 255, 255, 0.08) 0%, rgba(3, 3, 3, 0) 70%)' 
            : 'radial-gradient(circle_at_center, rgba(197, 168, 128, 0.03) 0%, rgba(0, 0, 0, 0) 50%)'
        }}
      />

      {/* Render Canvas (No grid, no base plate, clean bleed) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 cursor-alias" />

      {/* Seamless In-place Avatar Model Switcher HUD (Top center) */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 flex bg-zinc-950/20 backdrop-blur-3xl p-1 rounded-full border border-white/5 pointer-events-auto">
        {MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveModel(m)}
            className={`px-6 py-3 rounded-full text-[8.5px] font-mono tracking-[0.25em] transition-all uppercase ${
              activeModel.id === m.id 
                ? 'bg-white text-black font-bold' 
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            {m.id}
          </button>
        ))}
      </div>

      {/* Dynamic Ambient Indicator (Right HUD Panel) */}
      <div className="absolute top-24 right-12 z-20 pointer-events-none opacity-40 text-right">
        <div className="text-[8px] tracking-[0.3em] font-mono text-zinc-500 uppercase">LIGHTING SCENARIO</div>
        <div className="text-[10px] tracking-[0.2em] font-sans text-white font-medium uppercase mt-1">
          {backgroundType} // AMBIENT_{Math.round(ambientLightIntensity * 100)}%
        </div>
      </div>

      {/* Extreme Minimalist Context Right Click Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 100, damping: 30 }}
            className="fixed z-50 bg-[#070707]/95 shadow-2xl p-2 flex flex-col min-w-[200px]"
            style={{ 
              top: contextMenu.y, 
              left: contextMenu.x 
            }}
          >
            {[
              { label: 'SEND TO BUYER', action: 'OFFERING SYNC PORTAL INIT' },
              { label: 'EXPORT LOOKBOOK', action: 'LOOKBOOK DOCUMENT EXPORTED // 2026' },
              { label: 'SHARE CAMPAIGN', action: 'CAMPAIGN PROTOCOL SHARED SUCCESSFULLY' }
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => triggerAlert(opt.action)}
                className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 hover:text-white hover:bg-white/[0.01] tracking-[0.3em] transition-all uppercase border-b border-white/[0.03] last:border-0"
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Notice Indicator */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-24 bg-white text-black px-8 py-4 rounded-full text-[9px] font-mono tracking-[0.25em] z-50 pointer-events-none shadow-2xl"
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Interface info */}
      <div className="absolute bottom-12 left-12 z-20 opacity-30 pointer-events-none text-[8px] tracking-[0.2em] font-mono text-zinc-500">
        SCROLL MOUSE WHEEL TO DOLLY ZOOM SLOWLY
      </div>
      <div className="absolute bottom-12 right-12 z-20 opacity-30 pointer-events-none text-[8px] tracking-[0.2em] font-mono text-zinc-500">
        HOVER MESH TO AUTO ROTATE // RIGHT-CLICK FOR PORTAL SHARE
      </div>
    </div>
  );
};
