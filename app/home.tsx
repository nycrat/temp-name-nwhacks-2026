"use client";

import { useState, useCallback, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { SearchHeader } from "../components/SearchHeader";
import { Header } from "../components/Header";
import { MapPanel } from "../components/MapPanel";
import { CourseDetailsDrawer } from "../components/CourseDetailsDrawer";
import { Course, LiveClass } from "../lib/types";
import { useNow } from "@/components/NowProvider";
import { formatDatetime } from "@/lib/helpers";

export default function Home() {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [allLiveClasses, setAllLiveClasses] = useState<LiveClass[]>([]);
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const { now } = useNow();

  useEffect(() => {
    (async () => {
      if (!now) {
        return;
      }
      const res = await fetch(`/api/class/current?now=${formatDatetime(now)}`);
      const classes = await res.json();
      setLiveClasses(classes);
      setAllLiveClasses(classes); // store original unfiltered list
    })();
  }, [now]);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return;
      setIsLoading(true);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, now }),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          console.error("Search API error:", errorData);
          throw new Error(
            errorData.error || errorData.details || "Search failed",
          );
        }

        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setLiveClasses(data.results);
          setAllLiveClasses(data.results);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [now],
  );

  const handleSelectClass = useCallback((item: LiveClass) => {
    setSelectedClass(item);
    setSearchResults([]); // clear search results when focusing on a specific class map location
  }, []);

  const handleBuildingClick = useCallback(
    (buildingCode: string, filteredClasses: LiveClass[]) => {
      setLiveClasses(filteredClasses);
      setSelectedClass(null);
    },
    [],
  );

  return (
    <div className="flex flex-col h-dvh w-full bg-background-dark text-white font-display overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          liveClasses={liveClasses}
          selectedClassId={selectedClass?.id}
          onSelectClass={handleSelectClass}
        />

        <main className="flex-1 relative sm:flex flex-col hidden">
          {/* top Fixed Search Area */}
          <div className="w-full pt-8 pb-4 flex flex-col items-center bg-gradient-to-b from-background-dark to-transparent z-40">
            <SearchHeader onSearch={handleSearch} isLoading={isLoading} />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Map Area (Bottom) */}
            <div
              className={`flex-1 transition-all duration-700 ${searchResults.length > 0 ? "h-1/3 opacity-40" : "h-full opacity-100"}`}
            >
              <MapPanel
                selectedClass={selectedClass}
                liveClasses={allLiveClasses}
                onBuildingClick={handleBuildingClick}
              />
            </div>
          </div>

          {/* Course Details Bottom Drawer */}
          <CourseDetailsDrawer
            selectedClass={selectedClass}
            onClose={() => setSelectedClass(null)}
          />
        </main>
      </div>
    </div>
  );
}
