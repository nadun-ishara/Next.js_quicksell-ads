import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Zap, Search } from "lucide-react";
import SortSelect from "@/components/SortSelect";
import Navbar from "@/components/Navbar";

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
    status: "PENDING",
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm sticky top-6">
              <h2 className="text-center font-extrabold text-slate-700 tracking-wider text-xs uppercase mb-6">
                FILTERS
              </h2>

              <form action="/ads" method="GET" className="space-y-5">
                {/* Maintain sort parameter when filtering */}
                {sort && <input type="hidden" name="sort" value={sort} />}

                {/* Search Keywords */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    SEARCH KEYWORDS
                  </label>
                  <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    placeholder="What are you looking for?"
                    className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-medium text-slate-700 w-full outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    CATEGORY
                  </label>
                  <select
                    name="category"
                    defaultValue={categoryId}
                    className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-medium text-slate-700 w-full outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    LOCATION
                  </label>
                  <select
                    name="location"
                    defaultValue={locationId}
                    className="bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-medium text-slate-700 w-full outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    PRICE RANGE
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      defaultValue={minPrice}
                      placeholder="Min"
                      className="bg-slate-50 border-none rounded-xl px-3 py-3 text-xs font-medium text-slate-700 w-full outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      defaultValue={maxPrice}
                      placeholder="Max"
                      className="bg-slate-50 border-none rounded-xl px-3 py-3 text-xs font-medium text-slate-700 w-full outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Apply Filters Button */}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider transition shadow-md hover:shadow-lg cursor-pointer"
                >
                  APPLY FILTERS
                </button>

                {/* Clear All Filters Link */}
                <Link
                  href="/ads"
                  className="block text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider mt-4"
                >
                  CLEAR ALL FILTERS
                </Link>
              </form>
            </div>
          </aside>

          {/* Right Main Search Results Section */}
          <section className="lg:col-span-3">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  Showing Search Results
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  {ads.length} ADS FOUND
                </p>
              </div>

              {/* Sort Controls */}
              <SortSelect currentSort={sort} />
            </div>

            {/* Results Grid or Empty State */}
            {ads.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-[380px] shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-400 tracking-wider uppercase mb-1">
                  NO RESULTS FOUND!
                </h3>
                <p className="text-xs text-slate-400">
                  Try adjusting your filters to find what you&apos;re looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map((ad) => {
                  const primaryImage =
                    ad.images.find((img) => img.isPrimary)?.filePath ||
                    "/images/placeholder.jpg";

                  return (
                    <div
                      key={ad.id}
                      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={primaryImage}
                          alt={ad.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-extrabold text-slate-800 shadow-sm">
                          LKR {ad.price.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-1 block">
                            {ad.category.name} • {ad.location.name}
                          </span>
                          <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {ad.title}
                          </h3>
                          <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                            {ad.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
