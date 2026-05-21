
import React, { useEffect, useState } from 'react';
import { PipelineStatus } from '../types';

export const PipelineDashboard: React.FC = () => {
  const [status, setStatus] = useState<PipelineStatus | null>(null);

  useEffect(() => {
    // In production, this would be a real-time WebSocket or API polling.
    // We are setting up the structure for the real API.
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/fashion/pipeline-status');
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        }
      } catch (error) {
        console.error('Failed to fetch pipeline status', error);
      }
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div className="text-zinc-500 text-xs">Connecting to GPU Runtime...</div>;

  return (
    <div className="p-6 bg-white border border-black/5 rounded-3xl shadow-sm">
      <h2 className="text-sm font-black text-black mb-6">Pipeline Runtime Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-black/5 rounded-xl">
           <p className="text-[10px] text-zinc-500 uppercase">GPU Utilization</p>
           <p className="text-2xl font-mono text-emerald-600">{status.gpuUtilization}%</p>
        </div>
        <div className="p-4 bg-black/5 rounded-xl">
           <p className="text-[10px] text-zinc-500 uppercase">VRAM Usage</p>
           <p className="text-2xl font-mono text-emerald-600">{status.vramUsage}GB</p>
        </div>
        <div className="col-span-2 p-4 bg-black/5 rounded-xl">
           <p className="text-[10px] text-zinc-500 uppercase mb-2">Queue Depth</p>
           <div className="flex gap-4">
              <p className="text-xs">Gen: <span className="text-black">{status.queueStatus.generation}</span></p>
              <p className="text-xs">Embed: <span className="text-black">{status.queueStatus.embedding}</span></p>
              <p className="text-xs">Scrape: <span className="text-black">{status.queueStatus.scraping}</span></p>
           </div>
        </div>
      </div>
    </div>
  );
};
