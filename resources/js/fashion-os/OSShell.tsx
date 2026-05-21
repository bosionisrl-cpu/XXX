import React, { useState, useEffect } from 'react';
import { FashionOSLayout } from './layout/FashionOSLayout';
import { HomePage } from './pages/HomePage';
import { AIOperationsCenter } from '../../../AIOperationsCenter';
import { ErrorBoundary } from '../../../src/components/ErrorBoundary';
import { Language } from '../../../types';

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
        {viewMode === 'aesthetics' ? (
          <HomePage />
        ) : (
          <AIOperationsCenter 
            lang={lang} 
            preloadedDesign={preloadedDesign}
            onDesignUsed={() => setPreloadedDesign(null)} 
          />
        )}
      </ErrorBoundary>
    </FashionOSLayout>
  );
};
