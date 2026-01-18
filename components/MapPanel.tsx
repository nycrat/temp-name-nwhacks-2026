"use client";

import React, { useEffect, useRef, useState } from "react";
import { LiveClass } from "../lib/types";

interface MapPanelProps {
  selectedClass: LiveClass | null;
}

// Global flag to track if script is loading/loaded
let scriptLoading = false;
let scriptLoaded = false;

const MAP_STYLE = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "all",
    elementType: "geometry.stroke",
    stylers: [{ color: "#00a1ff" }, { weight: 2 }],
  },
  {
    featureType: "road",
    stylers: [{ color: "#444444" }],
  },
  { elementType: "labels.text.stroke", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ visibility: "off" }] },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.school",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.school",
    elementType: "labels.icon",
    stylers: [{ color: "#00a1ff" }],
  },
  {
    featureType: "poi.school",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#262e8c" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ visibility: "on" }, { color: "#888888" }],
  },
];

export const MapPanel: React.FC<MapPanelProps> = ({ selectedClass }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<any>(null);
  const marker = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const getCoordsForRoom = async (
    room: string,
  ): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      // construct address based on building code
      const buildingCode = room.split(" ")[0].toUpperCase();
      const address = `UBC ${buildingCode}`;

      geocoder.geocode({ address }, (results: any, status: string) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          // fallback to UBC center if geocoding fails
          const fallbackCoords = { lat: 49.2676, lng: -123.2473 };
          resolve(fallbackCoords);
        }
      });
    });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const initMap = () => {
      if (!mapRef.current || typeof window === "undefined" || !window.google)
        return;

      const ubcCenter = { lat: 49.2676, lng: -123.2473 };
      googleMap.current = new window.google.maps.Map(mapRef.current, {
        center: ubcCenter,
        zoom: 15,
        styles: MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
      });
    };

    // Check if script already exists in DOM
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]',
    );

    if (existingScript) {
      // Script already exists, wait for it to load or use it if already loaded
      if (window.google && window.google.maps) {
        initMap();
      } else {
        existingScript.addEventListener("load", initMap);
      }
      return;
    }

    // Check if already loading
    if (scriptLoading || scriptLoaded) {
      if (scriptLoaded && window.google) {
        initMap();
      }
      return;
    }

    // C\heck if already loaded
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      scriptLoaded = true;
      initMap();
      return;
    }

    // Load script
    scriptLoading = true;
    const script = document.createElement("script");
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error(
        "Google Maps API key is not configured. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file.",
      );
      scriptLoading = false;
      return;
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoading = false;
      scriptLoaded = true;
      initMap();
    };
    script.onerror = () => {
      scriptLoading = false;
      console.error("Failed to load Google Maps API");
    };
    document.head.appendChild(script);
  }, [isMounted]);

  useEffect(() => {
    if (googleMap.current && selectedClass && window.google) {
      getCoordsForRoom(selectedClass.location).then((coords) => {
        if (!googleMap.current) return;

        // offset latitude to make up for course description view at bottom
        googleMap.current.panTo({ lat: coords.lat - 0.00015, lng: coords.lng });
        googleMap.current.setZoom(19);

        if (marker.current) marker.current.setMap(null);

        marker.current = new window.google.maps.Marker({
          position: coords,
          map: googleMap.current,
          title: selectedClass.course.code,
          animation: window.google.maps.Animation.DROP,
          icon: {
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 8,
            fillColor: "#00a1ff",
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: "#ffffff",
          },
        });
      });
    }
    if (googleMap.current && !selectedClass && window.google) {
      if (marker.current) marker.current.setMap(null);
    }
  }, [selectedClass]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-t-3xl border-t border-white/5 bg-background-dark">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

declare global {
  interface Window {
    google: any;
  }
}
