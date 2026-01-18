"use client";

import Image from "next/image";
import React from "react";
import Logo from "@/public/logo.jpeg";

export const Header: React.FC = () => {
  return (
    <nav className="h-16 w-full border-b border-white/5 bg-background-dark flex items-center px-8 shrink-0 z-50">
      <div className="flex items-center gap-3 select-none cursor-pointer">
        {/* Logo Icon (placeholder for now)*/}

        <div className="size-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <Image alt="ATTD (Attend) Logo" src={Logo} className="rounded-lg" />
        </div>

        {/* Site Name (TBD)*/}
        <span className="text-2xl font-bold tracking-tighter text-white">
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
