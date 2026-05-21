import React, { useState, useEffect } from 'react';
import { FashionOSLayout } from './layout/FashionOSLayout';
import { HomePage } from './pages/HomePage';
import { AIOperationsCenter } from '../../../AIOperationsCenter';
import { ErrorBoundary } from '../../../src/components/ErrorBoundary';
import { Language } from '../../../types';
import { ImmichMediaVault } from './components/ImmichMediaVault';

export const OSShell: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [viewMode, setViewMode] = useState<'aesthetics' | 'operations'>('aesthetics');
  const [lang, setLang] = useState<Language>('zh'); // Primary language
  const [preloadedDesign, setPreloadedDesign] = useState<string | null>(null);

  useEffect(() => {
    const handleSend = (e: Event) => {
      const customEvent = e as CustomEvent<{ imageUrl: string }>;
      if (customEvent.detail && customEvent.detail.imageUrl) {
        setPreloadedDesign(customEvent.detail.imageUrl);
        setActiveTab('tryon');
        setViewMode('operations');
        
        // Push notification of the transition
        window.dispatchEvent(new CustomEvent('system-toast', { 
          detail: { message: 'CONNECTED ASSET LINKED // PIPELINE INITIALIZED' } 
        }));
      }
    };

    window.addEventListener('send-to-try-on', handleSend);
    return () => window.removeEventListener('send-to-try-on', handleSend);
  }, []);

  // Sync viewMode for sub-components in layout
  useEffect(() => {
    if (activeTab === 'home') {
      setViewMode('aesthetics');
    } else {
      setViewMode('operations');
    }
  }, [activeTab]);

  return (
    <FashionOSLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      lang={lang}
      onLangChange={setLang}
    >
      <ErrorBoundary>
        {activeTab === 'home' && (
          <HomePage />
        )}
        
        {activeTab === 'media-vault' && (
          <div className="w-full min-h-screen bg-black text-white p-6 md:p-12 space-y-8 select-none">
            <div className="flex justify-between items-center bg-black pb-4 border-b border-white/5">
              <span className="text-[10px] tracking-[0.3em] font-mono text-zinc-500 uppercase">LAYER_05 // INTELLIGENT ASSET VAULT</span>
              <span className="text-[8px] tracking-[0.2em] font-mono text-zinc-700 uppercase">IMMICH FULL-STACK CO-ENGINE</span>
            </div>
            <ImmichMediaVault />
          </div>
        )}
        
        {activeTab !== 'home' && activeTab !== 'media-vault' && (
          <AIOperationsCenter 
            lang={lang} 
            preloadedDesign={preloadedDesign}
            onDesignUsed={() => setPreloadedDesign(null)} 
            externalActiveTab={activeTab as any}
            onActiveTabChange={(t) => setActiveTab(t)}
          />
        )}
      </ErrorBoundary>
    </FashionOSLayout>
  );
};
