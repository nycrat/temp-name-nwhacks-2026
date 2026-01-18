"use client";

import React from "react";
import { LiveClass } from "../lib/types";

interface CourseDetailsDrawerProps {
  selectedClass: LiveClass | null;
  onClose: () => void;
}

export const CourseDetailsDrawer: React.FC<CourseDetailsDrawerProps> = ({
  selectedClass,
  onClose,
}) => {
  if (!selectedClass) return null;

  const subjectCode = selectedClass.course.code.toLowerCase().split(" ")[0];
  const possibleExtensions = [".jpg", ".png", ".jpeg", ".JPG", ".PNG", ".JPEG"];
  const imageUrl = `/assets/${subjectCode}.jpg`;

  const formattedLocation = selectedClass.location
    .toLowerCase()
    .replace(/\s+/g, "-");

  const sneakScoreColors = {
    Low: "text-red-500",
    Medium: "text-yellow-500",
    High: "text-green-500",
  };

  const colorClass =
    sneakScoreColors[selectedClass.sneakScore] || "text-gray-500";

  const mapLink = `https://learningspaces.ubc.ca/classrooms/${formattedLocation}/`;

  return (
    <div className="absolute bottom-0 inset-x-0 z-[60] animate-in slide-in-from-bottom duration-500 ease-out">
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="relative bg-panel-dark/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-5">
          {/* close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all z-10"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* course info */}
            <div className="w-full md:w-56 aspect-video md:aspect-square rounded-xl overflow-hidden border border-white/5 shrink-0">
              <img
                src={imageUrl}
                className="w-full h-full object-cover grayscale-[0.2]"
                alt={selectedClass.course.name}
                onError={(e) => {
                  // trying diff extensions
                  const target = e.target as HTMLImageElement;
                  const currentSrc = target.src;
                  if (currentSrc.endsWith(".jpg")) {
                    target.src = currentSrc.replace(".jpg", ".png");
                  } else if (currentSrc.endsWith(".png")) {
                    target.src = currentSrc.replace(".png", ".jpeg");
                  } else if (currentSrc.endsWith(".jpeg")) {
                    target.src = currentSrc.replace(".jpeg", ".JPG");
                  }
                }}
              />
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-primary font-bold tracking-tighter text-3xl">
                  {selectedClass.course.code}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">
                {selectedClass.course.name}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-2">
                {selectedClass.course.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                    <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                      Instructor
                    </span>
                    <span className="text-sm font-semibold text-white truncate block">
                      {selectedClass.instructor}
                    </span>
                  </div>
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                    <span className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                      Sneakability
                    </span>
                    <span className={`text-sm font-bold ${colorClass}`}>
                      {selectedClass.sneakScore}
                    </span>
                  </div>
                </div>

                {/* view lecture hall button */}
                <div className="sm:w-56 flex items-end">
                  <button className="w-full bg-primary hover:bg-primary/80 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    <a href={mapLink} target="_blank" rel="noopener noreferrer">
                      {" "}
                      View Lecture Hall{" "}
                    </a>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
