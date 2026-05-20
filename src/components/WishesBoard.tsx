"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, Heart, Sparkles, Star, Gift, SendHorizontal } from "lucide-react";
import confetti from "canvas-confetti";

export interface WishEntry {
  id: string;
  name: string;
  content: string;
  timestamp: string;
  icon: string;
  color: string;
}

interface WishesBoardProps {
  wishes: WishEntry[];
  isAdmin: boolean;
  onUpdate: (updatedWishes: WishEntry[]) => void;
  onAddWish: (newWish: WishEntry) => void;
}

export const WishesBoard: React.FC<WishesBoardProps> = ({ wishes, isAdmin, onUpdate, onAddWish }) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("heart");
  const [selectedColor, setSelectedColor] = useState("rose-gold");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger luxury confetti firework explosion
  const triggerFireworkConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Fireworks at different positions on screen
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const newWish: WishEntry = {
      id: `wish-${Date.now()}`,
      name: name.trim(),
      content: content.trim(),
      timestamp: new Date().toISOString(),
      icon: selectedIcon,
      color: selectedColor
    };

    try {
      // Trigger animations
      triggerFireworkConfetti();
      
      // Save
      await onAddWish(newWish);

      // Reset
      setName("");
      setContent("");
      setIsSubmitting(false);
    } catch (err) {
      console.error("Failed to add wish:", err);
      setIsSubmitting(false);
    }
  };

  const handleDeleteWish = (id: string) => {
    if (window.confirm("Remove this birthday wish permanently from the board?")) {
      const filtered = wishes.filter((w) => w.id !== id);
      onUpdate(filtered);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "heart":
        return <Heart size={16} className="fill-[#B76E79]" />;
      case "sparkles":
        return <Sparkles size={16} className="text-[#D4AF37]" />;
      case "star":
        return <Star size={16} className="fill-[#D4AF37] text-[#D4AF37]" />;
      case "gift":
        return <Gift size={16} className="text-[#B76E79]" />;
      default:
        return <Heart size={16} className="fill-[#B76E79]" />;
    }
  };

  const getColorClasses = (colorName: string) => {
    switch (colorName) {
      case "rose-gold":
        return "border-[#B76E79]/30 bg-gradient-to-br from-[#FFF5F6] to-[#FFF0F0] text-[#3D0C11] hover:shadow-[#B76E79]/15";
      case "gold":
        return "border-[#D4AF37]/30 bg-gradient-to-br from-[#FFFDF5] to-[#FFF9E6] text-[#3D0C11] hover:shadow-[#D4AF37]/15";
      case "lavender":
        return "border-[#967BB6]/30 bg-gradient-to-br from-[#F9F7FC] to-[#F1EEF8] text-[#300C3D] hover:shadow-[#967BB6]/15";
      default:
        return "border-[#B76E79]/30 bg-gradient-to-br from-[#FFF5F6] to-[#FFF0F0] text-[#3D0C11]";
    }
  };

  return (
    <section id="wishes-section" className="relative w-full max-w-5xl mx-auto py-24 px-6 z-10 overflow-hidden">
      {/* Decorative Sky Lanterns Rising */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden opacity-50">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-t from-[#D4AF37] to-[#B76E79] blur-[2px] opacity-20 rounded-full"
            style={{
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 30 + 15}px`,
              bottom: "-50px",
              left: `${Math.random() * 90 + 5}%`,
              animation: `floatLantern ${Math.random() * 15 + 15}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              boxShadow: "0 0 20px rgba(212, 175, 55, 0.8), 0 0 40px rgba(183, 110, 121, 0.4)"
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes floatLantern {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-110vh) rotate(${Math.random() * 40 - 20}deg) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-widest font-semibold text-[#B76E79] uppercase font-sans mb-3 block">
          Sky Lantern Wishes
        </span>
        <h2 className="font-serif-luxury text-4xl md:text-5xl font-light text-[#3D0C11] mb-4">
          The Wishes Board
        </h2>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B76E79] to-transparent mx-auto mb-5"></div>
        <p className="text-xs md:text-sm font-light text-slate-500 max-w-md mx-auto leading-relaxed">
          Send a warm blessing to Ananya. Your wish will float like a glowing sky lantern and be permanently preserved forever.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* WISH FORM CARD (Left) */}
        <div className="lg:col-span-5 bg-white/50 backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-3xl shadow-xl w-full">
          <h3 className="font-serif-luxury text-xl text-[#3D0C11] mb-6 text-left flex items-center gap-2">
            <Sparkles size={18} className="text-[#D4AF37] animate-pulse" />
            Write Your Wish
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="text-[10px] tracking-wider text-slate-400 font-bold uppercase block mb-1.5">
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-[#B76E79] focus:bg-white bg-white/70 shadow-inner transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-wider text-slate-400 font-bold uppercase block mb-1.5">
                Your Message For Ananya
              </label>
              <textarea
                placeholder="Write something sweet, lovely, or emotional..."
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-[#B76E79] focus:bg-white bg-white/70 h-28 resize-none shadow-inner transition-all"
              />
            </div>

            {/* Custom Theme selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] tracking-wider text-slate-400 font-bold uppercase block mb-1.5">
                  Blessing Icon
                </label>
                <div className="flex gap-2">
                  {["heart", "sparkles", "star", "gift"].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setSelectedIcon(ic)}
                      className={`flex-1 p-2 rounded-lg border text-center flex items-center justify-center transition-all cursor-pointer ${
                        selectedIcon === ic
                          ? "bg-[#B76E79]/10 border-[#B76E79] scale-105"
                          : "bg-white/80 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      {renderIcon(ic)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[9px] tracking-wider text-slate-400 font-bold uppercase block mb-1.5">
                  Lantern Glow
                </label>
                <div className="flex gap-2">
                  {[
                    { name: "rose-gold", col: "bg-[#FFF0F0] border-[#B76E79]/40" },
                    { name: "gold", col: "bg-[#FFF9E6] border-[#D4AF37]/40" },
                    { name: "lavender", col: "bg-[#F1EEF8] border-[#967BB6]/40" }
                  ].map((colorObj) => (
                    <button
                      key={colorObj.name}
                      type="button"
                      onClick={() => setSelectedColor(colorObj.name)}
                      className={`flex-1 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${colorObj.col} ${
                        selectedColor === colorObj.name ? "ring-2 ring-[#B76E79] scale-105 shadow-sm" : "opacity-80"
                      }`}
                      title={colorObj.name}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-white border border-stone-300"></span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-4 bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white rounded-xl text-xs font-semibold tracking-widest uppercase hover:opacity-90 active:scale-98 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? "Sending Blessing..." : "Release Sky Lantern"}</span>
              <SendHorizontal size={14} />
            </button>
          </form>
        </div>

        {/* WISHES MASONRY BOARD DISPLAY (Right) */}
        <div className="lg:col-span-7 w-full flex flex-col justify-start">
          <div className="flex items-center justify-between mb-6 px-2">
            <h4 className="font-serif-luxury text-lg text-[#3D0C11] tracking-wide font-medium">
              Released Wishes ({wishes.length})
            </h4>
            <span className="text-[10px] tracking-wider font-light text-slate-400 font-sans uppercase">
              Scroll to explore
            </span>
          </div>

          {/* List Wrapper */}
          <div className="max-h-[480px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            <AnimatePresence initial={false}>
              {wishes.map((wish) => {
                const colorClass = getColorClasses(wish.color);
                
                return (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`border p-5 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md relative group flex flex-col select-text ${colorClass}`}
                  >
                    {/* Floating top right detail */}
                    <div className="absolute top-4 right-4 flex gap-1.5 items-center">
                      <div className="bg-white/80 rounded-full p-1 border border-stone-100 shadow-xs flex items-center justify-center">
                        {renderIcon(wish.icon)}
                      </div>
                      
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteWish(wish.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full p-1 border border-red-100 shadow-xs transition-colors cursor-pointer"
                          title="Delete Wish"
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>

                    {/* Sender Name */}
                    <div className="text-left font-serif-luxury text-base font-semibold mb-2">
                      {wish.name}
                    </div>

                    {/* Body wish quote */}
                    <p className="text-left text-xs font-light font-sans leading-relaxed text-slate-600/90 whitespace-pre-wrap select-text pr-6">
                      "{wish.content}"
                    </p>

                    {/* Timestamp */}
                    <div className="text-left text-[8px] text-slate-400 font-medium tracking-wider uppercase font-mono mt-4">
                      Released: {new Date(wish.timestamp).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
