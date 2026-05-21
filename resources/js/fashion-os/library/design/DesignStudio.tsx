import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { useTheme } from '../../design-system/ThemeContext';

interface ContextMenu {
  x: number;
  y: number;
}

const DESIGN_PRESETS = [
  {
    prompt: "ASYMMETRIC SILK DRAPE",
    color: 0xc5a880, // Champagne gold
    wireframe: false,
    radius: 1.8,
    tube: 0.5
  },
  {
    prompt: "BRUTALIST CARBON SHELL",
    color: 0x333333, // Coal charcoal
    wireframe: true,
    radius: 1.5,
    tube: 0.7
  },
  {
    prompt: "LIQUID GLASS TRENCH",
    color: 0x88ccff, // Ghost ice blue
    wireframe: false,
    radius: 2.0,
    tube: 0.3
  }
];

export const DesignStudio: React.FC = () => {
  const { theme } = useTheme();
  const [vision, setVision] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activePreset, setActivePreset] = useState<typeof DESIGN_PRESETS[0] | null>(null);
  
  // Right click custom context menu
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Three JS references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Handle Mouse movement for 3D navigation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to [-1, 1]
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize ThreeJS scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Soft dark luxury mood or matching daylight light theme
    scene.background = null; 

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

    // Luxury Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc5a880, 0.8);
    fillLight.position.set(-5, 3, -2);
    scene.add(fillLight);

    const backGlow = new THREE.PointLight(0xffffff, 2, 20);
    backGlow.position.set(0, 0, -4);
    scene.add(backGlow);

    // Initial placeholder abstract geometry
    const geometry = new THREE.TorusKnotGeometry(1.6, 0.45, 150, 20, 3, 4);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xaaaaaa,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Interpolation for slow inertial rotate
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (meshRef.current) {
        // Natural spinning with orbital inertia
        const elapsedTime = clock.getElapsedTime();
        meshRef.current.rotation.y = elapsedTime * 0.12 + mouseRef.current.x * 0.8;
        meshRef.current.rotation.x = mouseRef.current.y * 0.6;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update 3D mesh when progress is complete
  const update3DModel = (preset: typeof DESIGN_PRESETS[0]) => {
    if (!sceneRef.current || !meshRef.current) return;

    // Dispose old mesh
    sceneRef.current.remove(meshRef.current);
    meshRef.current.geometry.dispose();
    if (Array.isArray(meshRef.current.material)) {
      meshRef.current.material.forEach(m => m.dispose());
    } else {
      meshRef.current.material.dispose();
    }

    // Create high luxury organic clothing geometry
    const geometry = new THREE.TorusKnotGeometry(preset.radius, preset.tube, 200, 32, 4, 3);
    
    // Fashion texture based on visual theme (e.g. silk, metallic, or wire Carbon)
    const material = new THREE.MeshPhysicalMaterial({
      color: preset.color,
      metalness: preset.wireframe ? 0.3 : 0.95,
      roughness: preset.wireframe ? 0.8 : 0.15,
      clearcoat: preset.wireframe ? 0.0 : 1.0,
      clearcoatRoughness: 0.1,
      wireframe: preset.wireframe,
      flatShading: preset.wireframe,
      transparent: true,
      opacity: 0.95,
      transmission: preset.wireframe ? 0.0 : 0.1,
      thickness: preset.wireframe ? 0.0 : 1.5
    });

    const newMesh = new THREE.Mesh(geometry, material);
    sceneRef.current.add(newMesh);
    meshRef.current = newMesh;
  };

  const handleVisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vision.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setContextMenu(null);

    // Match with closest preset or default
    const textSample = vision.toUpperCase();
    let selected = DESIGN_PRESETS[0];
    if (textSample.includes('CARBON') || textSample.includes('BRUTALIST')) {
      selected = DESIGN_PRESETS[1];
    } else if (textSample.includes('GLASS') || textSample.includes('ICE') || textSample.includes('TRENCH')) {
      selected = DESIGN_PRESETS[2];
    } else {
      // Pick random preset for dynamic feeling
      selected = DESIGN_PRESETS[Math.floor(Math.random() * DESIGN_PRESETS.length)];
    }

    // Growing fine line from left to right simulating cinematic output
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            update3DModel(selected);
            setActivePreset(selected);
            setIsGenerating(false);
          }, 400);
          return 100;
        }
        return prev + 1.25;
      });
    }, 45);
  };

  // Custom Right-Click Menu handler
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY
    });
  };

  useEffect(() => {
    const handleCloseMenu = () => setContextMenu(null);
    window.addEventListener('click', handleCloseMenu);
    return () => window.removeEventListener('click', handleCloseMenu);
  }, []);

  const triggerNotice = (text: string) => {
    setNotice(text);
    setTimeout(() => {
      setNotice(null);
    }, 2000);
  };

  return (
    <div 
      onContextMenu={handleContextMenu}
      className="absolute inset-0 bg-transparent text-white flex flex-col items-center justify-center relative select-none overflow-hidden"
    >
      
      {/* Immersive Fullscreen 3D Backplate */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Center Vision Input Interface */}
      <div className="z-10 w-full max-w-xl px-8 flex flex-col items-center justify-center pointer-events-auto">
        <form onSubmit={handleVisionSubmit} className="w-full flex flex-col items-center">
          <input
            type="text"
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            placeholder="TYPE YOUR VISION..."
            disabled={isGenerating}
            className="w-full bg-transparent text-center text-xs text-white placeholder-zinc-500/80 px-4 py-6 border-b border-transparent focus:border-white/10 outline-none transition-all tracking-[0.3em] font-sans uppercase font-medium focus:outline-none"
            style={{
              textShadow: vision ? '0 0 10px rgba(255, 255, 255, 0.2)' : 'none'
            }}
          />

          {/* Cinematic fine line Loading (Not a circle, growths Left-to-Right) */}
          <div className="w-full h-[1px] bg-zinc-950 mt-4 relative overflow-hidden">
            <AnimatePresence>
              {isGenerating ? (
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: `${generationProgress}%` }}
                  exit={{ opacity: 0 }}
                  className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  transition={{ ease: 'easeInOut' }}
                />
              ) : (
                <div className="h-full w-full bg-white/5" />
              )}
            </AnimatePresence>
          </div>
        </form>

        {activePreset && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-[8px] tracking-[0.25em] font-mono text-zinc-500 uppercase flex items-center gap-2"
          >
            <span>RENDERING: {activePreset.prompt} // ACTIVE</span>
          </motion.div>
        )}
      </div>

      {/* Borderless Right Click Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 100, damping: 30 }}
            className="fixed z-50 bg-[#0c0c0c]/95 border-0 rounded-none shadow-2xl p-2 flex flex-col min-w-[160px]"
            style={{ 
              top: contextMenu.y, 
              left: contextMenu.x 
            }}
          >
            <button 
              onClick={() => triggerNotice('ITEM ADDED TO ARCHIVE // SYNCED')}
              className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 hover:text-white hover:bg-white/[0.02] tracking-[0.2em] transition-all uppercase"
            >
              ADD TO COLLECTION
            </button>
            <button 
              onClick={() => triggerNotice('EXPORTING VAGUE PROTOCOL DOCUMENT')}
              className="text-left py-4 px-6 text-[9px] font-black text-zinc-400 hover:text-white hover:bg-white/[0.02] tracking-[0.2em] transition-all uppercase border-t border-white/[0.03]"
            >
              EXPORT PDF
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Confirmation */}
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

      {/* Navigation and Instructions HUD */}
      <div className="absolute bottom-12 left-12 opacity-30 select-none text-[8px] tracking-[0.2em] font-mono text-zinc-500 pointer-events-none">
        DRAG MOUSE TO ROTATE MOCKUP WITH INERTIA
      </div>
      <div className="absolute bottom-12 right-12 opacity-30 select-none text-[8px] tracking-[0.2em] font-mono text-zinc-500 pointer-events-none">
        RIGHT CLICK DESIGN OBJECT FOR OPTIONS
      </div>
    </div>
  );
};
