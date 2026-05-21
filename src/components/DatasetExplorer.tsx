import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Database, Tag, Eye } from 'lucide-react';

export const DatasetExplorer: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    // API to fetch real assets from the filesystem or DB
    fetch('/api/fashion/dataset').then(res => res.json()).then(setAssets);
  }, []);

  return (
    <div className="p-12 space-y-12">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-black italic">DATASET_EXPLORER</h2>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-4 py-2 border border-black/10 rounded-full text-xs font-bold uppercase"><Filter size={14}/>Filter</button>
           <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-xs font-bold uppercase"><Database size={14}/>Sync</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
         {assets.map((asset, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-black/5 rounded-3xl p-4 space-y-4 hover:bg-black/10 transition-colors"
           >
              <div className="aspect-square bg-white rounded-2xl overflow-hidden">
                 <img src={asset.url} className="w-full h-full object-cover" />
              </div>
              <div className="px-2">
                 <p className="text-[10px] font-black uppercase text-zinc-500">{asset.brand}</p>
                 <p className="text-xs font-bold italic">{asset.title}</p>
              </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
};
