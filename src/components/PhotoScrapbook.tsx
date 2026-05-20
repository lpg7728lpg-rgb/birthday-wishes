"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, X, Upload, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  rotation: number;
  textOverlay: string;
  xPosition?: number;
  yPosition?: number;
}

interface PhotoScrapbookProps {
  items: GalleryItem[];
  isAdmin: boolean;
  onUpdate: (updatedItems: GalleryItem[]) => void;
}

export const PhotoScrapbook: React.FC<PhotoScrapbookProps> = ({ items, isAdmin, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to handle inline edits
  const handleFieldChange = (id: string, field: keyof GalleryItem, value: any) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onUpdate(updated);
  };

  // Add new polaroid
  const handleAddPhoto = () => {
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070",
      caption: "A new cherished memory together.",
      rotation: Math.floor(Math.random() * 8) - 4, // Random tilt between -4 and +4
      textOverlay: "Cherished"
    };
    onUpdate([...items, newItem]);
    setEditingId(newItem.id);
  };

  // Delete polaroid
  const handleDeletePhoto = (id: string) => {
    if (window.confirm("Remove this polaroid memory from the scrapbook?")) {
      const filtered = items.filter((item) => item.id !== id);
      onUpdate(filtered);
    }
  };

  // Handle local file upload for polaroid
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
        handleFieldChange(id, "imageUrl", data.url);
      }
    } catch (err) {
      console.error("Polaroid file upload failed:", err);
      alert("Failed to upload image. Please try again.");
    }
  };

  // Lightbox navigation
  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? items.length - 1 : lightboxIndex - 1);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === items.length - 1 ? 0 : lightboxIndex + 1);
  };

  return (
    <section id="gallery-section" className="relative w-full max-w-6xl mx-auto py-24 px-6 z-10 overflow-hidden">
      {/* Background Subtle Elements */}
      <div className="absolute top-1/3 left-5 w-64 h-64 bg-pink-100/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-5 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Luxury Editorial Header */}
      <div className="text-center mb-20">
        <span className="text-[10px] tracking-widest font-semibold text-[#B76E79] uppercase font-sans mb-3 block">
          A Visual Journey
        </span>
        <h2 className="font-serif-luxury text-4xl md:text-6xl font-light text-[#3D0C11] mb-4">
          The Polaroid Archive
        </h2>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B76E79] to-transparent mx-auto mb-5"></div>
        <p className="text-xs md:text-sm font-light text-slate-500 max-w-md mx-auto leading-relaxed">
          Frozen frames of pure joy, elegance, and laughter. Click any polaroid to step into the fullscreen memory gallery.
        </p>

        {/* CMS Add Button */}
        {isAdmin && (
          <button
            onClick={handleAddPhoto}
            className="mt-8 px-6 py-3 bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white rounded-full text-xs font-semibold tracking-wider uppercase hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            <Plus size={16} /> Add Polaroid Photo
          </button>
        )}
      </div>

      {/* Polaroid Scrapbook Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 items-start justify-items-center">
        {items.map((item, index) => {
          const isEditing = editingId === item.id;
          
          return (
            <motion.div
              key={item.id}
              style={{ rotate: isEditing ? 0 : item.rotation }}
              className="relative w-full max-w-[270px] bg-[#FAF8F5] p-4 pb-6 rounded-sm shadow-xl hover:shadow-2xl border border-stone-200/60 transition-shadow duration-300 group/polaroid cursor-pointer select-none"
              onClick={() => {
                if (!isEditing) setLightboxIndex(index);
              }}
              whileHover={{ 
                scale: isEditing ? 1 : 1.04, 
                rotate: isEditing ? 0 : item.rotation * 0.4,
                y: isEditing ? 0 : -8,
                zIndex: 20
              }}
              layoutId={`polaroid-${item.id}`}
            >
              {/* Washi Tape/Paper tape effect overlay at top */}
              <div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-white/40 border border-stone-200/20 shadow-[0_2px_5px_rgba(0,0,0,0.03)] -rotate-3 z-10 backdrop-blur-[1px]"
                style={{
                  clipPath: "polygon(5% 0%, 95% 0%, 100% 50%, 95% 100%, 5% 100%, 0% 50%)"
                }}
              ></div>

              {/* Photo Frame Container */}
              <div className="relative aspect-square w-full bg-[#EAE7E2] overflow-hidden rounded-xs border border-stone-300/40">
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover grayscale-[15%] group-hover/polaroid:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />

                {/* Elegant Text Overlay (Grace, Joy, etc.) */}
                {item.textOverlay && (
                  <div className="absolute inset-0 bg-black/10 group-hover/polaroid:bg-black/0 transition-colors duration-500 flex items-center justify-center">
                    <span className="font-handwritten text-4xl md:text-5xl text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] tracking-wide pointer-events-none group-hover/polaroid:scale-110 transition-transform duration-500 select-none">
                      {item.textOverlay}
                    </span>
                  </div>
                )}

                {/* Admin Delete overlay */}
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePhoto(item.id);
                    }}
                    className="absolute top-2 right-2 bg-red-600/90 text-white rounded-full p-1.5 shadow-md hover:bg-red-700 transition-colors z-20 cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              {/* Polaroid Caption Space */}
              <div className="mt-5 text-center flex flex-col items-center">
                {isEditing && isAdmin ? (
                  <div className="w-full space-y-3 p-1 mt-2 text-left" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label className="text-[8px] tracking-wider font-bold text-slate-400 uppercase">Text Overlay (Handwritten)</label>
                      <input
                        type="text"
                        value={item.textOverlay}
                        onChange={(e) => handleFieldChange(item.id, "textOverlay", e.target.value)}
                        className="w-full text-xs p-1.5 rounded border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] tracking-wider font-bold text-slate-400 uppercase">Caption Description</label>
                      <textarea
                        value={item.caption}
                        onChange={(e) => handleFieldChange(item.id, "caption", e.target.value)}
                        className="w-full text-xs p-1.5 rounded border border-stone-300 bg-white h-16 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] tracking-wider font-bold text-slate-400 uppercase">Upload Image</label>
                      <div className="flex gap-2">
                        <label className="flex items-center justify-center p-1.5 bg-stone-200 hover:bg-stone-300 rounded text-stone-700 text-xs font-semibold cursor-pointer flex-1">
                          <Upload size={12} className="mr-1" />
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(item.id, e)}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={item.imageUrl}
                          onChange={(e) => handleFieldChange(item.id, "imageUrl", e.target.value)}
                          className="text-xs p-1 rounded border border-stone-300 w-2/3 bg-white"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingId(null)}
                      className="w-full py-1 bg-[#B76E79] text-white rounded text-[10px] uppercase font-bold tracking-wider hover:opacity-90 active:scale-95 transition-all mt-2 cursor-pointer"
                    >
                      Done Editing
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="font-handwritten text-xl text-[#4A3B32] px-1 line-clamp-2 min-h-[48px] select-text">
                      {item.caption}
                    </p>
                    
                    {/* Admin edit button */}
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(item.id);
                        }}
                        className="mt-3 text-[9px] tracking-wider text-[#B76E79] hover:text-[#D4AF37] font-semibold uppercase flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 size={10} /> Edit Polaroid
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* GORGEOUS LIGHTBOX VIEW */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#3D0C11]/95 z-[9999] flex flex-col items-center justify-center p-4 md:p-10 backdrop-blur-md"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-sm transition-all z-50 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Left Nav Button */}
            <button
              onClick={showPrev}
              className="absolute left-4 md:left-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition-all z-50 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Content Container */}
            <div 
              className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center"
              >
                {/* Main image container */}
                <div className="relative max-h-[65vh] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                  <img
                    src={items[lightboxIndex].imageUrl}
                    alt={items[lightboxIndex].caption}
                    className="max-h-[65vh] object-contain w-auto h-auto mx-auto"
                  />
                  {/* Handwritten Word floating overlay */}
                  {items[lightboxIndex].textOverlay && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                      <span className="font-handwritten text-6xl md:text-8xl text-white/90 drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
                        {items[lightboxIndex].textOverlay}
                      </span>
                    </div>
                  )}
                </div>

                {/* Polaroid elegant message box underneath */}
                <div className="mt-6 text-center max-w-xl px-4 select-text">
                  <p className="font-serif-luxury text-white/95 text-lg md:text-2xl font-light italic leading-relaxed drop-shadow">
                    "{items[lightboxIndex].caption}"
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]"></span>
                    <span className="text-[10px] tracking-widest text-[#B76E79] font-semibold uppercase">
                      Memory {lightboxIndex + 1} of {items.length}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]"></span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Nav Button */}
            <button
              onClick={showNext}
              className="absolute right-4 md:right-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm transition-all z-50 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
