import React from 'react';
import { LiveClass } from '../types';

interface LiveClassCardProps {
  item: LiveClass;
}

export const LiveClassCard: React.FC<LiveClassCardProps> = ({ item }) => {
  const sneakScoreColors = {
    'High': 'bg-green-500',
    'Medium': 'bg-yellow-500',
    'Low': 'bg-red-500'
  };

  const progress = item.progress || 0;
  const timeString = item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(item.startTime.getTime() + item.durationMinutes * 60000);
  const endTimeString = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // ubc learning spaces link
  const formattedLocation = item.location
  .toLowerCase()
  .replace(/\s+/g, '-');

const mapLink = `https://learningspaces.ubc.ca/classrooms/${formattedLocation}/`;

  return (
    <a 
      href={mapLink} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`block bg-panel-dark p-4 rounded-xl border border-white/5 hover:border-primary/50 transition-all group ${progress > 90 ? 'opacity-60' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col max-w-[70%]">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-white font-bold text-base group-hover:text-primary transition-colors">{item.course.code}</h3>
            <span className="text-[8px] text-gray-500 font-mono bg-white/5 px-1 rounded">CAP: {item.capacity}</span>
          </div>
          <p className="text-gray-400 text-xs font-medium truncate">{item.course.name}</p>
          <span className="text-[10px] text-primary/80 font-medium italic mt-0.5">with {item.instructor}</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-gray-400 font-mono mb-1">{item.location}</div>
          <div className="flex items-center gap-1">
             <div className={`size-1.5 rounded-full ${sneakScoreColors[item.sneakScore] || 'bg-gray-500'}`}></div>
             <span className="text-[8px] text-gray-500 uppercase font-bold tracking-tighter">Sneak: {item.sneakScore}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-medium">{timeString} - {endTimeString}</span>
            <div className="h-1 w-24 bg-white/5 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
         </div>
         <div className="flex items-center gap-1 text-[9px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase">
            <span>Navigate</span>
            <span className="material-symbols-outlined text-xs">arrow_outward</span>
         </div>
      </div>
    </a>
  );
};