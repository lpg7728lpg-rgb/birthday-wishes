"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Sparkles, Heart, Check, Music } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

export interface LetterData {
  title: string;
  content: string;
  signOff: string;
  pianoMusicEnabled: boolean;
}

interface HeartfeltLetterProps {
  data: LetterData;
  isAdmin: boolean;
  onUpdate: (updatedData: LetterData) => void;
}

export const HeartfeltLetter: React.FC<HeartfeltLetterProps> = ({ data, isAdmin, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [typedContent, setTypedContent] = useState("");
  const { playTrack, tracks, userInteraction } = useAudio();

  // Handle opening envelope
  const handleOpenLetter = () => {
    setIsOpen(true);
    // Play emotional music if enabled and interaction is permitted
    if (data.pianoMusicEnabled && tracks.length > 0 && userInteraction) {
      // Find default or first track (which is usually the romantic piano)
      const pianoTrack = tracks.find(t => t.name.toLowerCase().includes("piano")) || tracks[0];
      if (pianoTrack) {
        playTrack(pianoTrack);
      }
    }
  };

  // Cursive typewriter writing reveal effect
  useEffect(() => {
    if (!isOpen || isEditing) return;
    
    let index = 0;
    const speed = 15; // writing speed in ms
    const originalText = data.content;
    setTypedContent("");

    const interval = setInterval(() => {
      setTypedContent((prev) => prev + originalText.charAt(index));
      index++;
      if (index >= originalText.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isOpen, isEditing, data.content]);

  // Handle local edits
  const handleFieldChange = (field: keyof LetterData, value: any) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  return (
    <section id="letter-section" className="relative w-full max-w-4xl mx-auto py-24 px-6 z-10 text-center">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#B76E79]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Title */}
      <div className="mb-16">
        <span className="text-[10px] tracking-widest font-semibold text-[#B76E79] uppercase font-sans mb-3 block">
          A Secret Keepsake
        </span>
        <h2 className="font-serif-luxury text-4xl md:text-5xl font-light text-[#3D0C11] mb-3">
          The Heartfelt Letter
        </h2>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B76E79] to-transparent mx-auto"></div>
      </div>

      {/* --- ENVELOPE INTERACTIVE FRAME --- */}
      <div className="relative min-h-[450px] w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* CLOSED 3D ENVELOPE */
            <motion.div
              key="envelope"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-lg aspect-[1.5/1] bg-gradient-to-br from-[#FCF9F5] to-[#EAE3DB] rounded-2xl shadow-[0_15px_35px_rgba(61,12,17,0.15)] border border-stone-200/80 p-8 flex flex-col justify-between items-center cursor-pointer group hover:shadow-[0_20px_45px_rgba(61,12,17,0.22)] transition-shadow duration-500"
              onClick={handleOpenLetter}
            >
              {/* Gold wax seal stamp design */}
              <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-14 h-14 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] rounded-full border-2 border-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                <Heart size={22} className="text-white fill-white animate-pulse" />
              </div>

              {/* Decorative Borders */}
              <div className="absolute inset-4 border border-dashed border-[#B76E79]/30 rounded-xl pointer-events-none"></div>

              {/* Envelope Text Content */}
              <div className="mt-8 text-center space-y-3">
                <h3 className="font-great-vibes text-4xl text-[#3D0C11] group-hover:scale-105 transition-transform duration-300">
                  {data.title}
                </h3>
                <div className="w-16 h-[0.5px] bg-[#B76E79]/50 mx-auto"></div>
                <p className="text-[10px] uppercase tracking-widest text-[#B76E79]/70 font-semibold font-sans">
                  Click to open envelope
                </p>
              </div>

              <div className="text-[10px] tracking-wider text-[#A58D8D] font-light uppercase font-mono italic">
                Strictly for Nita's eyes only ❤️
              </div>
            </motion.div>
          ) : (
            /* OPENED PAPER REVEAL */
            <motion.div
              key="letter-paper"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 60 }}
              className="w-full max-w-2xl bg-[#FCFAF7] border border-stone-200 shadow-[0_15px_45px_rgba(0,0,0,0.08)] rounded-2xl p-8 md:p-12 relative overflow-hidden select-text"
            >
              {/* Premium double rose gold layout line */}
              <div className="absolute inset-4 border border-[#B76E79]/20 rounded-xl pointer-events-none"></div>
              <div className="absolute inset-5 border-2 border-[#D4AF37]/10 rounded-lg pointer-events-none"></div>

              {/* Admin toggle overlay */}
              {isAdmin && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="absolute top-8 right-8 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  {isEditing ? (
                    <>
                      <Check size={12} /> Save Draft
                    </>
                  ) : (
                    <>
                      <Edit2 size={12} /> Edit Letter
                    </>
                  )}
                </button>
              )}

              {/* Sparkle decorative icons in corners */}
              <div className="absolute top-8 left-8 opacity-20 text-[#D4AF37]">
                <Sparkles size={20} />
              </div>
              <div className="absolute bottom-8 right-8 opacity-20 text-[#D4AF37]">
                <Sparkles size={20} />
              </div>

              {/* Letter Title */}
              {isEditing && isAdmin ? (
                <div className="mb-6 space-y-4 text-left px-4">
                  <div>
                    <label className="text-[8px] tracking-wider text-slate-400 font-bold uppercase">Letter Cover Title</label>
                    <input
                      type="text"
                      value={data.title}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      className="w-full p-2 text-xs rounded border border-stone-200 bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        checked={data.pianoMusicEnabled}
                        onChange={(e) => handleFieldChange("pianoMusicEnabled", e.target.checked)}
                        className="rounded accent-[#B76E79]"
                      />
                      <Music size={12} className="text-[#B76E79]" />
                      Trigger Romantic Cello / Piano Playback on Envelope Open
                    </label>
                  </div>
                </div>
              ) : (
                <h3 className="font-great-vibes text-4xl md:text-5xl text-[#3D0C11] mb-8 select-text">
                  {data.title}
                </h3>
              )}

              {/* Letter Main Content Body */}
              {isEditing && isAdmin ? (
                <div className="text-left px-4 mb-4">
                  <label className="text-[8px] tracking-wider text-slate-400 font-bold uppercase">Dearest Wishes Content</label>
                  <textarea
                    value={data.content}
                    onChange={(e) => handleFieldChange("content", e.target.value)}
                    className="w-full p-2 text-xs rounded border border-stone-200 bg-white h-64 font-mono"
                  />
                </div>
              ) : (
                <div className="font-serif text-[#4A3525] text-base md:text-lg font-light leading-relaxed text-left max-w-xl mx-auto whitespace-pre-wrap min-h-[220px] select-text">
                  {/* Typed typewriter reveal wrapper */}
                  {typedContent}
                  {typedContent.length < data.content.length && (
                    <span className="w-1.5 h-4 inline-block bg-[#B76E79] ml-0.5 animate-pulse"></span>
                  )}
                </div>
              )}

              {/* Sign Off */}
              {isEditing && isAdmin ? (
                <div className="text-left px-4">
                  <label className="text-[8px] tracking-wider text-slate-400 font-bold uppercase">Sign-Off signature</label>
                  <input
                    type="text"
                    value={data.signOff}
                    onChange={(e) => handleFieldChange("signOff", e.target.value)}
                    className="w-full p-2 text-xs rounded border border-stone-200 bg-white"
                  />
                </div>
              ) : (
                <div className="mt-10 text-right pr-6 max-w-xl mx-auto">
                  <div className="w-16 h-[0.5px] bg-[#B76E79]/30 ml-auto mb-4"></div>
                  <p className="font-great-vibes text-3xl text-[#3D0C11] select-text">
                    {data.signOff}
                  </p>
                </div>
              )}

              {/* Close Letter Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-12 px-6 py-2 border border-[#B76E79]/40 text-[#B76E79] rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#B76E79] hover:text-white transition-all cursor-pointer"
                >
                  Fold Letter Back
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
