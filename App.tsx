'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { SearchHeader } from './components/SearchHeader';
import { Header } from './components/Header';
import { INITIAL_LIVE_CLASSES } from './constants';
import { LiveClass } from './types';

const App: React.FC = () => {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(INITIAL_LIVE_CLASSES);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);

  // update class progress based on real time
  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      setLiveClasses(prev => prev.map(cls => {
        const elapsed = (now.getTime() - cls.startTime.getTime()) / 60000;
        if (elapsed < 0) return { ...cls, progress: 0 };
        const prog = Math.min(100, Math.max(0, (elapsed / cls.durationMinutes) * 100));
        return { ...cls, progress: parseFloat(prog.toFixed(1)) };
      }));
    };

    updateProgress();
    const interval = setInterval(updateProgress, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    // simulate a fake search delay
    await new Promise(r => setTimeout(r, 1200));
    setIsLoading(false);
  }, []);

  const handleSelectClass = useCallback((item: LiveClass) => {
    setSelectedClass(item);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-background-dark text-white font-display overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar maintains the list of live and upcoming classes */}
        <Sidebar 
          liveClasses={liveClasses} 
          selectedClassId={selectedClass?.id}
          onSelectClass={handleSelectClass}
        />
        
        {/* Search Main Panel + future map? */}
        <main className="flex-1 relative flex flex-col items-center justify-center bg-background-dark overflow-hidden p-8">
          {/* little glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <SearchHeader onSearch={handleSearch} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
};

export default App;