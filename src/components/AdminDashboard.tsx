"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, X, Save, Edit, Trash2, Plus, Sparkles, Upload, FileText, Settings, Music, RefreshCw } from "lucide-react";
import { Track } from "@/context/AudioContext";

export interface SystemConfig {
  sisterName: string;
  birthdayDate: string;
  introText: string;
  heroHeading: string;
  heroSubtitle: string;
  heroMedia: string;
  themeColor: string;
  adminPasscode: string;
}

interface AdminDashboardProps {
  config: SystemConfig;
  tracks: Track[];
  isAdmin: boolean;
  onSetIsAdmin: (val: boolean) => void;
  onSaveConfig: (updatedConfig: SystemConfig, updatedTracks: Track[]) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  tracks,
  isAdmin,
  onSetIsAdmin,
  onSaveConfig
}) => {
  const [showPasscodeGate, setShowPasscodeGate] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  // Local copy of configurations for visual adjustments inside drawer
  const [localConfig, setLocalConfig] = useState<SystemConfig>({ ...config });
  const [localTracks, setLocalTracks] = useState<Track[]>([...tracks]);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when props change
  useEffect(() => {
    setLocalConfig({ ...config });
  }, [config]);

  useEffect(() => {
    setLocalTracks([...tracks]);
  }, [tracks]);

  // Handle Passcode Unlock
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === config.adminPasscode) {
      onSetIsAdmin(true);
      setShowPasscodeGate(false);
      setPasscode("");
      setPasscodeError(false);
      setShowDrawer(true);
    } else {
      setPasscodeError(true);
      setPasscode("");
      setTimeout(() => setPasscodeError(false), 2000);
    }
  };

  const handleConfigChange = (field: keyof SystemConfig, value: any) => {
    setLocalConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleTrackChange = (id: string, field: keyof Track, value: any) => {
    setLocalTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleAddTrack = () => {
    const newTrack: Track = {
      id: `music-${Date.now()}`,
      name: "New Music Track",
      artist: "Acoustic Melody",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      isDefault: false
    };
    setLocalTracks((prev) => [...prev, newTrack]);
  };

  const handleDeleteTrack = (id: string) => {
    if (localTracks.length <= 1) {
      alert("You must keep at least one track in the playlist!");
      return;
    }
    setLocalTracks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFileUpload = async (field: "heroMedia" | string, e: React.ChangeEvent<HTMLInputElement>, isTrack = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data && data.url) {
        if (isTrack) {
          // field acts as the track ID
          handleTrackChange(field, "url", data.url);
        } else {
          handleConfigChange("heroMedia", data.url);
        }
      }
    } catch (err) {
      console.error("Dashboard file upload failed:", err);
      alert("Failed to upload. Please try again.");
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await onSaveConfig(localConfig, localTracks);
      setIsSaving(false);
      setShowDrawer(false);
      alert("All configurations and changes saved successfully!");
    } catch (err) {
      console.error(err);
      setIsSaving(false);
      alert("Failed to save. Please review logs.");
    }
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (BOTTOM RIGHT) */}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2">
        {isAdmin && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setShowDrawer(!showDrawer)}
            className="p-3.5 bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
            title="System Settings Drawer"
          >
            <Settings size={20} className={showDrawer ? "rotate-45 transition-transform" : ""} />
          </motion.button>
        )}

        <button
          onClick={() => {
            if (isAdmin) {
              onSetIsAdmin(false);
              setShowDrawer(false);
            } else {
              setShowPasscodeGate(true);
            }
          }}
          className={`p-3.5 rounded-full shadow-lg transition-all cursor-pointer ${
            isAdmin
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white/90 backdrop-blur-sm text-[#B76E79] hover:text-[#D4AF37] hover:bg-white"
          }`}
          title={isAdmin ? "Exit Admin Mode" : "Unlock Admin Dashboard"}
        >
          {isAdmin ? <Unlock size={20} /> : <Lock size={20} />}
        </button>
      </div>

      {/* PASSCODE MODAL ENTRY */}
      <AnimatePresence>
        {showPasscodeGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-white/95 border border-[#B76E79]/20 rounded-3xl p-6 md:p-8 w-full max-w-sm text-center shadow-2xl relative"
            >
              {/* Close Gate */}
              <button
                onClick={() => setShowPasscodeGate(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 rounded-full bg-[#B76E79]/10 text-[#B76E79] flex items-center justify-center mx-auto mb-4 border border-[#B76E79]/30">
                <Lock size={22} className="animate-pulse" />
              </div>

              <h3 className="font-serif-luxury text-lg text-[#3D0C11] mb-2">
                Unlock Sister Memory Vault
              </h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-sans mb-6">
                Enter admin passcode (Default: 1111)
              </p>

              <form onSubmit={handleUnlock} className="space-y-4">
                <input
                  type="password"
                  required
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className={`w-full text-center text-lg tracking-widest font-mono p-3 rounded-xl border focus:outline-none transition-all ${
                    passcodeError
                      ? "border-red-500 bg-red-50 text-red-500 animate-shake"
                      : "border-stone-200 focus:border-[#B76E79] bg-stone-50"
                  }`}
                  autoFocus
                />

                {passcodeError && (
                  <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider">
                    Incorrect Passcode! Try again.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white rounded-xl text-xs font-semibold tracking-widest uppercase hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow"
                >
                  Verify Access
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN DASHBOARD SIDEBAR DRAWER */}
      <AnimatePresence>
        {showDrawer && isAdmin && (
          <>
            {/* Backdrop layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 bg-black/40 z-[9990] backdrop-blur-xs"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-[9995] flex flex-col justify-between border-l border-stone-200"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#B76E79]/10 rounded-lg text-[#B76E79]">
                    <Settings size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif-luxury text-base text-[#3D0C11] font-semibold">
                      Sister CMS Master Console
                    </h3>
                    <p className="text-[9px] tracking-wider text-slate-400 uppercase font-sans font-semibold">
                      Modify global configurations
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-1.5 hover:bg-stone-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content Form Scrollable */}
              <div className="flex-grow p-6 overflow-y-auto space-y-6 text-left custom-scrollbar">
                
                {/* section: GLOBAL CONFIG */}
                <div className="space-y-4">
                  <h4 className="text-[10px] tracking-widest text-[#B76E79] uppercase font-bold border-b border-stone-100 pb-2 flex items-center gap-1.5">
                    <FileText size={12} /> Global Vitals
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] tracking-wider text-slate-400 font-bold uppercase block mb-1">
                        Sister Name
                      </label>
                      <input
                        type="text"
                        value={localConfig.sisterName}
                        onChange={(e) => handleConfigChange("sisterName", e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-[#B76E79] bg-stone-50"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-wider text-slate-400 font-bold uppercase block mb-1">
                        Admin Passcode
                      </label>
                      <input
                        type="text"
                        value={localConfig.adminPasscode}
                        onChange={(e) => handleConfigChange("adminPasscode", e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-[#B76E79] bg-stone-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] tracking-wider text-slate-400 font-bold uppercase block mb-1">
                      Birthday Countdown Target
                    </label>
                    <input
                      type="datetime-local"
                      // Format ISO Date-time back to HTML Input local values (YYYY-MM-DDThh:mm)
                      value={new Date(localConfig.birthdayDate).toISOString().substring(0, 16)}
                      onChange={(e) => handleConfigChange("birthdayDate", new Date(e.target.value).toISOString())}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-[#B76E79] bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] tracking-wider text-slate-400 font-bold uppercase block mb-1">
                      Preloader Cover Title
                    </label>
                    <input
                      type="text"
                      value={localConfig.introText}
                      onChange={(e) => handleConfigChange("introText", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-[#B76E79] bg-stone-50"
                    />
                  </div>
                </div>

                {/* section: HERO & LAYOUT DESIGN */}
                <div className="space-y-4">
                  <h4 className="text-[10px] tracking-widest text-[#B76E79] uppercase font-bold border-b border-stone-100 pb-2 flex items-center gap-1.5">
                    <Sparkles size={12} /> Hero Branding
                  </h4>

                  <div>
                    <label className="text-[9px] tracking-wider text-slate-400 font-bold uppercase block mb-1">
                      Main Heading Header
                    </label>
                    <input
                      type="text"
                      value={localConfig.heroHeading}
                      onChange={(e) => handleConfigChange("heroHeading", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-[#B76E79] bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] tracking-wider text-slate-400 font-bold uppercase block mb-1">
                      Subheading Paragraph
                    </label>
                    <textarea
                      value={localConfig.heroSubtitle}
                      onChange={(e) => handleConfigChange("heroSubtitle", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:outline-[#B76E79] h-20 bg-stone-50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] tracking-wider text-slate-400 font-bold uppercase block mb-1">
                      Hero Backdrop Media File
                    </label>
                    <div className="flex gap-2 items-center">
                      <label className="flex items-center justify-center p-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg text-stone-700 text-xs font-semibold cursor-pointer w-2/5 transition-colors">
                        <Upload size={12} className="mr-1" />
                        Choose Media
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => handleFileUpload("heroMedia", e)}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Or input URL"
                        value={localConfig.heroMedia}
                        onChange={(e) => handleConfigChange("heroMedia", e.target.value)}
                        className="w-3/5 text-xs p-2.5 rounded-lg border border-stone-200 bg-stone-50"
                      />
                    </div>
                  </div>
                </div>

                {/* section: PLAYLIST MUSIC DRAWER */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <h4 className="text-[10px] tracking-widest text-[#B76E79] uppercase font-bold flex items-center gap-1.5">
                      <Music size={12} /> Cinematic Soundtracks
                    </h4>
                    <button
                      onClick={handleAddTrack}
                      className="px-2 py-1 bg-stone-100 hover:bg-[#B76E79]/10 hover:text-[#B76E79] text-stone-600 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus size={10} /> Add Track
                    </button>
                  </div>

                  <div className="space-y-3">
                    {localTracks.map((track) => (
                      <div
                        key={track.id}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-100 space-y-2 relative"
                      >
                        {/* Track actions */}
                        <button
                          onClick={() => handleDeleteTrack(track.id)}
                          className="absolute top-2.5 right-2.5 text-stone-400 hover:text-red-500 cursor-pointer p-1"
                        >
                          <Trash2 size={12} />
                        </button>

                        <div className="grid grid-cols-2 gap-3 pr-6">
                          <div>
                            <label className="text-[8px] text-slate-400 font-bold uppercase">Song Title</label>
                            <input
                              type="text"
                              value={track.name}
                              onChange={(e) => handleTrackChange(track.id, "name", e.target.value)}
                              className="w-full text-xs p-1 bg-white border border-stone-200 rounded"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] text-slate-400 font-bold uppercase">Artist</label>
                            <input
                              type="text"
                              value={track.artist}
                              onChange={(e) => handleTrackChange(track.id, "artist", e.target.value)}
                              className="w-full text-xs p-1 bg-white border border-stone-200 rounded"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] text-slate-400 font-bold uppercase">Audio Source File</label>
                          <div className="flex gap-2 items-center">
                            <label className="flex items-center justify-center py-1 px-2.5 bg-stone-200 hover:bg-stone-300 rounded text-stone-700 text-[10px] font-semibold cursor-pointer transition-colors w-1/3">
                              <Upload size={10} className="mr-0.5" />
                              Upload MP3
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={(e) => handleFileUpload(track.id, e, true)}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              placeholder="Direct audio URL"
                              value={track.url}
                              onChange={(e) => handleTrackChange(track.id, "url", e.target.value)}
                              className="w-2/3 text-[10px] p-1 bg-white border border-stone-200 rounded"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={track.isDefault || false}
                            onChange={(e) => {
                              // Reset defaults, set this one
                              setLocalTracks(prev => prev.map(t => ({
                                ...t,
                                isDefault: t.id === track.id
                              })));
                            }}
                            className="rounded accent-[#B76E79]"
                          />
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                            Set as Default Playlist Track on Entry
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 border-t border-stone-100 flex items-center justify-between gap-4 bg-stone-50/50">
                <button
                  onClick={() => setShowDrawer(false)}
                  className="w-1/3 py-3 border border-stone-200 text-slate-600 rounded-xl text-xs font-semibold uppercase hover:bg-stone-100 active:scale-95 transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="w-2/3 py-3 bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Saving settings...
                    </>
                  ) : (
                    <>
                      <Save size={14} /> Save Master Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Shaking custom animations declaration */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </>
  );
};
