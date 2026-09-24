"use client";

import { useState, useEffect } from "react";
import { Phone, MessageSquare, Share2, Heart, Check, Copy, AlertCircle, Ban } from "lucide-react";

interface AdContactActionsProps {
  adId: string;
  adTitle: string;
  sellerName: string;
  sellerEmail?: string;
  sellerPhone?: string;
  isSold?: boolean | null;
  isReserved?: boolean | null;
}

export default function AdContactActions({
  adId,
  adTitle,
  sellerName,
  sellerEmail,
  sellerPhone = "+94 77 123 4567",
  isSold = false,
  isReserved = false,
}: AdContactActionsProps) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(`fav_${adId}`)) {
        setIsFavorite(true);
      }
    } catch {
      // ignore
    }
  }, [adId]);

  const toggleFavorite = () => {
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      if (next) {
        localStorage.setItem(`fav_${adId}`, "true");
        setCopiedText("Added to favorites!");
      } else {
        localStorage.removeItem(`fav_${adId}`);
        setCopiedText("Removed from favorites");
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quicksell:favorites-updated"));
      }
      setTimeout(() => setCopiedText(null), 2500);
    } catch {
      // ignore
    }
  };

  const handleRevealPhone = () => {
    if (isSold) return;
    setPhoneRevealed(true);
    navigator.clipboard.writeText(sellerPhone).catch(() => {});
    setCopiedText("Phone number copied to clipboard!");
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      setCopiedText("Ad link copied to clipboard!");
      setTimeout(() => setCopiedText(null), 2500);
    }
  };

  const cleanPhoneForWhatsApp = sellerPhone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhoneForWhatsApp}?text=${encodeURIComponent(
    `Hi ${sellerName}, I am interested in your ad "${adTitle}" on QuickSell.`
  )}`;

  return (
    <div className="space-y-3 relative">
      {/* Toast Notification */}
      {copiedText && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150 z-20 whitespace-nowrap">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{copiedText}</span>
        </div>
      )}

      {/* Sold Notice */}
      {isSold ? (
        <div className="p-4 bg-red-50 border border-red-200/80 rounded-2xl text-center space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-red-700 font-extrabold text-sm">
            <Ban className="w-4 h-4" />
            <span>ITEM HAS BEEN SOLD</span>
          </div>
          <p className="text-xs text-red-600/90 leading-relaxed">
            This item is no longer available. Contact buttons have been disabled.
          </p>
        </div>
      ) : (
        <>
          {/* WhatsApp Chat Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 text-sm cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Reveal Phone Button */}
          <button
            type="button"
            onClick={handleRevealPhone}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 text-sm cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            {phoneRevealed ? (
              <span className="flex items-center gap-1.5">
                <span>{sellerPhone}</span>
                <Copy className="w-3.5 h-3.5 opacity-70 ml-1" />
              </span>
            ) : (
              <span>Show Phone Number</span>
            )}
          </button>
        </>
      )}

      {/* Actions Row: Share & Favorite */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={handleShare}
          className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Share Ad</span>
        </button>

        <button
          type="button"
          onClick={toggleFavorite}
          className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            isFavorite
              ? "bg-rose-50 border-rose-200 text-rose-600"
              : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700"
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-500"
            }`}
          />
          <span>{isFavorite ? "Saved" : "Save"}</span>
        </button>
      </div>
    </div>
  );
}
