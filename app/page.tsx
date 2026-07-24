import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Zap, Search, Car, Smartphone, Home, Briefcase, Dog, Wrench, MoreHorizontal, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
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
      <section className="bg-[#4C28D9] text-white py-24 px-4 md:px-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-semibold mb-3 tracking-tight">
          Buy & Sell Everything <br /> Faster with QuickSell
        </h1>
        <p className="text-indigo-200/90 text-sm mb-12">Find Anything in Sri Lanka</p>

        {/* Search Bar */}
        <form action="/ads" method="GET" className="bg-white p-1.5 rounded-full w-full max-w-2xl flex items-center shadow-lg">
          <div className="flex-1 px-5">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="What are you looking for ?"
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
          <button type="submit" className="bg-[#4C28D9] hover:bg-indigo-700 text-white px-8 py-2.5 rounded-full text-sm font-semibold transition shadow-md">
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
            {categories.map((cat) => {
              // Map colors to categories for the tinted background
              const tintClasses: Record<string, string> = {
                "Vehicles": "bg-blue-50 text-blue-500",
                "Electronics": "bg-orange-50 text-orange-500",
                "Property": "bg-green-50 text-green-500",
                "Jobs": "bg-purple-50 text-purple-500",
                "Pets": "bg-red-50 text-red-500",
                "Services": "bg-indigo-50 text-indigo-500",
                "Other": "bg-pink-50 text-pink-500"
              };
              const bgClass = tintClasses[cat.name] || "bg-slate-50 text-slate-500";
              
              return (
                <Link
                  key={cat.id}
                  href={`/ads?category=${cat.id}`}
                  className="bg-white border border-slate-100 shadow-sm hover:shadow-md rounded-3xl w-[130px] h-[130px] flex flex-col items-center justify-center gap-3 transition-all cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgClass}`}>
                    {CATEGORY_ICONS[cat.name] || <MoreHorizontal className="w-6 h-6" />}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xs font-bold text-slate-800">{cat.name}</h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{cat._count.advertisements} ads</p>
                  </div>
                </Link>
              );
            })}
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

      {/* CTA Banner & Footer Section */}
      <div className="relative mt-20">
        
        {/* CTA Card */}
        <div className="max-w-6xl mx-auto px-4 md:px-12 mb-16">
          <div className="bg-[#5c32d6] rounded-3xl p-10 md:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-white text-left">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Sell Your Items <br /> Faster Than Ever.
              </h2>
              <p className="text-indigo-100 text-sm max-w-md leading-relaxed">
                Join Sri Lanka's fastest growing marketplace. Post your ad and get noticed by thousands of buyers instantly!
              </p>
            </div>
            <Link 
              href="/ads/create" 
              className="bg-white text-indigo-700 hover:text-indigo-800 px-8 py-3.5 rounded-full font-bold shadow-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              Post Your Ad Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dark Footer */}
        <footer className="bg-[#0B1120] text-slate-300 pt-16 pb-12 px-4 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16 mb-12">
              
              {/* Column 1: Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-indigo-600 rounded p-1.5 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white tracking-tight">QUICKSELL</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6 pr-4">
                  The most trusted classified ads platform for buying and selling anything in your region.
                </p>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-white hover:text-indigo-400 transition-colors">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="#" className="text-white hover:text-indigo-400 transition-colors">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </a>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h4 className="text-white font-bold mb-5">Quick Links</h4>
                <ul className="space-y-3 text-xs text-slate-400">
                  <li><Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
                  <li><Link href="/ads" className="hover:text-indigo-400 transition-colors">Browse Ads</Link></li>
                  <li><Link href="/ads/create" className="hover:text-indigo-400 transition-colors">Post an Ad</Link></li>
                  <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Create an Account</Link></li>
                </ul>
              </div>

              {/* Column 3: Support */}
              <div>
                <h4 className="text-white font-bold mb-5">Support</h4>
                <ul className="space-y-3 text-xs text-slate-400">
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Safety Tips</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>

              {/* Column 4: Contact Info */}
              <div>
                <h4 className="text-white font-bold mb-5">Contact Info</h4>
                <ul className="space-y-4 text-xs text-slate-400">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>Colombo, Sri Lanka</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>+94 71 234 5678</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>support@quicksell.lk</span>
                  </li>
                </ul>
              </div>

            </div>

            <div className="pt-8 border-t border-slate-800 text-center">
              <p className="text-[10px] text-slate-500 tracking-wider uppercase">
                &copy; {new Date().getFullYear()} QUICKSELL. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}