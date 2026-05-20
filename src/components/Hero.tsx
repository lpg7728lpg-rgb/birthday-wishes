"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Clock, Gift, Heart, ArrowDown } from "lucide-react";

interface HeroProps {
  sisterName?: string;
  birthdayDate?: string;
  heroHeading?: string;
  heroSubtitle?: string;
  heroMedia?: string;
  onOpenMemories: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  sisterName = "Ananya",
  birthdayDate = "2026-06-18T00:00:00.000Z",
  heroHeading = "Happy Birthday To My Amazing Sister",
  heroSubtitle = "You are the warmth of my life, the keeper of my secrets, and my best friend forever.",
  heroMedia = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070",
  onOpenMemories,
}) => {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isPast: false
  });

  // Calculate Countdown Timer
  useEffect(() => {
    const target = new Date(birthdayDate);

    const updateTimer = () => {
      const now = new Date();
      let diff = target.getTime() - now.getTime();
      let isPast = false;

      if (diff <= 0) {
        // If birthday has passed, count time since it started
        diff = Math.abs(diff);
        isPast = true;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: d.toString().padStart(2, "0"),
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
        isPast
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [birthdayDate]);

  // Blow out candles function
  const handleBlowCandles = () => {
    if (candlesBlown) return;
    setIsBlowing(true);

    setTimeout(() => {
      setCandlesBlown(true);
      setIsBlowing(false);

      // Trigger Confetti Burst
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#B76E79", "#D4AF37", "#F8C3CD", "#FFF0F0"]
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#B76E79", "#D4AF37", "#F8C3CD", "#FFF0F0"]
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }, 800);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      {/* Premium Parallax Layer / Blurr gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#F8C3CD]/25 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#E6E6FA]/30 blur-[150px]"></div>
        <div className="absolute top-1/2 left-1/3 w-[30%] h-[30%] rounded-full bg-[#FFDAB9]/20 blur-[120px]"></div>
      </div>

      {/* Decorative Shimmering Stars background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-28 left-[10%] w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-[pulse_2s_infinite]"></div>
        <div className="absolute top-1/3 right-[15%] w-2 h-2 rounded-full bg-[#B76E79] animate-[pulse_3s_infinite_1s]"></div>
        <div className="absolute bottom-[20%] left-[25%] w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-[pulse_2.5s_infinite_0.5s]"></div>
        <div className="absolute bottom-[35%] right-[8%] w-1 h-1 rounded-full bg-white animate-[pulse_2s_infinite_1.5s]"></div>
      </div>

      {/* Main Grid Content */}
      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Heading, Typewriter reveal & Countdown */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <span className="text-xs md:text-sm font-semibold tracking-widest text-[#B76E79] uppercase font-sans mb-3 flex items-center gap-1.5">
            <Heart size={14} className="fill-[#B76E79]" /> Celebrating An Unforgettable Soul
          </span>

          {/* Animated Name Reveal */}
          <h1 className="font-serif-luxury text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-[#3D0C11] mb-4">
            {heroHeading.replace("Sister", "")}
            <span className="block font-cursive text-[#B76E79] text-5xl md:text-6xl lg:text-7xl font-normal drop-shadow-sm mt-1 animate-pulse">
              {sisterName}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-slate-600 font-light font-sans max-w-xl leading-relaxed mb-10">
            {heroSubtitle}
          </p>

          {/* Countdown Clock Frame */}
          <div className="w-full max-w-md bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-lg mb-8 rose-gold-glow-hover">
            <div className="flex items-center gap-2 mb-4 border-b border-[#B76E79]/15 pb-2">
              <Clock size={16} className="text-[#B76E79]" />
              <span className="text-[10px] md:text-xs tracking-widest font-semibold text-slate-500 uppercase font-sans">
                {timeLeft.isPast ? "Time Elapsed Since Her Birthday" : "Countdown to the Magic Moment"}
              </span>
            </div>
            
            {/* Countdown Row */}
            <div className="grid grid-cols-4 gap-3 text-center">
              {Object.entries({
                Days: timeLeft.days,
                Hours: timeLeft.hours,
                Mins: timeLeft.minutes,
                Secs: timeLeft.seconds
              }).map(([label, val]) => (
                <div key={label} className="bg-white/75 rounded-2xl p-2.5 border border-white/90 shadow-sm">
                  <span className="block font-serif-luxury text-xl md:text-2xl lg:text-3xl font-medium text-[#3D0C11] tabular-nums">
                    {val}
                  </span>
                  <span className="text-[9px] tracking-wider font-light text-slate-400 uppercase font-sans">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Open Memories Scroll trigger */}
          <button
            onClick={onOpenMemories}
            className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B76E79]/90 to-[#B76E79] hover:from-[#B76E79] hover:to-[#B76E79]/80 text-[#FAF5F5] text-xs font-semibold tracking-widest uppercase hover:scale-105 transition-all duration-500 shadow-md shadow-[#B76E79]/20 hover:shadow-lg hover:shadow-[#B76E79]/30 flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Open Memories Scrapbook</span>
            <ArrowDown size={14} className="text-white animate-bounce group-hover:animate-none" />
          </button>
        </div>

        {/* Right Column: Premium SVG Birthday Cake Interactive */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-80 h-96 flex flex-col items-center justify-center bg-white/45 backdrop-blur-md rounded-[40px] p-6 border border-white/60 shadow-2xl rose-gold-glow-hover transition-all duration-500">
            
            {/* Make a Wish Indicator Banner */}
            <div className="absolute top-6 px-4 py-1.5 rounded-full glassmorphism border border-white flex items-center gap-1.5 animate-bounce shadow-sm">
              <Gift size={14} className="text-[#B76E79]" />
              <span className="text-[9px] md:text-[10px] tracking-widest uppercase font-semibold text-[#B76E79] font-sans">
                {candlesBlown ? "Wish Granted! ❤️" : "Blow the Candles!"}
              </span>
            </div>

            {/* SVG Interactive Cake */}
            <div className="w-full flex justify-center items-end h-60 mb-6 select-none relative">
              
              {/* Sky Lantern SVG instances rising when candles blown */}
              {candlesBlown && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                  <div className="absolute bottom-24 left-1/4 w-3.5 h-5 rounded-full bg-orange-400 opacity-60 blur-xs animate-[float_4s_ease-in_forwards] shadow-[0_0_15px_#fb923c]"></div>
                  <div className="absolute bottom-28 right-1/4 w-2.5 h-4 rounded-full bg-orange-400 opacity-60 blur-xs animate-[float_5s_ease-in_forwards_0.7s] shadow-[0_0_15px_#fb923c]"></div>
                </div>
              )}

              <svg 
                viewBox="0 0 200 220" 
                className="w-48 h-56 cursor-pointer drop-shadow-2xl"
                onClick={handleBlowCandles}
              >
                {/* Cake Stand */}
                <path d="M 30,195 L 170,195 Q 180,195 180,200 Q 180,205 170,205 L 30,205 Q 20,205 20,200 Q 20,195 30,195 Z" fill="#D4AF37" opacity="0.8" />
                <path d="M 70,205 L 130,205 L 140,215 L 60,215 Z" fill="#b08d24" opacity="0.8" />

                {/* Bottom Cake Layer */}
                <rect x="35" y="130" width="130" height="65" rx="10" ry="10" fill="#FFF0F0" />
                {/* Strawberry sauce drips */}
                <path d="M 35,145 Q 40,155 45,145 Q 50,138 55,147 Q 60,158 68,145 Q 75,135 80,148 Q 85,158 92,145 Q 100,135 105,148 Q 110,158 118,145 Q 125,135 130,148 Q 135,158 142,145 Q 150,135 155,148 Q 160,158 165,145 Z" fill="#B76E79" />
                {/* Bottom Frosting trim */}
                <path d="M 35,190 Q 40,185 45,190 Q 50,185 55,190 Q 60,185 65,190 Q 70,185 75,190 Q 80,185 85,190 Q 90,185 95,190 Q 100,185 105,190 Q 110,185 115,190 Q 120,185 125,190 Q 130,185 135,190 Q 140,185 145,190 Q 150,185 155,190 Q 160,185 165,190" stroke="#FFF" strokeWidth="4" fill="none" strokeLinecap="round" />

                {/* Top Cake Layer */}
                <rect x="50" y="80" width="100" height="50" rx="8" ry="8" fill="#F8C3CD" />
                {/* Cream drips */}
                <path d="M 50,90 Q 55,98 60,90 Q 65,85 70,92 Q 75,100 80,90 Q 85,85 90,92 Q 95,100 100,90 Q 105,85 110,92 Q 115,100 120,90 Q 125,85 130,92 Q 135,100 140,90 Q 145,85 150,90 Z" fill="#FFF0F0" />
                {/* White stars cream decorations */}
                <circle cx="65" cy="115" r="3" fill="#D4AF37" />
                <circle cx="85" cy="108" r="3" fill="#FFF" />
                <circle cx="105" cy="112" r="3" fill="#B76E79" />
                <circle cx="125" cy="106" r="3" fill="#FFF" />
                <circle cx="138" cy="114" r="3" fill="#D4AF37" />

                {/* Candles */}
                {/* Candle 1 (Left) */}
                <rect x="75" y="45" width="6" height="35" rx="2" fill="#D4AF37" />
                {/* Flame 1 */}
                {!candlesBlown && (
                  <path 
                    d="M 78,25 Q 73,38 78,43 Q 83,38 78,25 Z" 
                    fill="#fb923c" 
                    className="animate-pulse shadow-sm"
                    style={{ transformOrigin: "78px 43px", animation: "heartbeat 1.5s infinite" }} 
                  />
                )}

                {/* Candle 2 (Middle) */}
                <rect x="97" y="40" width="6" height="40" rx="2" fill="#B76E79" />
                {/* Flame 2 */}
                {!candlesBlown && (
                  <path 
                    d="M 100,18 Q 95,33 100,38 Q 105,33 100,18 Z" 
                    fill="#fb923c" 
                    className="animate-pulse"
                    style={{ transformOrigin: "100px 38px", animation: "heartbeat 1.3s infinite 0.2s" }}
                  />
                )}

                {/* Candle 3 (Right) */}
                <rect x="119" y="45" width="6" height="35" rx="2" fill="#D4AF37" />
                {/* Flame 3 */}
                {!candlesBlown && (
                  <path 
                    d="M 122,25 Q 117,38 122,43 Q 127,38 122,25 Z" 
                    fill="#fb923c" 
                    className="animate-pulse"
                    style={{ transformOrigin: "122px 43px", animation: "heartbeat 1.6s infinite 0.4s" }}
                  />
                )}
              </svg>

              {/* Smoke when blown */}
              {isBlowing && (
                <div className="absolute top-10 flex gap-6 z-10 pointer-events-none opacity-80">
                  <div className="w-1.5 h-6 bg-slate-200/40 blur-xs rounded-full animate-[float_1.5s_infinite]"></div>
                  <div className="w-1.5 h-8 bg-slate-200/40 blur-xs rounded-full animate-[float_1.2s_infinite_0.2s]"></div>
                  <div className="w-1.5 h-6 bg-slate-200/40 blur-xs rounded-full animate-[float_1.4s_infinite_0.4s]"></div>
                </div>
              )}
            </div>

            {/* Interactivity Button */}
            <button
              onClick={handleBlowCandles}
              disabled={candlesBlown || isBlowing}
              className={`w-full py-2.5 px-4 rounded-2xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow flex items-center justify-center gap-2 cursor-pointer ${
                candlesBlown 
                  ? "bg-slate-100 text-slate-400 border border-slate-200 shadow-none cursor-default"
                  : isBlowing 
                  ? "bg-[#B76E79]/50 text-white animate-pulse"
                  : "bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white hover:opacity-90 active:scale-97"
              }`}
            >
              <span>
                {candlesBlown 
                  ? "Birthday Wishes Released!" 
                  : isBlowing 
                  ? "Blowing out..." 
                  : "Make a Wish & Blow!"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
