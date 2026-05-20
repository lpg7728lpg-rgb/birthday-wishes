"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import { EffectsOverlay } from "@/components/EffectsOverlay";
import { IntroScreen } from "@/components/IntroScreen";
import { Hero } from "@/components/Hero";
import { Timeline, TimelineEntry } from "@/components/Timeline";
import { PhotoScrapbook, GalleryItem } from "@/components/PhotoScrapbook";
import { VideoMessages, VideoMessage } from "@/components/VideoMessages";
import { HeartfeltLetter, LetterData } from "@/components/HeartfeltLetter";
import { WishesBoard, WishEntry } from "@/components/WishesBoard";
import { MusicPlayer } from "@/components/MusicPlayer";
import { AdminDashboard, SystemConfig } from "@/components/AdminDashboard";
import { Sparkles, Heart } from "lucide-react";

export default function Home() {
  const { userInteraction } = useAudio();
  const [showMainSite, setShowMainSite] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Database core states
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoMessage[]>([]);
  const [wishes, setWishes] = useState<WishEntry[]>([]);

  const memoriesSectionRef = useRef<HTMLDivElement | null>(null);

  // Fetch all initial data from server database API
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/db");
      const data = await res.json();
      if (data) {
        setConfig(data.config);
        setTracks(data.music);
        setTimeline(data.timeline || []);
        setGallery(data.gallery || []);
        setVideos(data.videos || []);
        setWishes(data.wishes || []);
      }
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to load initial website database content:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Save changes to backend disk permanently
  const saveDatabaseChanges = async (updatedFields: any) => {
    try {
      const res = await fetch("/api/db");
      const currentDb = await res.json();
      
      const mergedDb = {
        ...currentDb,
        ...updatedFields
      };

      const saveRes = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedDb)
      });
      
      if (!saveRes.ok) {
        throw new Error("Failed to write database updates to server.");
      }
    } catch (err) {
      console.error("Failed to save changes:", err);
      alert("Encountered error saving changes permanently to the server. Please verify configuration.");
    }
  };

  // Updaters triggered from in-page CMS toggles
  const handleUpdateTimeline = async (updatedTimeline: TimelineEntry[]) => {
    setTimeline(updatedTimeline);
    await saveDatabaseChanges({ timeline: updatedTimeline });
  };

  const handleUpdateGallery = async (updatedGallery: GalleryItem[]) => {
    setGallery(updatedGallery);
    await saveDatabaseChanges({ gallery: updatedGallery });
  };

  const handleUpdateVideos = async (updatedVideos: VideoMessage[]) => {
    setVideos(updatedVideos);
    await saveDatabaseChanges({ videos: updatedVideos });
  };

  const handleUpdateLetter = async (updatedLetter: LetterData) => {
    if (!config) return;
    // Update local config
    const updatedLetterObject = { ...updatedLetter };
    await saveDatabaseChanges({ letter: updatedLetterObject });
  };

  const handleUpdateWishes = async (updatedWishes: WishEntry[]) => {
    setWishes(updatedWishes);
    await saveDatabaseChanges({ wishes: updatedWishes });
  };

  const handleAddWish = async (newWish: WishEntry) => {
    const updatedWishes = [newWish, ...wishes];
    setWishes(updatedWishes);
    await saveDatabaseChanges({ wishes: updatedWishes });
  };

  const handleSaveConfig = async (newConfig: SystemConfig, newTracks: any[]) => {
    setConfig(newConfig);
    setTracks(newTracks);
    await saveDatabaseChanges({ config: newConfig, music: newTracks });
  };

  // Smooth scroll helper
  const scrollToMemories = () => {
    if (memoriesSectionRef.current) {
      memoriesSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading || !config) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#1e1416] text-white">
        <div className="w-12 h-12 rounded-full border-4 border-[#B76E79]/30 border-t-[#B76E79] animate-spin mb-4"></div>
        <p className="text-xs uppercase tracking-widest text-[#B76E79]/80 font-semibold font-sans">
          Opening Memory Vault...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FCFAF7] selection:bg-[#B76E79]/20 selection:text-[#B76E79]">
      
      {/* 1. CANVAS FLOATING GRAPHICS LAYER */}
      <EffectsOverlay />

      {/* 2. CINEMATIC ENTER VAULT INTRO */}
      {!showMainSite && (
        <IntroScreen 
          onEnter={() => setShowMainSite(true)} 
          introText={config.introText} 
        />
      )}

      {/* 3. MAIN INTERACTIVE CONTENT */}
      {showMainSite && (
        <div className="relative w-full flex flex-col min-h-screen">
          
          {/* Main Hero Parallax section */}
          <Hero
            sisterName={config.sisterName}
            birthdayDate={config.birthdayDate}
            heroHeading={config.heroHeading}
            heroSubtitle={config.heroSubtitle}
            heroMedia={config.heroMedia}
            onOpenMemories={scrollToMemories}
          />

          {/* Spacer Section Ribbon */}
          <div className="w-full h-12 bg-gradient-to-r from-transparent via-[#B76E79]/15 to-transparent my-10 flex items-center justify-center">
            <Heart size={16} className="text-[#B76E79] animate-pulse" />
          </div>

          {/* Interactive Magazine Memory Timeline Container */}
          <div ref={memoriesSectionRef} className="scroll-mt-12 bg-white/30">
            <Timeline
              entries={timeline}
              isAdmin={isAdmin}
              onUpdate={handleUpdateTimeline}
            />
          </div>

          {/* Decorative Divider */}
          <div className="w-full py-10 flex justify-center items-center gap-1.5 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]"></span>
            <span className="w-8 h-[0.5px] bg-[#B76E79]/40"></span>
            <Sparkles size={12} className="text-[#D4AF37]" />
            <span className="w-8 h-[0.5px] bg-[#B76E79]/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]"></span>
          </div>

          {/* Polaroid Scrapbook Gallery Container */}
          <div className="bg-[#FAF7F2]/40">
            <PhotoScrapbook
              items={gallery}
              isAdmin={isAdmin}
              onUpdate={handleUpdateGallery}
            />
          </div>

          {/* Decorative Divider */}
          <div className="w-full py-10 flex justify-center items-center gap-1.5 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]"></span>
            <span className="w-8 h-[0.5px] bg-[#B76E79]/40"></span>
            <Sparkles size={12} className="text-[#D4AF37]" />
            <span className="w-8 h-[0.5px] bg-[#B76E79]/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]"></span>
          </div>

          {/* Unforgettable Video Tributes Carousel Container */}
          <div className="bg-white/30">
            <VideoMessages
              videos={videos}
              isAdmin={isAdmin}
              onUpdate={handleUpdateVideos}
            />
          </div>

          {/* Decorative Divider */}
          <div className="w-full py-10 flex justify-center items-center gap-1.5 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]"></span>
            <span className="w-8 h-[0.5px] bg-[#B76E79]/40"></span>
            <Sparkles size={12} className="text-[#D4AF37]" />
            <span className="w-8 h-[0.5px] bg-[#B76E79]/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]"></span>
          </div>

          {/* Heartfelt Handwritten 3D Letter Envelope Container */}
          {/* Note: In our JSON setup, the letter payload resides in DB. We must load it initially or fetch it dynamically. */}
          <div className="bg-[#FAF7F2]/40">
            {/* Fetch letter dynamically from DB load state */}
            {/* The page holds dynamic state which was loaded inside fetchAllData. Let's pass it! */}
            <LetterWrapper 
              isAdmin={isAdmin} 
              onUpdateLetter={handleUpdateLetter} 
              saveDatabaseChanges={saveDatabaseChanges}
            />
          </div>

          {/* Decorative Divider */}
          <div className="w-full py-10 flex justify-center items-center gap-1.5 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]"></span>
            <span className="w-8 h-[0.5px] bg-[#B76E79]/40"></span>
            <Sparkles size={12} className="text-[#D4AF37]" />
            <span className="w-8 h-[0.5px] bg-[#B76E79]/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]"></span>
          </div>

          {/* Sky Lantern Wishing Board */}
          <div className="bg-gradient-to-b from-white/30 to-[#FAF6F0]">
            <WishesBoard
              wishes={wishes}
              isAdmin={isAdmin}
              onUpdate={handleUpdateWishes}
              onAddWish={handleAddWish}
            />
          </div>

          {/* Elegant Page Footer */}
          <footer className="w-full py-16 text-center bg-[#FAF6F0] border-t border-[#B76E79]/10 relative z-10 flex flex-col items-center select-none">
            <div className="flex items-center gap-1.5 mb-4">
              <Heart size={16} className="text-[#B76E79] fill-[#B76E79] animate-[heartbeat_1.5s_infinite]" />
              <span className="font-serif-luxury text-sm tracking-widest text-[#3D0C11]/90">
                Celebrating Nita
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-sans leading-relaxed">
              Crafted with unconditional love & cherished family memories.
            </p>
            <p className="text-[9px] text-slate-400 font-sans mt-2">
              © {new Date().getFullYear()} Happy Birthday Nita. All Rights Reserved.
            </p>
          </footer>

          {/* 4. SYSTEM SOUNDTRACK FLOATING DISC PLAYER */}
          <MusicPlayer />

          {/* 5. CMS CONFIGURATION MASTER LOCK & SETTINGS PANEL */}
          <AdminDashboard
            config={config}
            tracks={tracks}
            isAdmin={isAdmin}
            onSetIsAdmin={setIsAdmin}
            onSaveConfig={handleSaveConfig}
          />
        </div>
      )}
    </div>
  );
}

// Sub-wrapper component to handle dynamic loading of Letter states cleanly
interface LetterWrapperProps {
  isAdmin: boolean;
  onUpdateLetter: (updatedLetter: LetterData) => void;
  saveDatabaseChanges: (updatedFields: any) => Promise<void>;
}

const LetterWrapper: React.FC<LetterWrapperProps> = ({ isAdmin, onUpdateLetter, saveDatabaseChanges }) => {
  const [letterData, setLetterData] = useState<LetterData | null>(null);

  useEffect(() => {
    const loadLetter = async () => {
      try {
        const res = await fetch("/api/db");
        const data = await res.json();
        if (data && data.letter) {
          setLetterData(data.letter);
        }
      } catch (err) {
        console.error("Letter fetch failed:", err);
      }
    };
    loadLetter();
  }, []);

  const handleLocalLetterUpdate = async (updated: LetterData) => {
    setLetterData(updated);
    onUpdateLetter(updated);
  };

  if (!letterData) return null;

  return (
    <HeartfeltLetter
      data={letterData}
      isAdmin={isAdmin}
      onUpdate={handleLocalLetterUpdate}
    />
  );
};
