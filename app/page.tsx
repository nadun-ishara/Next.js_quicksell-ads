import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Zap, Search, Car, Smartphone, Home, Briefcase, Dog, Wrench, MoreHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";

interface HomePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
  }>;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Vehicles": <Car className="text-blue-500 w-6 h-6" />,
  "Electronics": <Smartphone className="text-orange-500 w-6 h-6" />,
  "Property": <Home className="text-green-500 w-6 h-6" />,
  "Jobs": <Briefcase className="text-purple-500 w-6 h-6" />,
  "Pets": <Dog className="text-red-500 w-6 h-6" />,
  "Services": <Wrench className="text-indigo-500 w-6 h-6" />,
  "Other": <MoreHorizontal className="text-pink-500 w-6 h-6" />
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = params.q || "";

  // Fetch data
  const [categories, ads] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { advertisements: true }
        }
      }
    }),
    prisma.advertisement.findMany({
      where: {
        status: "PENDING",
        ...(query ? {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ]
        } : {})
      },
      include: {
        images: true,
        category: true,
        location: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6
    }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-800 text-white py-20 px-4 md:px-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
          Buy & Sell Everything <br /> Faster with QuickSell
        </h1>
        <p className="text-indigo-100 mb-10">Find Anything in Sri Lanka</p>

        {/* Search Bar */}
        <form action="/ads" method="GET" className="bg-white p-2 rounded-full w-full max-w-2xl flex items-center shadow-lg">
          <div className="flex-1 px-4">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="What are you looking for ?"
              className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition shadow-md">
            Search
          </button>
        </form>
      </section>

      {/* main content */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-12">

        {/* Categories Section */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-slate-800 mb-8">Browse by Category</h2>
          <div className="flex flex-wrap gap-4 md:gap-6 justify-start">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/ads?category=${cat.id}`}
                className="bg-white hover:border-indigo-200 border border-transparent shadow-sm hover:shadow-md rounded-2xl w-[120px] h-[120px] flex flex-col items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                  {CATEGORY_ICONS[cat.name] || <MoreHorizontal className="text-slate-500 w-6 h-6" />}
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-slate-700">{cat.name}</h3>
                  <p className="text-[10px] text-slate-400">{cat._count.advertisements} ads</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Advertisements */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-xl font-bold text-slate-800">Latest Advertisements</h2>
            <Link href="/ads" className="text-sm text-indigo-600 font-semibold hover:underline">
              See all Advertisements &rarr;
            </Link>
          </div>

          {ads.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-300 rounded-lg">
              <p className="text-slate-400">No advertisements found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ads.map((ad) => {
                const primaryImage =
                  ad.images.find((img) => img.isPrimary)?.filePath ||
                  "/images/placeholder.jpg";

                return (
                  <div
                    key={ad.id}
                    className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={primaryImage}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-slate-800 shadow">
                        LKR {ad.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mb-1">
                        {ad.category.name} • {ad.location.name}
                      </span>
                      <h3 className="text-sm font-bold mt-1 text-slate-800 line-clamp-2 leading-tight">
                        {ad.title}
                      </h3>
                      <p className="text-slate-500 text-xs mt-2 line-clamp-2 flex-1">
                        {ad.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}