import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialEditor } from './MaterialEditor';
import * as THREE from 'three';
import { 
  Layers, 
  Palette, 
  Wand2, 
  Box, 
  Maximize2, 
  Scissors, 
  History, 
  Sparkles,
  MousePointer2,
  Brush,
  Eraser,
  Type,
  Plus,
  ChevronRight,
  Zap,
  LayoutGrid
} from 'lucide-react';

export const DesignStudio: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState('LAYER_01');
  const [layers, setLayers] = useState([
    { id: 'LAYER_04', name: 'Overlay_Mesh', type: 'EMISSIVE' },
    { id: 'LAYER_03', name: 'Pattern_Graphene', type: 'TEXTURE' },
    { id: 'LAYER_02', name: 'Base_Structure', type: 'GEOMETRY' },
    { id: 'LAYER_01', name: 'Neural_Skeleton', type: 'SYSTEM' }
  ]);

  const [showMaterialEditor, setShowMaterialEditor] = useState(false);
  const [layerMaterials, setLayerMaterials] = useState<Record<string, any>>({
    'LAYER_04': { id: 'MAT_04', name: 'Overlay_Mesh', type: 'EMISSIVE_FLOW', weight: '50gsm', transparency: 70, elasticity: 20, gloss: 90, color: '#00b8d9' },
    'LAYER_03': { id: 'MAT_03', name: 'Pattern_Graphene', type: 'TEXTURE_MAP', weight: '120gsm', transparency: 10, elasticity: 85, gloss: 40, color: '#333333' },
    'LAYER_02': { id: 'MAT_02', name: 'Base_Structure', type: 'GEOMETRY_SOLID', weight: '220gsm', transparency: 0, elasticity: 5, gloss: 15, color: '#e2e2e2' },
    'LAYER_01': { id: 'MAT_01', name: 'Neural_Skeleton', type: 'SYSTEM_STRUCTURE', weight: '180gsm', transparency: 40, elasticity: 50, gloss: 50, color: '#1a1a1a' }
  });

  // Interactive 3D Model State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const garmentGroupRef = useRef<THREE.Group | null>(null);

  const [selectedPart, setSelectedPart] = useState<string>('Main_Torso');
  const [partOverrides, setPartOverrides] = useState<Record<string, {
    color: string;
    metalness: number;
    roughness: number;
    opacity: number;
  }>>({
    'Collar': { color: '#1a1a1a', metalness: 40, roughness: 30, opacity: 100 },
    'Sleeve_Left': { color: '#00b8d9', metalness: 70, roughness: 10, opacity: 80 },
    'Sleeve_Right': { color: '#00b8d9', metalness: 70, roughness: 10, opacity: 80 },
    'Main_Torso': { color: '#333333', metalness: 20, roughness: 80, opacity: 100 },
    'Pocket_Tech': { color: '#ff4400', metalness: 90, roughness: 5, opacity: 90 },
    'Hem_Bottom': { color: '#1a1a1a', metalness: 10, roughness: 90, opacity: 100 }
  });

  // Initialize interactive 3D scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);
    cameraRef.current = camera;

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    // Dynamic Directional Light
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00ffff, 0.7);
    dirLight2.position.set(-5, -2, 2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xff00ff, 0.9, 10);
    pointLight.position.set(0, 2, -2);
    scene.add(pointLight);

    // Aesthetic grid lines in the background floor
    const gridHelper = new THREE.GridHelper(20, 20, 0x00ff41, 0x222222);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Construct customizable 3D garment model group
    const garmentGroup = new THREE.Group();
    garmentGroupRef.current = garmentGroup;

    // Main Torso Mesh
    const torsoGeom = new THREE.CylinderGeometry(0.81, 1.1, 2.6, 32);
    const torsoMat = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.2, roughness: 0.8 });
    const torsoMesh = new THREE.Mesh(torsoGeom, torsoMat);
    torsoMesh.name = 'Main_Torso';
    torsoMesh.position.y = 0;
    garmentGroup.add(torsoMesh);

    // Elegant Collar Mesh
    const collarGeom = new THREE.TorusGeometry(0.8, 0.15, 16, 100);
    const collarMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, metalness: 0.4, roughness: 0.3 });
    const collarMesh = new THREE.Mesh(collarGeom, collarMat);
    collarMesh.name = 'Collar';
    collarMesh.position.y = 1.3;
    collarMesh.rotation.x = Math.PI / 2;
    garmentGroup.add(collarMesh);

    // Left Futuristic Sleeves
    const sleeveLGeom = new THREE.CylinderGeometry(0.25, 0.18, 2.0, 16);
    const sleeveLMat = new THREE.MeshPhysicalMaterial({ color: 0x00b8d9, metalness: 0.7, roughness: 0.1 });
    const sleeveLMesh = new THREE.Mesh(sleeveLGeom, sleeveLMat);
    sleeveLMesh.name = 'Sleeve_Left';
    sleeveLMesh.position.set(-1.2, 0.2, 0);
    sleeveLMesh.rotation.z = Math.PI / 8;
    garmentGroup.add(sleeveLMesh);

    // Right Futuristic Sleeves
    const sleeveRGeom = new THREE.CylinderGeometry(0.25, 0.18, 2.0, 16);
    const sleeveRMat = new THREE.MeshPhysicalMaterial({ color: 0x00b8d9, metalness: 0.7, roughness: 0.1 });
    const sleeveRMesh = new THREE.Mesh(sleeveRGeom, sleeveRMat);
    sleeveRMesh.name = 'Sleeve_Right';
    sleeveRMesh.position.set(1.2, 0.2, 0);
    sleeveRMesh.rotation.z = -Math.PI / 8;
    garmentGroup.add(sleeveRMesh);

    // Tactical Emissive Tech Pocket
    const pocketGeom = new THREE.BoxGeometry(0.4, 0.6, 0.15);
    const pocketMat = new THREE.MeshPhysicalMaterial({ color: 0xff4400, metalness: 0.9, roughness: 0.05 });
    const pocketMesh = new THREE.Mesh(pocketGeom, pocketMat);
    pocketMesh.name = 'Pocket_Tech';
    pocketMesh.position.set(0.4, 0.1, 0.9);
    garmentGroup.add(pocketMesh);

    // Lower Hem Mesh
    const hemGeom = new THREE.CylinderGeometry(1.1, 1.15, 0.2, 32);
    const hemMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, metalness: 0.1, roughness: 0.9 });
    const hemMesh = new THREE.Mesh(hemGeom, hemMat);
    hemMesh.name = 'Hem_Bottom';
    hemMesh.position.y = -1.3;
    garmentGroup.add(hemMesh);

    scene.add(garmentGroup);

    // Animation Loop
    let animationFrameId: number;
    let angle = 0;
    const animate = () => {
      // Gentle floating and idle rotation
      angle += 0.006;
      garmentGroup.rotation.y = angle * 0.4;
      garmentGroup.position.y = Math.sin(angle) * 0.05;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Auto-fit on window resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (rendererRef.current && cameraRef.current) {
          rendererRef.current.setSize(width, height);
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update physical materials in real-time when parent state or selection changes
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const override = partOverrides[child.name];
        if (override && child.material instanceof THREE.MeshPhysicalMaterial) {
          child.material.color.set(override.color);
          child.material.metalness = override.metalness / 100;
          child.material.roughness = override.roughness / 100;
          child.material.opacity = override.opacity / 100;
          child.material.transparent = override.opacity < 100;

          // Beautiful dynamic selected active highlight
          const isSelected = child.name === selectedPart;
          if (isSelected) {
            child.material.emissive.setHex(0x00ff41);
            child.material.emissiveIntensity = 0.45;
          } else {
            child.material.emissive.setHex(0x000000);
            child.material.emissiveIntensity = 0;
          }
          child.material.needsUpdate = true;
        }
      }
    });
  }, [partOverrides, selectedPart]);

  // Handle Raycasting click inside 3D environment
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    
    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
    
    if (intersects.length > 0) {
      const firstNamed = intersects.find(item => item.object.name);
      if (firstNamed) {
        setSelectedPart(firstNamed.object.name);
      }
    }
  };

  return (
    <div className="h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
      {/* Tool Sidebar - Extreme Left */}
      <div className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-6 bg-black/40 backdrop-blur-xl">
        {[
          { icon: MousePointer2, id: 'select' },
          { icon: Brush, id: 'brush' },
          { icon: Scissors, id: 'vector' },
          { icon: Box, id: 'extrude' },
          { icon: Palette, id: 'fill' },
          { icon: Type, id: 'text' },
          { icon: Eraser, id: 'erase' }
        ].map(tool => (
          <button 
            key={tool.id}
            className="p-3 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-zinc-500 hover:text-white group"
          >
            <tool.icon size={20} className="group-active:scale-90 transition-transform" />
          </button>
        ))}
        <div className="mt-auto flex flex-col gap-4">
           <button className="p-3 rounded-2xl bg-primary text-black shadow-lg shadow-primary/20">
              <Sparkles size={20} />
           </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex flex-col">
         {/* Top Workspace Header */}
         <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3">
                  <LayoutGrid size={16} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Garment_Canvas_v8</span>
               </div>
               <div className="h-4 w-px bg-white/10" />
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500">PROJECT: NEURAL_TRENCH_2026</span>
                  <ChevronRight size={10} className="text-zinc-700" />
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-zinc-800 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Collaborator" />
                    </div>
                  ))}
               </div>
               <button className="bg-white text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                  Publish_Studio
               </button>
            </div>
         </header>

         {/* The Canvas */}
         <div className="flex-1 bg-dot-grid relative overflow-hidden flex items-center justify-center">
            <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
               <canvas 
                 ref={canvasRef} 
                 onClick={handleCanvasClick}
                 className="w-full h-full cursor-pointer z-10"
               />

               {/* Viewport HUD */}
               <div className="absolute bottom-10 left-10 z-20 pointer-events-none">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] font-black italic tracking-[0.2em] text-[#00ff41] uppercase">// SEC_INTEGRITY_VERIFIED_0x7A</span>
                     <span className="text-[18px] font-black uppercase text-white shadow-text">
                        {selectedPart ? selectedPart.replace('_', ' ').toUpperCase() : 'NEURAL MODEL'}
                     </span>
                     <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
                        COLOR: {partOverrides[selectedPart]?.color} / METAL: {partOverrides[selectedPart]?.metalness}% / ROUGH: {partOverrides[selectedPart]?.roughness}%
                     </span>
                  </div>
               </div>

               <div className="absolute top-10 right-10 z-20">
                  <div className="p-4 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/5 text-[9px] font-black tracking-widest text-[#00ff41] uppercase animate-pulse">
                     [ 3D INTERACTIVE INTENT PORT ]
                  </div>
               </div>
            </div>

            {/* Float HUD Controls */}
            <div className="absolute top-10 left-10 flex flex-col gap-4">
                <div className="p-6 rounded-[2rem] bg-black/60 backdrop-blur-3xl border border-white/10 space-y-4 shadow-2xl">
                   <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest italic">Simulation_State</p>
                   <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-black">PHYSICS_ENGINE_ACTIVE</span>
                   </div>
                </div>
            </div>
         </div>
      </div>

      {/* Right Property Inspector / Layer Stack */}
      <div className="w-80 border-l border-white/5 bg-black/40 backdrop-blur-xl flex flex-col">
         {/* Layers Section */}
         <div className="p-8 flex-1 space-y-6 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Layers size={16} className="text-primary" />
                  <h3 className="text-xs font-black uppercase italic tracking-tighter">Layers</h3>
               </div>
               <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                  <Plus size={14} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
               {layers.map(layer => (
                 <div 
                   key={layer.id}
                   onClick={() => setActiveLayer(layer.id)}
                   className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${
                     activeLayer === layer.id ? 'bg-white text-black border-white' : 'bg-white/5 border-transparent text-zinc-500 hover:text-white hover:bg-white/10'
                   }`}
                 >
                    <div className="flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className={`text-[8px] font-black uppercase tracking-widest ${activeLayer === layer.id ? 'text-black/40' : 'text-zinc-600'}`}>{layer.type}</span>
                          <span className="text-[11px] font-black">{layer.name}</span>
                       </div>

                       {/* Interactive layer opacity slider nested inline under the dynamic selection indicator */}
                       {activeLayer === layer.id && (
                          <div 
                             className="mt-4 pt-3 border-t border-black/10 space-y-1.5"
                             onClick={(e) => e.stopPropagation()}
                          >
                             <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-black/60 font-mono">
                                <span>Layer Opacity</span>
                                <span>{layerMaterials[layer.id]?.transparency ?? 0}%</span>
                             </div>
                             <input 
                                type="range"
                                min="0"
                                max="100"
                                value={layerMaterials[layer.id]?.transparency ?? 0}
                                onChange={(e) => {
                                   const val = parseInt(e.target.value);
                                   setLayerMaterials(prev => ({
                                      ...prev,
                                      [layer.id]: { ...prev[layer.id], transparency: val }
                                   }));
                                }}
                                className="w-full h-[2px] bg-black/10 rounded-full appearance-none cursor-pointer accent-black"
                             />
                          </div>
                       )}
                       <Zap size={12} className={activeLayer === layer.id ? 'text-zinc-900' : 'text-primary opacity-0 group-hover:opacity-100 transition-all'} />
                    </div>
                 </div>
               ))}
            </div>

            {/* Active Layer Material controls */}
            <div className="pt-6 border-t border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic font-mono">Material_Config</span>
                  <button 
                     onClick={() => setShowMaterialEditor(true)}
                     className="text-[8px] font-black uppercase tracking-widest text-[#00ff41] italic underline hover:text-white transition-all font-mono"
                  >
                     Tune_Molecular &rarr;
                  </button>
               </div>
               
               <div className="space-y-3">
                  {/* Slider 1: Transparency */}
                  <div className="space-y-1">
                     <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-400 font-mono">
                        <span>Transparency</span>
                        <span>{layerMaterials[activeLayer]?.transparency}%</span>
                     </div>
                     <input 
                        type="range"
                        min="0"
                        max="100"
                        value={layerMaterials[activeLayer]?.transparency || 0}
                        onChange={(e) => {
                           const val = parseInt(e.target.value);
                           setLayerMaterials(prev => ({
                              ...prev,
                              [activeLayer]: { ...prev[activeLayer], transparency: val }
                           }));
                        }}
                        className="w-full h-[3px] bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                     />
                  </div>

                  {/* Slider 2: Elasticity */}
                  <div className="space-y-1">
                     <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-400 font-mono">
                        <span>Elasticity</span>
                        <span>{layerMaterials[activeLayer]?.elasticity}%</span>
                     </div>
                     <input 
                        type="range"
                        min="0"
                        max="100"
                        value={layerMaterials[activeLayer]?.elasticity || 0}
                        onChange={(e) => {
                           const val = parseInt(e.target.value);
                           setLayerMaterials(prev => ({
                              ...prev,
                              [activeLayer]: { ...prev[activeLayer], elasticity: val }
                           }));
                        }}
                        className="w-full h-[3px] bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                     />
                  </div>

                  {/* Slider 3: Gloss */}
                  <div className="space-y-1">
                     <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-400 font-mono">
                        <span>Gloss</span>
                        <span>{layerMaterials[activeLayer]?.gloss}%</span>
                     </div>
                     <input 
                        type="range"
                        min="0"
                        max="100"
                        value={layerMaterials[activeLayer]?.gloss || 0}
                        onChange={(e) => {
                           const val = parseInt(e.target.value);
                           setLayerMaterials(prev => ({
                              ...prev,
                              [activeLayer]: { ...prev[activeLayer], gloss: val }
                           }));
                        }}
                        className="w-full h-[3px] bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                     />
                  </div>
               </div>
            </div>

            {/* 3D Part Overrides Section */}
            <div className="pt-6 border-t border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#00ff41] italic font-mono animate-pulse">// 3D_MODEL_OVERRIDES</span>
                     <span className="text-[11px] font-black uppercase text-white mt-1">Active: {selectedPart.replace('_', ' ')}</span>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-600 uppercase">[ RAYCAST_ACTIVE ]</span>
               </div>

               {partOverrides[selectedPart] ? (
                 <div className="space-y-4">
                    {/* Color Selector */}
                    <div className="space-y-2">
                       <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 font-mono">Part Color</span>
                       <div className="flex gap-2.5 overflow-x-auto py-1">
                          {[
                             { c: '#1a1a1a', name: 'Ink' },
                             { c: '#00b8d9', name: 'Teal' },
                             { c: '#ff4400', name: 'Neon Coral' },
                             { c: '#ffffff', name: 'Glow White' },
                             { c: '#00ff41', name: 'Cyber Green' },
                             { c: '#bf5af2', name: 'Purp' }
                          ].map(item => (
                             <button
                                key={item.c}
                                onClick={() => {
                                   setPartOverrides(prev => ({
                                      ...prev,
                                      [selectedPart]: { ...prev[selectedPart], color: item.c }
                                   }));
                                }}
                                className={`w-7 h-7 rounded-lg border flex-shrink-0 transition-all ${
                                   partOverrides[selectedPart].color === item.c ? 'border-primary scale-110 ring-2 ring-primary/25' : 'border-white/10 opacity-60 hover:opacity-100'
                                }`}
                                style={{ backgroundColor: item.c }}
                                title={item.name}
                             />
                          ))}
                       </div>
                    </div>

                    {/* Metalness Slider */}
                    <div className="space-y-1">
                       <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-400 font-mono">
                          <span>Metalness</span>
                          <span>{partOverrides[selectedPart].metalness}%</span>
                        </div>
                        <input 
                           type="range"
                           min="0"
                           max="100"
                           value={partOverrides[selectedPart].metalness}
                           onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setPartOverrides(prev => ({
                                 ...prev,
                                 [selectedPart]: { ...prev[selectedPart], metalness: val }
                              }));
                           }}
                           className="w-full h-[3px] bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                        />
                     </div>

                     {/* Roughness Slider */}
                     <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-400 font-mono">
                           <span>Roughness</span>
                           <span>{partOverrides[selectedPart].roughness}%</span>
                        </div>
                        <input 
                           type="range"
                           min="0"
                           max="100"
                           value={partOverrides[selectedPart].roughness}
                           onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setPartOverrides(prev => ({
                                 ...prev,
                                 [selectedPart]: { ...prev[selectedPart], roughness: val }
                              }));
                           }}
                           className="w-full h-[3px] bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                        />
                     </div>

                     {/* Opacity Slider */}
                     <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-400 font-mono">
                           <span>Opacity</span>
                           <span>{partOverrides[selectedPart].opacity}%</span>
                        </div>
                        <input 
                           type="range"
                           min="10"
                           max="100"
                           value={partOverrides[selectedPart].opacity}
                           onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setPartOverrides(prev => ({
                                 ...prev,
                                 [selectedPart]: { ...prev[selectedPart], opacity: val }
                              }));
                           }}
                           className="w-full h-[3px] bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                        />
                     </div>
                  </div>
                ) : (
                  <p className="text-[9px] font-mono text-zinc-600">Select a part in viewport to overwrite metadata.</p>
                )}

                {/* Quick selector list */}
                <div className="pt-2">
                   <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 font-mono block mb-1.5">Direct Selector Mesh</span>
                   <div className="grid grid-cols-2 gap-1.5 font-sans">
                      {Object.keys(partOverrides).map(partName => (
                         <button
                            key={partName}
                            onClick={() => setSelectedPart(partName)}
                            className={`px-2 py-1.5 text-left text-[9px] font-mono rounded transition-all truncate border ${
                               selectedPart === partName 
                               ? 'bg-primary/20 text-white border-primary/30 font-bold' 
                               : 'bg-white/5 text-zinc-400 hover:text-white border-transparent'
                            }`}
                         >
                            &gt; {partName.replace('_', ' ')}
                         </button>
                      ))}
                   </div>
                </div>
             </div>

             {/* Prompt Engine Panel */}
             <div className="pt-6 border-t border-white/10 space-y-4">
               <div className="flex items-center gap-3">
                  <Wand2 size={16} className="text-primary" />
                  <h3 className="text-xs font-black uppercase italic tracking-tighter">Neural Engine</h3>
               </div>

               <div className="space-y-4">
                  <div className="p-4 bg-zinc-900 rounded-2xl border border-white/5 space-y-2">
                     <p className="text-[8px] font-black text-zinc-500 uppercase">Current_Prompt_Vector</p>
                     <p className="text-[10px] font-mono leading-relaxed text-zinc-300">
                        "Hyper-realistic architectural silk with procedural graphene lattices..."
                     </p>
                  </div>
                  <button className="w-full py-4 bg-primary text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all italic">
                     Regenerate_Artifact
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Immersive Material Editor Slide-over */}
      <AnimatePresence>
         {showMaterialEditor && (
            <motion.div
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 180 }}
               className="fixed top-0 right-0 w-full md:w-[680px] h-full bg-[#070707]/95 backdrop-blur-3xl border-l border-white/5 z-50 p-12 overflow-y-auto"
            >
               <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#00ff41] italic font-mono animate-pulse">// MOLECULAR_MATERIAL_SUITE</span>
                  </div>
                  <button 
                     onClick={() => setShowMaterialEditor(false)}
                     className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500 hover:text-white transition-all font-mono"
                  >
                     [ CLOSE EDITOR ]
                  </button>
               </div>

               <MaterialEditor 
                  material={layerMaterials[activeLayer]}
                  onChange={(updated) => setLayerMaterials(prev => ({
                     ...prev,
                     [activeLayer]: updated
                  }))}
                  hideHeader={true}
               />
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};
