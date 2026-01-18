
'use client';

import React, { useEffect, useRef } from 'react';
import { LiveClass } from '../types';

interface MapPanelProps {
  selectedClass: LiveClass | null;
}

// Mock building coordinates for UBC
const BUILDING_COORDS: Record<string, { lat: number, lng: number }> = {
  'DMP 110': { lat: 49.2612, lng: -123.2488 },
  'BUCH A101': { lat: 49.2681, lng: -123.2547 },
  'HEBB 10': { lat: 49.2662, lng: -123.2523 },
  'LSK 201': { lat: 49.2651, lng: -123.2504 },
};

const MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#121212" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#121212" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#00a1ff" }, { "visibility": "simplified" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#1b1b1b" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0a192f" }] }
];

export const MapPanel: React.FC<MapPanelProps> = ({ selectedClass }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMap = useRef<any>(null);
  const marker = useRef<any>(null);
  
  const getCoordsForRoom = async (room: string): Promise<{ lat: number; lng: number }> => {

    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      // construct address based on building code
      const buildingCode = room.split(' ')[0].toUpperCase();
      const address = `UBC ${buildingCode}, Vancouver, BC, Canada`;
      
      geocoder.geocode({ address }, (results: any, status: string) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
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
    const initMap = () => {
      if (!mapRef.current) return;
      
      const ubcCenter = { lat: 49.2676, lng: -123.2473 };
      googleMap.current = new window.google.maps.Map(mapRef.current, {
        center: ubcCenter,
        zoom: 15,
        styles: MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
      });
    };

    if (!window.google) {
      const script = document.createElement('script');
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key is not configured. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file.');
        return;
      }
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  useEffect(() => {
    if (googleMap.current && selectedClass && window.google) {
      getCoordsForRoom(selectedClass.location).then((coords) => {
        if (!googleMap.current) return;
        
        googleMap.current.panTo(coords);
        googleMap.current.setZoom(17);

        if (marker.current) marker.current.setMap(null);

        marker.current = new window.google.maps.Marker({
          position: coords,
          map: googleMap.current,
          title: selectedClass.course.code,
          animation: window.google.maps.Animation.DROP,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#00a1ff",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
          }
        });
      });
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
