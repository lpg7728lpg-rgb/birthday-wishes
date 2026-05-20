"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Play, Pause, X, Upload, Volume2, VolumeX } from "lucide-react";

export interface VideoMessage {
  id: string;
  videoUrl: string;
  senderName: string;
  message: string;
  duration: string;
}

interface VideoMessagesProps {
  videos: VideoMessage[];
  isAdmin: boolean;
  onUpdate: (updatedVideos: VideoMessage[]) => void;
}

export const VideoMessages: React.FC<VideoMessagesProps> = ({ videos, isAdmin, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mutedStates, setMutedStates] = useState<{ [key: string]: boolean }>({});
  
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleFieldChange = (id: string, field: keyof VideoMessage, value: any) => {
    const updated = videos.map((v) => {
      if (v.id === id) {
        return { ...v, [field]: value };
      }
      return v;
    });
    onUpdate(updated);
  };

  const handleAddVideo = () => {
    const newVideo: VideoMessage = {
      id: `vid-${Date.now()}`,
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      senderName: "Dear Family & Friends",
      message: "May your day be filled with warm smiles, sweet moments, and lovely memories. Happy Birthday!",
      duration: "10s"
    };
    onUpdate([...videos, newVideo]);
    setEditingId(newVideo.id);
  };

  const handleDeleteVideo = (id: string) => {
    if (window.confirm("Are you sure you want to delete this video message?")) {
      const filtered = videos.filter((v) => v.id !== id);
      onUpdate(filtered);
    }
  };

  const handleFileUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
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
        handleFieldChange(id, "videoUrl", data.url);
      }
    } catch (err) {
      console.error("Video file upload failed:", err);
      alert("Failed to upload video. Please try again.");
    }
  };

  const handleMouseEnter = (id: string, idx: number) => {
    setHoverIndex(idx);
    const video = videoRefs.current[id];
    if (video) {
      video.play().catch((err) => console.log("Video auto play prevented", err));
    }
  };

  const handleMouseLeave = (id: string) => {
    setHoverIndex(null);
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const toggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isMuted = !mutedStates[id];
    setMutedStates({ ...mutedStates, [id]: isMuted });
    const video = videoRefs.current[id];
    if (video) {
      video.muted = isMuted;
    }
  };

  return (
    <section id="videos-section" className="relative w-full max-w-5xl mx-auto py-24 px-6 z-10">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B76E79]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-[10px] tracking-widest font-semibold text-[#B76E79] uppercase font-sans mb-3 block">
          Cinematic Wishes
        </span>
        <h2 className="font-serif-luxury text-4xl md:text-5xl font-light text-[#3D0C11] mb-4">
          Unforgettable Video Tributes
        </h2>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B76E79] to-transparent mx-auto mb-5"></div>
        <p className="text-xs md:text-sm font-light text-slate-500 max-w-md mx-auto leading-relaxed">
          Heartfelt video wishes from loved ones. Hover over cards to preview snippets, or click to expand in full cinema mode.
        </p>

        {/* Admin Add Video Button */}
        {isAdmin && (
          <button
            onClick={handleAddVideo}
            className="mt-6 px-5 py-2.5 bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white rounded-full text-xs font-semibold tracking-wider uppercase hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            <Plus size={16} /> Add Video Message
          </button>
        )}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-items-center">
        {videos.map((vid, index) => {
          const isEditing = editingId === vid.id;
          const isHovered = hoverIndex === index;
          const isMuted = mutedStates[vid.id] !== false; // Default to muted on hover

          return (
            <div
              key={vid.id}
              className="w-full max-w-md bg-white/40 backdrop-blur-md border border-white/60 shadow-xl rounded-3xl p-5 relative overflow-hidden transition-all duration-500 hover:shadow-2xl rose-gold-glow-hover flex flex-col h-full"
              onMouseEnter={() => !isEditing && handleMouseEnter(vid.id, index)}
              onMouseLeave={() => !isEditing && handleMouseLeave(vid.id)}
              onClick={() => {
                if (!isEditing) setActiveVideoIndex(index);
              }}
            >
              {/* Sticker header details */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <span className="bg-white/90 backdrop-blur-sm border border-stone-100 rounded-full px-3 py-1 text-[9px] tracking-wider font-semibold text-[#B76E79] uppercase shadow-xs">
                  📼 Wish From
                </span>
              </div>

              {/* Admin Tools top right */}
              {isAdmin && (
                <div className="absolute top-4 right-4 z-20 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setEditingId(isEditing ? null : vid.id)}
                    className="bg-white hover:bg-slate-50 text-slate-700 rounded-full p-2 border border-slate-200/80 shadow transition-colors cursor-pointer"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(vid.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full p-2 border border-red-100 shadow transition-colors cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}

              {/* Video Player Display Card */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md bg-stone-900 border border-white/20 group/media cursor-pointer flex-shrink-0">
                <video
                  ref={(el) => {
                    videoRefs.current[vid.id] = el;
                  }}
                  src={vid.videoUrl}
                  className="w-full h-full object-cover"
                  playsInline
                  loop
                  muted={isMuted}
                />

                {/* Ambient Soft Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover/media:opacity-30 transition-opacity duration-300"></div>

                {/* Hover Play Button Trigger */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: isHovered ? 1.15 : 1 }}
                    className="bg-white/90 backdrop-blur-sm text-[#3D0C11] rounded-full p-4 shadow-lg group-hover/media:bg-white transition-all cursor-pointer duration-300"
                  >
                    <Play size={20} className="fill-[#3D0C11] ml-0.5" />
                  </motion.div>
                </div>

                {/* Audio speaker trigger inside card */}
                {isHovered && (
                  <button
                    onClick={(e) => toggleMute(vid.id, e)}
                    className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 backdrop-blur-xs transition-colors z-20 cursor-pointer"
                  >
                    {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  </button>
                )}

                {/* Video duration tag */}
                {vid.duration && (
                  <span className="absolute bottom-3 left-3 bg-black/60 text-white rounded px-1.5 py-0.5 text-[8px] font-semibold tracking-wider font-mono uppercase backdrop-blur-xs">
                    {vid.duration}
                  </span>
                )}
              </div>

              {/* Message text details */}
              <div className="mt-5 flex-grow flex flex-col justify-between text-left select-text">
                {isEditing && isAdmin ? (
                  <div className="space-y-4 pt-2" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label className="text-[9px] tracking-wider text-slate-400 uppercase font-semibold">Sender Name</label>
                      <input
                        type="text"
                        value={vid.senderName}
                        onChange={(e) => handleFieldChange(vid.id, "senderName", e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-[#B76E79] bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-wider text-slate-400 uppercase font-semibold">Message Quote</label>
                      <textarea
                        value={vid.message}
                        onChange={(e) => handleFieldChange(vid.id, "message", e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-[#B76E79] h-20 bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] tracking-wider text-slate-400 uppercase font-semibold">Duration (e.g., 10s)</label>
                        <input
                          type="text"
                          value={vid.duration}
                          onChange={(e) => handleFieldChange(vid.id, "duration", e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] tracking-wider text-slate-400 uppercase font-semibold">Video File</label>
                        <label className="flex items-center justify-center p-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 text-xs font-semibold cursor-pointer w-full hover:bg-slate-200 transition-colors">
                          <Upload size={12} className="mr-1" />
                          Upload MP4
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileUpload(vid.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] tracking-wider text-slate-400 uppercase font-semibold">Or Video URL</label>
                      <input
                        type="text"
                        value={vid.videoUrl}
                        onChange={(e) => handleFieldChange(vid.id, "videoUrl", e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <button
                      onClick={() => setEditingId(null)}
                      className="w-full py-2 bg-[#B76E79] text-white rounded-lg text-xs font-semibold uppercase hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                    >
                      Done Editing
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="font-serif-luxury text-xl font-medium text-[#3D0C11] mb-2 leading-relaxed">
                        {vid.senderName}
                      </h4>
                      <p className="text-xs text-slate-500 font-light font-sans leading-relaxed italic pr-2">
                        "{vid.message}"
                      </p>
                    </div>
                    
                    <span className="inline-flex self-start mt-4 text-[9px] tracking-wider text-[#B76E79] font-bold uppercase transition-colors hover:text-[#D4AF37] cursor-pointer">
                      🎬 Click To Watch Wish →
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EXPANDED LUXURY VIDEO SCREEN MODAL */}
      <AnimatePresence>
        {activeVideoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#3D0C11]/95 z-[9999] flex flex-col items-center justify-center p-4 md:p-8 backdrop-blur-md"
            onClick={() => setActiveVideoIndex(null)}
          >
            {/* Close */}
            <button
              onClick={() => setActiveVideoIndex(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-sm transition-all z-50 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Cinema content frame */}
            <div 
              className="relative max-w-4xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                {/* Embedded Video Player */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                  <video
                    src={videos[activeVideoIndex].videoUrl}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  />
                </div>

                {/* Subtitles / Greeting details */}
                <div className="mt-6 text-center max-w-2xl px-4 select-text">
                  <span className="text-[10px] tracking-widest text-[#B76E79] font-bold uppercase block mb-2">
                    A Special Wish From
                  </span>
                  <h3 className="font-serif-luxury text-white text-2xl md:text-3xl font-light mb-3">
                    {videos[activeVideoIndex].senderName}
                  </h3>
                  <p className="font-sans text-stone-300 text-sm md:text-base font-light leading-relaxed italic pr-2">
                    "{videos[activeVideoIndex].message}"
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
