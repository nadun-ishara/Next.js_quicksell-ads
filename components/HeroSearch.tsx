"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Tag, ArrowRight, X } from "lucide-react";

interface HeroSearchProps {
  categories: Array<{ id: string; name: string }>;
  locations: Array<{ id: string; name: string }>;
  defaultQuery?: string;
}

const TRENDING_SEARCHES = [
  { label: "iPhone 15", query: "iPhone 15" },
  { label: "Toyota Aqua", query: "Toyota Aqua" },
  { label: "MacBook Pro", query: "MacBook" },
  { label: "House in Colombo", query: "Colombo" },
  { label: "Yamaha FZ", query: "Yamaha" },
];

export default function HeroSearch({
  categories,
  locations,
  defaultQuery = "",
}: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    if (location) params.set("location", location);

    const queryString = params.toString();
    router.push(`/ads${queryString ? `?${queryString}` : ""}`);
  };

  const handleChipClick = (searchKeyword: string) => {
    setQuery(searchKeyword);
    router.push(`/ads?q=${encodeURIComponent(searchKeyword)}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Capsule Search Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/95 backdrop-blur-xl p-2 md:p-2.5 rounded-3xl md:rounded-full shadow-2xl shadow-indigo-950/20 border border-white/40 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 transition-all focus-within:ring-2 focus-within:ring-indigo-400"
      >
        {/* Keywords Input */}
        <div className="flex-1 flex items-center gap-3 px-4 py-2.5 md:py-2">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for today? (e.g. Car, Phone)"
              className="w-full bg-transparent text-slate-800 text-sm font-medium outline-none placeholder:text-slate-400 placeholder:font-normal pr-6"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="hidden md:block w-px h-8 bg-slate-200" />

        {/* Category Selector */}
        <div className="flex items-center gap-2.5 px-4 py-2 md:py-2 md:w-48 border-t md:border-t-0 border-slate-100">
          <Tag className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent text-xs md:text-sm font-medium text-slate-700 outline-none cursor-pointer truncate"
          >
            <option value="" className="text-slate-400">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="text-slate-800">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Separator */}
        <div className="hidden md:block w-px h-8 bg-slate-200" />

        {/* Location Selector */}
        <div className="flex items-center gap-2.5 px-4 py-2 md:py-2 md:w-44 border-t md:border-t-0 border-slate-100">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-xs md:text-sm font-medium text-slate-700 outline-none cursor-pointer truncate"
          >
            <option value="" className="text-slate-400">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id} className="text-slate-800">
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold px-7 py-3 rounded-2xl md:rounded-full text-sm shadow-md shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 tracking-wide cursor-pointer"
        >
          <span>Search</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Trending Search Chips */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-indigo-200/90 font-medium">Trending:</span>
        {TRENDING_SEARCHES.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleChipClick(item.query)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-3 py-1 rounded-full text-[11px] font-medium transition-all backdrop-blur-sm hover:scale-105 active:scale-95 cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
