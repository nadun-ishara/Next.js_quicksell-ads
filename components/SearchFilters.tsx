"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Tag } from "lucide-react";

interface SearchFiltersProps {
    categories: Array<{ id: string; name: string }>;
    locations: Array<{ id: string; name: string }>;
    onSearch: (query: string) => void;
}

export default function SearchFilters({ categories, locations, onSearch }: SearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("query") || "");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
    const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");

    const handleSearch = () => {
        let url = "/?";
        if (query) url += `query=${encodeURIComponent(query)}&`;
        if (selectedCategory) url += `category=${selectedCategory}&`;
        if (selectedLocation) url += `location=${selectedLocation}`;

        router.push(url);
        onSearch(query);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                        placeholder="Search for products..."
                        className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white appearance-none"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Location Filter */}
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white appearance-none"
                    >
                        <option value="">All Locations</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-md hover:shadow-lg"
                >
                    Search
                </button>
            </div>
        </div>
    );
}