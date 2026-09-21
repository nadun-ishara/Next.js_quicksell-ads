"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

interface AdGalleryProps {
  images: Array<{ id: string; filePath: string; isPrimary: boolean }>;
  title: string;
}

export default function AdGallery({ images, title }: AdGalleryProps) {
  const imageList = images.length > 0 ? images : [{ id: "placeholder", filePath: "/images/placeholder.jpg", isPrimary: true }];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeImage = imageList[selectedIndex] || imageList[0];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % imageList.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden p-3 space-y-3">
      {/* Featured Main Image */}
      <div
        className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
      >
        <img
          src={activeImage.filePath}
          alt={`${title} - Photo ${selectedIndex + 1}`}
          className="w-full h-full object-contain sm:object-cover transition-all duration-300 group-hover:scale-[1.01]"
        />

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <Maximize2 className="w-3.5 h-3.5" />
            Click to expand
          </span>
        </div>

        {/* Counter Badge */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-md pointer-events-none">
          {selectedIndex + 1} / {imageList.length}
        </div>

        {/* Prev / Next Arrows if multiple photos */}
        {imageList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg backdrop-blur-sm transition-transform active:scale-90 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg backdrop-blur-sm transition-transform active:scale-90 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
          {imageList.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-20 h-16 sm:w-24 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 transition-all cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-indigo-600 ring-offset-2 scale-105 opacity-100 shadow-md"
                    : "opacity-60 hover:opacity-100 hover:scale-100"
                }`}
              >
                <img
                  src={img.filePath}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors cursor-pointer"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Lightbox Main Image */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage.filePath}
              alt={title}
              className="max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* Lightbox Navigation */}
            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-3 bg-black/70 text-white text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm">
              {selectedIndex + 1} / {imageList.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
