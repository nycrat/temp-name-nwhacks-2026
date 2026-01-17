import React from 'react';
import { LiveClass } from '../types';
import { LiveClassCard } from './LiveClassCard';

interface SidebarProps {
  liveClasses: LiveClass[];
}

export const Sidebar: React.FC<SidebarProps> = ({ liveClasses }) => {
  const now = new Date();

  const liveNow = liveClasses.filter(cls => {
    const end = new Date(cls.startTime.getTime() + cls.durationMinutes * 60000);
    return cls.startTime <= now && end >= now;
  });

  const upcoming = liveClasses.filter(cls => cls.startTime > now);

  return (
    <aside className="w-[30%] min-w-[360px] h-full flex flex-col border-r border-white/5 bg-background-dark/50 backdrop-blur-xl">
      <div className="p-8 pb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-white text-2xl font-bold tracking-tight">Today's Audit</h1>
        </div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">University of British Columbia</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-8">
        {liveNow.length > 0 && (
          <section>
            <h2 className="px-4 mb-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="size-1 bg-primary rounded-full"></span>
              Happening Now
            </h2>
            <div className="space-y-3">
              {liveNow.map((item) => (
                <LiveClassCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* upcoming live classes */}

        {upcoming.length > 0 && (
          <section>
            <div className="px-4 mb-4 flex items-center gap-4">
              <h2 className="shrink-0 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Upcoming</h2>
              <div className="h-[1px] w-full bg-white/5"></div>
            </div>
            <div className="space-y-3">
              {upcoming.map((item) => (
                <LiveClassCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {liveClasses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
            <p className="text-xs font-bold uppercase">No classes today</p>
          </div>
        )}
      </div>
    </aside>
  );
};