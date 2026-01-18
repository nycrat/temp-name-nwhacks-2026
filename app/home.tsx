"use client";

import React, { useState, useCallback, useEffect, use } from "react";
import { Sidebar } from "../components/Sidebar";
import { SearchHeader } from "../components/SearchHeader";
import { Header } from "../components/Header";
import { LiveClass } from "../lib/types";
import { stringToTime } from "@/lib/helpers";

export default function Home(props: {liveClasses: Promise<LiveClass[]>}) {
  const [liveClasses, setLiveClasses] =
    useState<LiveClass[]>(use(props.liveClasses));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      setLiveClasses((prev) =>
        prev.map((cls) => {
          const elapsed =
            (now.getTime() - stringToTime(cls.startTime).getTime()) / 60000;
          if (elapsed < 0) return { ...cls, progress: 0 };
          const prog = Math.min(
            100,
            Math.max(0, (elapsed / cls.durationMinutes) * 100),
          );
          return { ...cls, progress: parseFloat(prog.toFixed(1)) };
        }),
      );
    };

    updateProgress();
    const interval = setInterval(updateProgress, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-background-dark text-white font-display overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar liveClasses={liveClasses} />

        <main className="flex-1 relative flex flex-col items-center justify-center bg-background-dark overflow-hidden p-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
          <SearchHeader onSearch={handleSearch} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
}
