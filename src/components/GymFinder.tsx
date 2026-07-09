/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Star, 
  Activity, 
  Compass, 
  Bookmark, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Info,
  Map as MapIcon,
  Phone
} from 'lucide-react';
import { Gym, Trainer } from '../types';

interface GymFinderProps {
  gyms: Gym[];
  trainers: Trainer[];
  favoriteGyms: string[];
  toggleFavoriteGym: (gymId: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function GymFinder({ 
  gyms, 
  trainers, 
  favoriteGyms, 
  toggleFavoriteGym,
  setActiveTab
}: GymFinderProps) {
  const [selectedGym, setSelectedGym] = useState<Gym>(gyms[0]);
  const [mapZoom, setMapZoom] = useState(13);

  // We check if the Google Maps key exists. If not, we run a gorgeous Interactive Mockup Map.
  const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
  const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim() !== '';

  const getGymTrainers = (gymId: string) => {
    return trainers.filter(t => t.gymId === gymId);
  };

  const isFav = favoriteGyms.includes(selectedGym.id);

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      
      {/* Intro info bar */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3.5 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center space-x-2">
            <MapIcon className="w-5 h-5 text-indigo-400" />
            <span>Interactive Gym Finder</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Locate state-of-the-art affiliate gyms and connect directly with onsite trainers.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className={`w-2.5 h-2.5 rounded-full ${hasValidKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-slate-400">{hasValidKey ? 'Google Maps Connected' : 'Interactive Map Sandbox'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Gyms list and selection */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {gyms.map((gym) => {
              const isGymFav = favoriteGyms.includes(gym.id);
              const gymTrainersCount = getGymTrainers(gym.id).length;
              
              return (
                <div
                  key={gym.id}
                  id={`gym-card-${gym.id}`}
                  onClick={() => setSelectedGym(gym)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between gap-3 ${
                    selectedGym.id === gym.id
                      ? 'bg-gradient-to-r from-indigo-950/40 to-slate-900 border-indigo-500 shadow-md'
                      : 'bg-slate-900 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img 
                      src={gym.imageUrl} 
                      alt={gym.name} 
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800/80"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 font-display">
                        {gym.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-none">{gym.address.split(',')[0]}</p>
                      
                      <div className="flex items-center space-x-3 mt-2 text-[10px] text-slate-500 font-mono font-bold">
                        <span className="flex items-center space-x-0.5">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-slate-300">{gym.rating}</span>
                        </span>
                        <span>•</span>
                        <span>{gymTrainersCount} coaches</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end shrink-0">
                    <button
                      id={`gym-fav-${gym.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteGym(gym.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-500 hover:text-rose-500 transition-colors"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isGymFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">{gym.distance}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Map sandbox & Detailed specs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Map Simulation Panel */}
          <div className="h-64 rounded-2xl bg-slate-950 border border-slate-850 overflow-hidden relative shadow-inner">
            
            {/* Custom interactive Mockup Map Grid design (Matches perfectly "Space Grotesk & JetBrains Mono" tech-feel) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px] flex items-center justify-center">
              
              {/* Radial gradient background to simulate map terrain */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/20 opacity-90" />
              
              {/* Simulated streets lines */}
              <div className="absolute h-0.5 w-full bg-slate-800/40 top-1/4" />
              <div className="absolute h-0.5 w-full bg-slate-800/40 top-2/3" />
              <div className="absolute w-0.5 h-full bg-slate-800/40 left-1/3" />
              <div className="absolute w-0.5 h-full bg-slate-800/40 left-3/4" />

              {/* Gym Location Markers placed relative to grid */}
              {gyms.map((gym) => {
                const isSelected = selectedGym.id === gym.id;
                // Compute coordinates translation for simulation placement
                const xOffset = gym.id === 'gym_01' ? 'left-[30%]' : gym.id === 'gym_02' ? 'left-[65%]' : 'left-[45%]';
                const yOffset = gym.id === 'gym_01' ? 'top-[28%]' : gym.id === 'gym_02' ? 'top-[50%]' : 'top-[75%]';

                return (
                  <button
                    key={gym.id}
                    id={`map-marker-${gym.id}`}
                    onClick={() => setSelectedGym(gym)}
                    className={`absolute ${xOffset} ${yOffset} -translate-x-1/2 -translate-y-1/2 z-10 p-1 flex flex-col items-center group`}
                  >
                    <div className={`p-2 rounded-full shadow-lg transition-all duration-300 ${
                      isSelected 
                        ? 'bg-indigo-600 text-white scale-110 ring-4 ring-indigo-500/25' 
                        : 'bg-slate-900 border border-slate-700 text-indigo-400 hover:scale-105'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    {/* Tiny tooltip label */}
                    <span className="mt-1 bg-slate-950/90 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-800/80 text-slate-300 block whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
                      {gym.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}

              {/* Simulated current user position */}
              <div className="absolute left-[20%] top-[60%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <div className="w-3.5 h-3.5 bg-sky-500 rounded-full border-2 border-white shadow-md animate-pulse shadow-sky-500/50" />
                <span className="mt-1 bg-slate-950/90 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-850 text-sky-400 uppercase tracking-wider">You</span>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 rounded-lg p-1.5 flex flex-col gap-1 z-20 shadow-md">
              <button 
                onClick={() => setMapZoom(z => Math.min(18, z + 1))}
                className="w-7 h-7 flex items-center justify-center bg-slate-950 hover:bg-slate-800 text-slate-300 rounded font-bold font-mono text-sm"
              >
                +
              </button>
              <button 
                onClick={() => setMapZoom(z => Math.max(10, z - 1))}
                className="w-7 h-7 flex items-center justify-center bg-slate-950 hover:bg-slate-800 text-slate-300 rounded font-bold font-mono text-sm"
              >
                -
              </button>
            </div>

            {/* Quick Map info banner */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-850 px-2.5 py-1 rounded-lg text-[9px] font-mono text-slate-400 z-20">
              NYC Sandbox Grid: Zoom {mapZoom}x
            </div>
          </div>

          {/* Selected Gym Specs Panel */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-5">
            <div className="flex justify-between items-start pb-3 border-b border-slate-800/60">
              <div>
                <h3 className="text-base font-bold text-white font-display">{selectedGym.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedGym.address}</p>
              </div>
              <button
                id="toggle-selected-gym-fav"
                onClick={() => toggleFavoriteGym(selectedGym.id)}
                className={`p-2 rounded-xl bg-slate-950 border border-slate-850 transition-colors ${
                  isFav ? 'text-rose-500 hover:text-rose-400' : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Facilities List tags */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-indigo-400 font-mono uppercase tracking-wider">Premium Facilities Onsite</label>
              <div className="flex flex-wrap gap-2">
                {selectedGym.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{fac}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Affiliate onsite trainers */}
            <div className="space-y-2.5 pt-2">
              <label className="text-[10px] font-bold text-indigo-400 font-mono uppercase tracking-wider block">Affiliated Onsite Coaches</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getGymTrainers(selectedGym.id).map((coach) => (
                  <div
                    key={coach.id}
                    id={`onsite-coach-${coach.id}`}
                    onClick={() => setActiveTab('trainers')}
                    className="p-3 bg-slate-950/40 border border-slate-850 hover:border-slate-800 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <img src={coach.avatar} alt={coach.name} className="w-8 h-8 rounded-lg object-cover border border-slate-800" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{coach.name}</h4>
                        <p className="text-[10px] text-slate-500">{coach.specialty}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
