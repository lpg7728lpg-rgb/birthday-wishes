"use client";

import React, { useState } from "react";
import { useAudio } from "@/context/AudioContext";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ListMusic, Music, X } from "lucide-react";

export const MusicPlayer: React.FC = () => {
  const {
    tracks,
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    togglePlay,
    playTrack,
    nextTrack,
    prevTrack,
    setVolumeLevel,
    toggleMute,
    userInteraction
  } = useAudio();

  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // If the user has not interacted (clicked Enter on intro screen), hide the floating player
  if (!userInteraction || !currentTrack) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Playlist Drawer */}
      {showPlaylist && (
        <div className="mb-3 w-80 glassmorphism-dark text-[#FAF5F5] rounded-2xl p-4 shadow-2xl animate-fade-in border border-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <ListMusic size={18} className="text-[#D4AF37]" />
              <span className="font-serif-luxury font-medium tracking-wide">Soundtrack Playlist</span>
            </div>
            <button 
              onClick={() => setShowPlaylist(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
            {tracks.map((track) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-all ${
                  currentTrack.id === track.id
                    ? "bg-[#B76E79]/30 text-[#D4AF37] border border-[#B76E79]/50 font-medium"
                    : "hover:bg-white/5 text-white/80"
                }`}
              >
                <div className="truncate flex items-center gap-2">
                  <Music size={12} className={currentTrack.id === track.id ? "text-[#D4AF37]" : "text-white/40"} />
                  <div className="truncate">
                    <p className="truncate font-sans">{track.name}</p>
                    <p className="truncate text-[10px] text-white/50">{track.artist}</p>
                  </div>
                </div>
                {currentTrack.id === track.id && isPlaying && (
                  <div className="flex gap-0.5 items-end h-3">
                    <span className="w-0.5 h-2.5 bg-[#D4AF37] animate-[pulse_1s_infinite_0.1s]"></span>
                    <span className="w-0.5 h-1.5 bg-[#D4AF37] animate-[pulse_1s_infinite_0.3s]"></span>
                    <span className="w-0.5 h-2 bg-[#D4AF37] animate-[pulse_1s_infinite_0.5s]"></span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Music Player Card */}
      <div 
        className={`flex items-center gap-4 p-3 rounded-full transition-all duration-500 shadow-2xl glassmorphism border border-white/50 ${
          isOpen ? "w-80 pr-5" : "w-16 h-16 justify-center"
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => {
          if (!showPlaylist) setIsOpen(false);
        }}
      >
        {/* Rotating Vinyl Record / Play Toggle button */}
        <button
          onClick={togglePlay}
          className="relative w-10 h-10 flex-shrink-0 cursor-pointer focus:outline-none"
        >
          {/* Vinyl Disc */}
          <div 
            className={`w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-slate-800 shadow-lg ${
              isPlaying ? "animate-spin-slow" : ""
            }`}
          >
            {/* Center Label */}
            <div className="w-3 h-3 rounded-full bg-[#B76E79] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white"></div>
            </div>
            {/* Groove lines */}
            <div className="absolute inset-1 rounded-full border border-white/5 pointer-events-none"></div>
            <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none"></div>
          </div>
          
          {/* Tone Arm / Needle (visual only, drops onto vinyl when playing) */}
          <div 
            className={`absolute -top-1 -right-1 w-4 h-6 border-l-2 border-t-2 border-[#D4AF37] origin-top-right transition-transform duration-700 pointer-events-none ${
              isPlaying ? "rotate-[20deg]" : "rotate-0"
            }`}
          ></div>

          {/* Hover Play/Pause Overlay */}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity text-[#FAF5F5]">
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </div>
        </button>

        {/* Player Controls (Visible when expanded) */}
        {isOpen && (
          <div className="flex-grow min-w-0 flex flex-col justify-center animate-fade-in">
            {/* Song Info */}
            <div className="truncate mb-1 pr-2">
              <p className="text-xs font-serif-luxury font-medium text-[#3D0C11] truncate">{currentTrack.name}</p>
              <p className="text-[10px] text-slate-500 font-sans truncate">{currentTrack.artist}</p>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              {/* Skip Row */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={prevTrack} 
                  className="text-slate-600 hover:text-[#B76E79] transition-colors cursor-pointer"
                  title="Previous Track"
                >
                  <SkipBack size={14} />
                </button>
                <button 
                  onClick={togglePlay} 
                  className="w-6 h-6 rounded-full bg-[#B76E79] text-[#FAF5F5] flex items-center justify-center hover:bg-[#B76E79]/80 transition-colors shadow shadow-[#B76E79]/30 cursor-pointer"
                >
                  {isPlaying ? <Pause size={10} /> : <Play size={10} className="ml-0.5" />}
                </button>
                <button 
                  onClick={nextTrack} 
                  className="text-slate-600 hover:text-[#B76E79] transition-colors cursor-pointer"
                  title="Next Track"
                >
                  <SkipForward size={14} />
                </button>
              </div>

              {/* Volume Slider & Mute */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={toggleMute}
                  className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
                  className="w-14 h-1 bg-[#B76E79]/20 rounded-lg appearance-none cursor-pointer accent-[#B76E79]"
                />
              </div>

              {/* Playlist Toggle */}
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  showPlaylist 
                    ? "bg-[#B76E79]/10 text-[#B76E79]" 
                    : "text-slate-500 hover:text-[#B76E79]"
                }`}
                title="Playlist"
              >
                <ListMusic size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
