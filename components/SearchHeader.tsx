"use client";

import React, { useState, KeyboardEvent, useRef } from "react";
import { useNow } from "./NowProvider";

interface SearchHeaderProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  onSearch,
  isLoading,
}) => {
  const [value, setValue] = useState("");
  const { setNow } = useNow();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(value);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.showPicker?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNow(new Date(e.target.value));
  };

  return (
    <div className="w-full max-w-5xl px-6 flex items-center gap-6">
      <div className="relative group grow">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>

        <div
          className={`relative bg-panel-dark/80 backdrop-blur-md border border-white/10 rounded-2xl p-2 transition-all duration-300 ${isLoading ? "border-primary/40" : "group-hover:border-white/20"}`}
        >
          <div className="flex items-center gap-4 px-4 py-3">
            <span
              className={`material-symbols-outlined text-gray-400 text-2xl ${isLoading ? "animate-spin text-primary" : ""}`}
            >
              {isLoading ? "progress_activity" : "auto_awesome"}
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-base font-medium text-white w-full placeholder-gray-600 font-display focus:outline-none h-6 leading-6"
              type="text"
              placeholder="Ask about classes using natural language..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            {value && !isLoading && (
              <button
                onClick={() => setValue("")}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleButtonClick}
        className="text-gray-500 hover:text-white transition-colors p-1"
      >
        <span className="material-symbols-outlined">settings</span>
      </button>

      <input
        type="datetime-local"
        ref={inputRef}
        onChange={handleChange}
        className="absolute right-0 top-22 invisible"
      />
    </div>
  );
};
