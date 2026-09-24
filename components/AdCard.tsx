"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, MapPin, Camera, Clock } from "lucide-react";

interface AdCardProps {
  ad: {
    id: string;
    title: string;
    description?: string;
    price: number | string | any;
    phone?: string | null;
    condition?: string | null;
    isNegotiable?: boolean | null;
    isSold?: boolean | null;
    isReserved?: boolean | null;
    createdAt: Date | string;
    category: { name: string };
    location: { name: string };
    images: Array<{ id?: string; filePath: string; isPrimary?: boolean }>;
  };
}

function timeAgo(dateInput: Date | string) {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatCondition(condition?: string | null) {
  if (!condition) return null;
  switch (condition) {
    case "BRAND_NEW":
      return "Brand New";
    case "LIKE_NEW":
      return "Like New";
    case "USED":
      return "Used";
    case "FOR_PARTS":
      return "For Parts";
    default:
      return condition;
  }
}

export default function AdCard({ ad }: AdCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`fav_${ad.id}`);
      if (saved) setIsFavorite(true);
    } catch {
      // ignore
    }
  }, [ad.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      if (next) {
        localStorage.setItem(`fav_${ad.id}`, "true");
      } else {
        localStorage.removeItem(`fav_${ad.id}`);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quicksell:favorites-updated"));
      }
    } catch {
      // ignore
    }
  };

  const primaryImage =
    ad.images.find((img) => img.isPrimary)?.filePath ||
    (ad.images.length > 0 ? ad.images[0].filePath : "/images/placeholder.jpg");

  const formattedPrice = Number(ad.price).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const conditionLabel = formatCondition(ad.condition);

  return (
    <Link
      href={`/ads/${ad.id}`}
      className={`group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative ${
        ad.isSold ? "opacity-85" : ""
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/11] w-full bg-slate-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={ad.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
            ad.isSold ? "grayscale-[40%]" : ""
          }`}
          loading="lazy"
        />

        {/* Sold Overlay */}
        {ad.isSold && (
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px] flex items-center justify-center z-10 pointer-events-none">
            <span className="bg-red-600 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xl border border-red-400 rotate-[-6deg]">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Reserved Badge */}
        {ad.isReserved && !ad.isSold && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md border border-amber-300">
              RESERVED
            </span>
          </div>
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
          {/* Category Pill */}
          <span className="bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
            {ad.category.name}
          </span>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={toggleFavorite}
            className={`pointer-events-auto p-2 rounded-full transition-all duration-200 cursor-pointer ${
              isFavorite
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105"
                : "bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500 backdrop-blur-sm shadow-sm"
            }`}
            aria-label="Save to favorites"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform ${
                isFavorite ? "fill-white" : ""
              }`}
            />
          </button>
        </div>

        {/* Bottom Badges Overlay */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
          {ad.images.length > 1 ? (
            <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
              <Camera className="w-3 h-3" />
              {ad.images.length}
            </span>
          ) : (
            <div />
          )}

          {conditionLabel && (
            <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200 shadow-sm">
              {conditionLabel}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Time */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
            <span className="flex items-center gap-1 text-slate-500 font-semibold truncate max-w-[65%]">
              <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
              <span className="truncate">{ad.location.name}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0 text-slate-400">
              <Clock className="w-3 h-3" />
              {timeAgo(ad.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {ad.title}
          </h3>

          {/* Description snippet if available */}
          {ad.description && (
            <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 font-normal leading-relaxed">
              {ad.description}
            </p>
          )}
        </div>

        {/* Price Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-extrabold text-indigo-600 uppercase">
                LKR
              </span>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                {formattedPrice}
              </span>
            </div>
            {ad.isNegotiable && (
              <span className="text-[10px] font-semibold text-emerald-600 -mt-0.5">
                Negotiable
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
