"use client";

import React, { useState, useEffect } from "react";
import { useAudio } from "@/context/AudioContext";
import { Sparkles, Volume2 } from "lucide-react";

interface IntroScreenProps {
  onEnter: () => void;
  introText?: string;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter, introText = "To The Most Beautiful Sister ❤️" }) => {
  const { setUserInteraction } = useAudio();
  const [isMounted, setIsMounted] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulated loading indicator
  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 8;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const handleEnterClick = () => {
    setIsLeaving(true);
    // Play background music
    setUserInteraction(true);
    
    // Fire callback after cinematic transition ends (800ms)
    setTimeout(() => {
      onEnter();
    }, 850);
  };

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#1e1416] text-[#FAF5F5] select-none transition-all duration-1000 ease-out-quint ${
        isLeaving ? "scale-[1.15] opacity-0 pointer-events-none" : "scale-100 opacity-100"
      }`}
    >
      {/* Dynamic slow ambient glowing backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#B76E79]/15 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-[120px] animate-pulse"></div>
      </div>

      {/* Luxury gold floating ambient particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-12 left-1/3 w-1.5 h-1.5 rounded-full bg-[#D4AF37] blur-xs animate-[float_8s_infinite]"></div>
        <div className="absolute bottom-24 right-1/3 w-2.5 h-2.5 rounded-full bg-[#B76E79] blur-xs animate-[float_6s_infinite_1.5s]"></div>
        <div className="absolute top-1/2 right-12 w-2 h-2 rounded-full bg-[#D4AF37] blur-xs animate-[float_9s_infinite_0.5s]"></div>
        <div className="absolute bottom-1/2 left-16 w-1 h-1 rounded-full bg-white blur-none animate-[float_7s_infinite_2.5s]"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-lg px-6 text-center flex flex-col items-center">
        {/* Shimmering Gold Icon */}
        <div className="mb-8 w-16 h-16 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#D4AF37] flex items-center justify-center shadow-[0_0_30px_rgba(183,110,121,0.3)] animate-pulse">
          <Sparkles size={26} className="text-[#FAF5F5] animate-[spin-slow_15s_linear_infinite]" />
        </div>

        {/* Cinematic Title Reveal */}
        <h1 
          className="font-serif-luxury text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#FAF5F5] via-[#FFF0F0] to-[#F8C3CD] mb-6 drop-shadow-xl select-none"
        >
          {introText.split(" ").map((word, wIdx) => {
            const hasHeart = word.includes("❤️");
            if (hasHeart) {
              return (
                <span key={wIdx} className="inline-block whitespace-nowrap">
                  {word.replace("❤️", "")}
                  <span className="inline-block text-red-500 animate-[heartbeat_1.5s_infinite] drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] ml-1">❤️</span>{" "}
                </span>
              );
            }
            return <span key={wIdx} className="inline-block mr-2">{word}</span>;
          })}
        </h1>

        {/* Cinematic subtitle */}
        <p className="text-xs md:text-sm font-light tracking-widest text-[#FAF5F5]/60 uppercase font-sans mb-12 max-w-sm">
          An Interactive Journey of Shared Memories & Love
        </p>

        {/* Simulated Loading or Enter button */}
        <div className="h-16 flex items-center justify-center">
          {progress < 100 ? (
            <div className="w-48 flex flex-col items-center gap-2">
              {/* Luxury loading bar */}
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#B76E79] to-[#D4AF37] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-[10px] tracking-widest uppercase font-sans text-white/40">
                Loading Memories ({Math.round(progress)}%)
              </span>
            </div>
          ) : (
            <button
              onClick={handleEnterClick}
              className="group px-8 py-3 rounded-full bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-slate-950 text-xs md:text-sm font-semibold tracking-widest uppercase hover:scale-105 transition-all duration-500 shadow-[0_0_35px_rgba(212,175,55,0.4)] cursor-pointer hover:shadow-[0_0_45px_rgba(183,110,121,0.6)] flex items-center gap-2.5 active:scale-95"
            >
              <span>Enter Experience</span>
              <Volume2 size={16} className="text-slate-950 animate-bounce group-hover:animate-none" />
            </button>
          )}
        </div>

        {/* Ambient Soundtrack disclaimer */}
        <div className="absolute bottom-[-150px] flex flex-col items-center gap-1.5 opacity-40 select-none">
          <p className="text-[10px] tracking-widest font-light text-[#FAF5F5]/80 uppercase">
            🎵 Soundtrack Autoplay Active
          </p>
          <p className="text-[9px] text-[#FAF5F5]/60 font-sans italic max-w-xs">
            Turn up your speakers or headphones for beautiful background piano & instrumental melodies.
          </p>
        </div>
      </div>
    </div>
  );
};
