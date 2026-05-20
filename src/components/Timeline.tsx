"use client";

import React, { useState } from "react";
import { Plus, Trash2, Calendar, Image as ImageIcon, Heart, Sparkles, Star } from "lucide-react";

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  stickers?: string[];
}

interface TimelineProps {
  entries: TimelineEntry[];
  isAdmin: boolean;
  onUpdate: (updatedEntries: TimelineEntry[]) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ entries, isAdmin, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Helper to handle inline field edits
  const handleFieldChange = (id: string, field: keyof TimelineEntry, value: any) => {
    const updated = entries.map((entry) => {
      if (entry.id === id) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    onUpdate(updated);
  };

  // Add new timeline entry
  const handleAddEntry = () => {
    const newEntry: TimelineEntry = {
      id: `time-${Date.now()}`,
      date: "New Landmark",
      title: "Title of Memory",
      description: "Write something emotional and heartfelt about this memory here.",
      mediaUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070",
      mediaType: "image",
      stickers: ["heart"]
    };
    onUpdate([newEntry, ...entries]);
    setEditingId(newEntry.id);
  };

  // Delete entry
  const handleDeleteEntry = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this memory from the timeline?");
    if (confirmed) {
      const filtered = entries.filter((entry) => entry.id !== id);
      onUpdate(filtered);
    }
  };

  // Handle local file uploads inside timeline card
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
        // Automatically determine if video or image
        const isVideo = file.type.startsWith("video/");
        handleFieldChange(id, "mediaUrl", data.url);
        handleFieldChange(id, "mediaType", isVideo ? "video" : "image");
      }
    } catch (err) {
      console.error("Timeline file upload failed:", err);
      alert("Failed to upload file. Please try again.");
    }
  };

  // Render sticker icon
  const renderSticker = (name: string) => {
    switch (name) {
      case "heart":
        return <Heart size={14} className="text-[#B76E79] fill-[#B76E79]" />;
      case "sparkles":
        return <Sparkles size={14} className="text-[#D4AF37]" />;
      case "star":
        return <Star size={14} className="text-[#D4AF37] fill-[#D4AF37]" />;
      default:
        return <Heart size={14} className="text-[#B76E79] fill-[#B76E79]" />;
    }
  };

  return (
    <section id="memories-section" className="relative w-full max-w-5xl mx-auto py-20 px-6 z-10">
      {/* Editorial Section Header */}
      <div className="text-center mb-16">
        <h2 className="font-serif-luxury text-3xl md:text-5xl font-light text-[#3D0C11] mb-4">
          The Chapters of Our Bond
        </h2>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B76E79] to-transparent mx-auto mb-4"></div>
        <p className="text-xs md:text-sm font-light text-slate-500 max-w-md mx-auto uppercase tracking-widest leading-relaxed">
          A timeless timeline documenting the laughter, milestones, and unconditional love we share.
        </p>

        {/* Admin Add Landmark Button */}
        {isAdmin && (
          <button
            onClick={handleAddEntry}
            className="mt-6 px-5 py-2.5 bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white rounded-full text-xs font-semibold tracking-wider uppercase hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            <Plus size={16} /> Add Memory Chapter
          </button>
        )}
      </div>

      {/* Vertical Timeline container */}
      <div className="relative border-l-2 border-dashed border-[#B76E79]/30 pl-8 md:pl-12 space-y-12 max-w-3xl mx-auto">
        {/* Rose Gold Gradient central tracker line dot */}
        <div className="absolute top-0 left-[-6px] w-2.5 h-2.5 rounded-full bg-[#B76E79]"></div>

        {entries.map((entry) => {
          const isEditing = editingId === entry.id;

          return (
            <div key={entry.id} className="relative group/item">
              {/* Timeline Connector Node (Dot) */}
              <div className="absolute left-[-41px] md:left-[-53px] top-6 w-5 h-5 rounded-full bg-white border-4 border-[#B76E79] shadow-md flex items-center justify-center transition-transform group-hover/item:scale-125 z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
              </div>

              {/* Memory Glassmorphism Card Frame */}
              <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-lg relative transition-all duration-300 hover:shadow-xl rose-gold-glow-hover">
                
                {/* Sticker Badges overlaying card */}
                <div className="absolute -top-3 -right-2 flex gap-1 z-20">
                  {entry.stickers?.map((s, idx) => (
                    <div key={idx} className="bg-white/95 rounded-full p-1.5 shadow-sm border border-slate-100 animate-pulse">
                      {renderSticker(s)}
                    </div>
                  ))}
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full p-1.5 shadow-sm border border-red-100 transition-colors cursor-pointer"
                      title="Delete Memory"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                {/* --- RENDER EDIT MODE --- */}
                {isAdmin && isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] tracking-wider text-slate-400 uppercase font-semibold">Date Badge</label>
                        <input
                          type="text"
                          value={entry.date}
                          onChange={(e) => handleFieldChange(entry.id, "date", e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-[#B76E79] bg-white/70"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] tracking-wider text-slate-400 uppercase font-semibold">Memory Title</label>
                        <input
                          type="text"
                          value={entry.title}
                          onChange={(e) => handleFieldChange(entry.id, "title", e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-[#B76E79] bg-white/70"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] tracking-wider text-slate-400 uppercase font-semibold">Description</label>
                      <textarea
                        value={entry.description}
                        onChange={(e) => handleFieldChange(entry.id, "description", e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-[#B76E79] h-20 bg-white/70"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] tracking-wider text-slate-400 uppercase font-semibold">Media Type</label>
                        <select
                          value={entry.mediaType}
                          onChange={(e) => handleFieldChange(entry.id, "mediaType", e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white/70"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] tracking-wider text-slate-400 uppercase font-semibold">Upload Photo/Video</label>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-700 text-xs font-medium cursor-pointer transition-all">
                            <ImageIcon size={14} />
                            <span>Choose File</span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => handleFileUpload(entry.id, e)}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Or enter URL"
                            value={entry.mediaUrl}
                            onChange={(e) => handleFieldChange(entry.id, "mediaUrl", e.target.value)}
                            className="flex-grow text-xs p-1.5 rounded-lg border border-slate-200 bg-white/70"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-1.5 bg-[#B76E79] text-white rounded-lg text-xs font-semibold cursor-pointer shadow hover:opacity-90 active:scale-95"
                      >
                        Done Editing
                      </button>
                    </div>
                  </div>
                ) : (
                  // --- RENDER NORMAL VIEW ---
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Media Frame (Left) */}
                    <div className="md:col-span-5 relative w-full h-44 rounded-2xl overflow-hidden shadow border border-white/80 group/media">
                      {entry.mediaType === "video" ? (
                        <video
                          src={entry.mediaUrl}
                          className="w-full h-full object-cover"
                          controls
                          muted
                        />
                      ) : (
                        <img
                          src={entry.mediaUrl}
                          alt={entry.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/media:scale-105"
                        />
                      )}
                      {/* Transparent frame highlight */}
                      <div className="absolute inset-0 border border-white/20 rounded-2xl pointer-events-none"></div>
                    </div>

                    {/* Card Content (Right) */}
                    <div className="md:col-span-7 flex flex-col justify-start text-left">
                      {/* Date Badge */}
                      <span className="inline-flex items-center gap-1 text-[10px] tracking-widest font-semibold text-[#B76E79] uppercase font-sans mb-2">
                        <Calendar size={10} /> {entry.date}
                      </span>
                      
                      {/* Title */}
                      <h3 className="font-serif-luxury text-xl font-medium text-[#3D0C11] mb-2">
                        {entry.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-xs text-slate-500 font-light font-sans leading-relaxed mb-4">
                        {entry.description}
                      </p>

                      {/* Admin inline edit toggle button */}
                      {isAdmin && (
                        <button
                          onClick={() => setEditingId(entry.id)}
                          className="self-start text-[10px] tracking-wider text-[#B76E79] hover:text-[#D4AF37] font-semibold uppercase cursor-pointer"
                        >
                          ✏️ Edit Chapter
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
