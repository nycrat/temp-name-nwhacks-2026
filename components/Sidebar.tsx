"use client";

import React from "react";
import { LiveClass } from "../lib/types";
import { LiveClassCard } from "./LiveClassCard";
import { stringToTime } from "@/lib/helpers";
import { now } from "@/lib/constants";

interface SidebarProps {
  liveClasses: LiveClass[];
  selectedClassId?: string;
  onSelectClass: (item: LiveClass) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  liveClasses,
  selectedClassId,
  onSelectClass,
}) => {
  const liveNow = liveClasses.filter((cls) => {
    const end = new Date(
      stringToTime(cls.startTime).getTime() + cls.durationMinutes * 60000,
    );
    return stringToTime(cls.startTime) <= now && end >= now;
  });

  const upcoming = liveClasses.filter(
    (cls) => stringToTime(cls.startTime) > now,
  );

  const past = liveClasses.filter((cls) => {
    const end = new Date(
      stringToTime(cls.startTime).getTime() + cls.durationMinutes * 60000,
    );
    return end < now;
  });

  console.log(upcoming, past);

  return (
    <aside className="w-[30%] min-w-[360px] h-full flex flex-col border-r border-white/5 bg-background-dark/50 backdrop-blur-xl shrink-0">
      <div className="p-8 pb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-white text-3xl font-bold tracking-tight">
            Today's Audit
          </h1>
        </div>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">
          University of British Columbia
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-8">
        {liveNow.length > 0 && (
          <section>
            <h2 className="px-4 mb-4 text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="size-1.5 bg-primary rounded-full"></span>
              Happening Now
            </h2>
            <div className="space-y-3">
              {liveNow.map((item) => (
                <LiveClassCard
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedClassId}
                  onSelect={onSelectClass}
                />
              ))}
            </div>
          </section>
        )}

        {upcoming.length > 0 && (
          <section>
            <div className="px-4 mb-4 flex items-center gap-4">
              <h2 className="shrink-0 text-xs font-black text-gray-600 uppercase tracking-[0.2em]">
                Upcoming
              </h2>
              <div className="h-[1px] w-full bg-white/5"></div>
            </div>
            <div className="space-y-3">
              {upcoming.map((item) => (
                <LiveClassCard
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedClassId}
                  onSelect={onSelectClass}
                />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <div className="px-4 mb-4 flex items-center gap-4">
              <h2 className="shrink-0 text-xs font-black text-gray-600 uppercase tracking-[0.2em]">
                Past
              </h2>
              <div className="h-[1px] w-full bg-white/5"></div>
            </div>
            <div className="space-y-3">
              {past.map((item) => (
                <LiveClassCard
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedClassId}
                  onSelect={onSelectClass}
                />
              ))}
            </div>
          </section>
        )}

        {liveClasses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <span className="material-symbols-outlined text-4xl mb-2">
              event_busy
            </span>
            <p className="text-sm font-bold uppercase">No classes today</p>
          </div>
        )}
      </div>
    </aside>
  );
};
