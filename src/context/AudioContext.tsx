"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface Track {
  id: string;
  name: string;
  artist: string;
  url: string;
  isDefault?: boolean;
}

interface AudioContextType {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  userInteraction: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  playTrack: (track: Track) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolumeLevel: (level: number) => void;
  toggleMute: () => void;
  setUserInteraction: (interacted: boolean) => void;
  refreshPlaylist: (newTracks: Track[]) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [userInteraction, setUserInteractionState] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load tracks from db.json
  const fetchTracks = async () => {
    try {
      const res = await fetch("/api/db");
      const data = await res.json();
      if (data && data.music) {
        setTracks(data.music);
        const defaultTrack = data.music.find((t: Track) => t.isDefault) || data.music[0];
        if (defaultTrack) {
          setCurrentTrack(defaultTrack);
        }
      }
    } catch (err) {
      console.error("Failed to load music playlist:", err);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  // Initialize Audio Element
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume;

      const audio = audioRef.current;

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration || 0);

      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("durationchange", handleDurationChange);

      return () => {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("durationchange", handleDurationChange);
        audio.pause();
      };
    }
  }, []);

  // Sync volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle Track Source Change
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      
      if (wasPlaying && userInteraction) {
        fadeInPlay();
      }
    }
  }, [currentTrack]);

  // Helper to fade in the audio smoothly
  const fadeInPlay = () => {
    if (!audioRef.current) return;
    
    // Reset volume to 0 before starting play
    const targetVolume = isMuted ? 0 : volume;
    audioRef.current.volume = 0;
    
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        let currentVol = 0;
        
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        
        fadeIntervalRef.current = setInterval(() => {
          if (!audioRef.current) return;
          currentVol += 0.05;
          if (currentVol >= targetVolume) {
            audioRef.current.volume = targetVolume;
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          } else {
            audioRef.current.volume = currentVol;
          }
        }, 50);
      })
      .catch((err) => {
        console.warn("Autoplay block or audio load error:", err);
        setIsPlaying(false);
      });
  };

  // Helper to fade out and then pause
  const fadeOutPause = () => {
    if (!audioRef.current || !isPlaying) return;

    let currentVol = audioRef.current.volume;
    
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) return;
      currentVol -= 0.05;
      if (currentVol <= 0) {
        audioRef.current.volume = 0;
        audioRef.current.pause();
        setIsPlaying(false);
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      } else {
        audioRef.current.volume = currentVol;
      }
    }, 30);
  };

  const play = () => {
    if (audioRef.current && userInteraction) {
      fadeInPlay();
    }
  };

  const pause = () => {
    fadeOutPause();
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    if (!userInteraction) {
      setUserInteractionState(true);
    }
    // Force immediate play
    setTimeout(() => {
      if (audioRef.current) {
        fadeInPlay();
      }
    }, 100);
  };

  const nextTrack = () => {
    if (tracks.length === 0 || !currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  const prevTrack = () => {
    if (tracks.length === 0 || !currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIndex]);
  };

  const setVolumeLevel = (level: number) => {
    const clamped = Math.max(0, Math.min(1, level));
    setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const setUserInteraction = (interacted: boolean) => {
    setUserInteractionState(interacted);
    if (interacted && audioRef.current && !isPlaying) {
      fadeInPlay();
    }
  };

  const refreshPlaylist = (newTracks: Track[]) => {
    setTracks(newTracks);
    // Sync current track
    if (currentTrack) {
      const updatedTrack = newTracks.find((t) => t.id === currentTrack.id);
      if (updatedTrack) {
        setCurrentTrack(updatedTrack);
      }
    }
  };

  return (
    <AudioContext.Provider
      value={{
        tracks,
        currentTrack,
        isPlaying,
        volume,
        isMuted,
        currentTime,
        duration,
        userInteraction,
        play,
        pause,
        togglePlay,
        playTrack,
        nextTrack,
        prevTrack,
        setVolumeLevel,
        toggleMute,
        setUserInteraction,
        refreshPlaylist,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
