"use client";

import React from "react";

export const Header: React.FC = () => {
  return (
    <nav className="h-16 w-full border-b border-white/5 bg-background-dark flex items-center px-8 shrink-0 z-50">
      <div className="flex items-center gap-3 select-none cursor-pointer">
        {/* Logo Icon (placeholder for now)*/}
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-white text-xl">
            account_balance
          </span>
        </div>

        {/* Site Name (TBD)*/}
        <span className="text-xl font-bold tracking-tighter text-white">
          ATTD
        </span>
      </div>

      {/* Spacer for potential right-side links in future */}
      <div className="flex-1"></div>

      <div className="flex items-center gap-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold hidden md:block">
          Campus Lecture Discovery v1.0
        </span>
      </div>
    </nav>
  );
};
