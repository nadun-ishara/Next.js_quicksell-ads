import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";
import SortSelect from "@/components/SortSelect";
import Navbar from "@/components/Navbar";
import AdCard from "@/components/AdCard";

interface AdsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}

export default async function AdsPage({ searchParams }: AdsPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const categoryId = params.category || "";
  const locationId = params.location || "";
  const minPrice = params.minPrice || "";
  const maxPrice = params.maxPrice || "";
  const sort = params.sort || "newest";

  // Build Prisma Where Clause
  const whereClause: any = {
    status: "APPROVED",
  };

  if (query) {
    whereClause.OR = [
      { title: { contains: query } },
      { description: { contains: query } },
    ];
  }

  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  if (locationId) {
    whereClause.locationId = locationId;
  }

  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price.gte = parseFloat(minPrice);
    if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
  }

  // Build OrderBy
  let orderBy: any = { createdAt: "desc" };
  if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sort === "price_asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { price: "desc" };
  }

  // Fetch Categories, Locations & Advertisements
  const [categories, locations, ads] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
    prisma.advertisement.findMany({
      where: whereClause,
      include: {
        images: true,
        category: true,
        location: true,
      },
      orderBy: orderBy,
    }),
  ]);

  const hasActiveFilters = Boolean(query || categoryId || locationId || minPrice || maxPrice);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <h2 className="font-extrabold text-slate-900 tracking-wider text-xs uppercase">
                    Filter Ads
                  </h2>
                </div>
                {hasActiveFilters && (
                  <Link
                    href="/ads"
                    className="text-[11px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </Link>
                )}
              </div>

              <form action="/ads" method="GET" className="space-y-4">
                {/* Maintain sort parameter when filtering */}
                {sort && <input type="hidden" name="sort" value={sort} />}

                {/* Search Keywords */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Keyword
                  </label>
                  <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    placeholder="Search keywords..."
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 w-full outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-slate-400"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={categoryId}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 w-full outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Location
                  </label>
                  <select
                    name="location"
                    defaultValue={locationId}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 w-full outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Price Range (LKR)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      defaultValue={minPrice}
                      placeholder="Min"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 w-full outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-slate-400"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      defaultValue={maxPrice}
                      placeholder="Max"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 w-full outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Apply Filters Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              </form>
            </div>
          </aside>

          {/* Right Main Search Results Section */}
          <section className="lg:col-span-3">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {query ? `Search Results for "${query}"` : "Browse Advertisements"}
                </h1>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Showing <span className="text-indigo-600 font-bold">{ads.length}</span> {ads.length === 1 ? "ad" : "ads"} available
                </p>
              </div>

              {/* Sort Controls */}
              <SortSelect currentSort={sort} />
            </div>

            {/* Results Grid or Empty State */}
            {ads.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-14 text-center flex flex-col items-center justify-center min-h-[380px] shadow-xs">
                <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-slate-800 tracking-tight mb-1">
                  No Advertisements Found
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mb-6">
                  We couldn&apos;t find any items matching your selected search criteria. Try adjusting your filters or search keywords.
                </p>
                <Link
                  href="/ads"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All Filters</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {ads.map((ad) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
