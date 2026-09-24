"use client";

import { useEffect, useState, useTransition } from "react";
import Navbar from "@/components/Navbar";
import AdCard from "@/components/AdCard";
import Link from "next/link";
import { Heart, ArrowLeft, Trash2, Sparkles, ShoppingBag, Loader2 } from "lucide-react";
import { getSavedAdsAction } from "@/lib/actions/ad";

export default function FavoritesPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadSavedAds = async () => {
    try {
      setLoading(true);
      const savedIds: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("fav_") && localStorage.getItem(key)) {
          savedIds.push(key.replace("fav_", ""));
        }
      }

      if (savedIds.length === 0) {
        setAds([]);
        setLoading(false);
        return;
      }

      const fetchedAds = await getSavedAdsAction(savedIds);
      setAds(fetchedAds);
    } catch (error) {
      console.error("Failed to load saved ads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedAds();

    const handleUpdate = () => {
      loadSavedAds();
    };

    window.addEventListener("quicksell:favorites-updated", handleUpdate);
    return () => {
      window.removeEventListener("quicksell:favorites-updated", handleUpdate);
    };
  }, []);

  const handleClearAll = () => {
    if (confirm("Are you sure you want to remove all saved ads?")) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("fav_")) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        window.dispatchEvent(new CustomEvent("quicksell:favorites-updated"));
        setAds([]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/ads"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all advertisements</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-gradient-to-br from-white to-rose-50/40 border border-slate-200/80 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/70 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Personal Wishlist</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Saved Advertisements
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Easily review and keep track of ads you are interested in.
            </p>
          </div>

          {ads.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-bold rounded-2xl transition shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Saved</span>
            </button>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
            <p className="text-sm font-bold text-slate-600">Loading your saved ads...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 sm:p-16 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-500">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight mb-2">
              No saved ads yet
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
              When browsing through cars, electronics, properties, or jobs, tap the heart icon on any ad to bookmark it here for quick access later.
            </p>
            <Link
              href="/ads"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition uppercase tracking-wider"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Advertisements</span>
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Showing {ads.length} {ads.length === 1 ? "saved advertisement" : "saved advertisements"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
