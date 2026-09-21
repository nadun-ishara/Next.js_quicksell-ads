import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Zap,
  Car,
  Smartphone,
  Home,
  Briefcase,
  Dog,
  Wrench,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Laptop,
  Bike,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import AdCard from "@/components/AdCard";

interface HomePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
  }>;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Vehicles: <Car className="text-blue-600 w-6 h-6" />,
  Cars: <Car className="text-blue-600 w-6 h-6" />,
  Motorbikes: <Bike className="text-rose-600 w-6 h-6" />,
  Electronics: <Smartphone className="text-amber-600 w-6 h-6" />,
  Laptops: <Laptop className="text-indigo-600 w-6 h-6" />,
  "Mobile Phones": <Smartphone className="text-teal-600 w-6 h-6" />,
  Property: <Home className="text-emerald-600 w-6 h-6" />,
  Jobs: <Briefcase className="text-purple-600 w-6 h-6" />,
  Pets: <Dog className="text-orange-600 w-6 h-6" />,
  Services: <Wrench className="text-cyan-600 w-6 h-6" />,
  Other: <MoreHorizontal className="text-slate-600 w-6 h-6" />,
};

const CATEGORY_TINTS: Record<string, { bg: string; hoverBorder: string }> = {
  Vehicles: { bg: "bg-blue-50 text-blue-600", hoverBorder: "group-hover:border-blue-300" },
  Cars: { bg: "bg-blue-50 text-blue-600", hoverBorder: "group-hover:border-blue-300" },
  Motorbikes: { bg: "bg-rose-50 text-rose-600", hoverBorder: "group-hover:border-rose-300" },
  Electronics: { bg: "bg-amber-50 text-amber-600", hoverBorder: "group-hover:border-amber-300" },
  Laptops: { bg: "bg-indigo-50 text-indigo-600", hoverBorder: "group-hover:border-indigo-300" },
  "Mobile Phones": { bg: "bg-teal-50 text-teal-600", hoverBorder: "group-hover:border-teal-300" },
  Property: { bg: "bg-emerald-50 text-emerald-600", hoverBorder: "group-hover:border-emerald-300" },
  Jobs: { bg: "bg-purple-50 text-purple-600", hoverBorder: "group-hover:border-purple-300" },
  Pets: { bg: "bg-orange-50 text-orange-600", hoverBorder: "group-hover:border-orange-300" },
  Services: { bg: "bg-cyan-50 text-cyan-600", hoverBorder: "group-hover:border-cyan-300" },
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = params.q || "";

  // Fetch categories, locations, and latest approved ads
  const [categories, locations, ads] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { advertisements: true },
        },
      },
    }),
    prisma.location.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.advertisement.findMany({
      where: {
        status: "APPROVED",
        ...(query
          ? {
              OR: [
                { title: { contains: query } },
                { description: { contains: query } },
              ],
            }
          : {}),
      },
      include: {
        images: true,
        category: true,
        location: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
    }),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      {/* Hero Section with Mesh Gradient & Capsule Search */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#311496] via-[#431fb8] to-[#5527d4] text-white pt-20 pb-28 px-4 md:px-8">
        {/* Decorative Background Lighting Circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 -right-20 w-96 h-96 bg-violet-400/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-100 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Sri Lanka&apos;s Fastest Growing Classifieds</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] mb-4 max-w-3xl">
            Buy & Sell Anything <br />
            <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
              Faster with QuickSell
            </span>
          </h1>

          <p className="text-indigo-100/90 text-sm sm:text-base mb-10 max-w-xl font-normal leading-relaxed">
            Discover verified cars, mobile phones, laptops, and properties from trusted sellers across Sri Lanka.
          </p>

          {/* Unified Search Capsule Component */}
          <HeroSearch
            categories={categories}
            locations={locations}
            defaultQuery={query}
          />

          {/* Trust Metrics Bar */}
          <div className="mt-12 pt-8 border-t border-white/10 w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-white">100% Free</span>
              <span className="text-[11px] text-indigo-200 font-medium">To Post Ads</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-white">Verified</span>
              <span className="text-[11px] text-indigo-200 font-medium">Local Sellers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-white">25+ Cities</span>
              <span className="text-[11px] text-indigo-200 font-medium">Island-wide Coverage</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-white">Instant Chat</span>
              <span className="text-[11px] text-indigo-200 font-medium">Direct via WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Categories Section */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                Explore
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Browse by Category
              </h2>
            </div>
            <Link
              href="/ads"
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const tint = CATEGORY_TINTS[cat.name] || {
                bg: "bg-indigo-50 text-indigo-600",
                hoverBorder: "group-hover:border-indigo-300",
              };

              return (
                <Link
                  key={cat.id}
                  href={`/ads?category=${cat.id}`}
                  className={`group bg-white border border-slate-200/80 ${tint.hoverBorder} rounded-3xl p-5 flex flex-col items-center text-center shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer relative overflow-hidden`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tint.bg} group-hover:scale-110 transition-transform duration-300 shadow-xs mb-3.5`}
                  >
                    {CATEGORY_ICONS[cat.name] || (
                      <MoreHorizontal className="w-6 h-6 text-indigo-600" />
                    )}
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>

                  <span className="mt-2 text-[10px] font-semibold text-slate-500 bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 px-2.5 py-0.5 rounded-full transition-colors">
                    {cat._count.advertisements} {cat._count.advertisements === 1 ? "ad" : "ads"}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Latest Advertisements Section */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                Fresh Listings
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Latest Advertisements
              </h2>
            </div>
            <Link
              href="/ads"
              className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              <span>See All Ads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {ads.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl p-8">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                No Advertisements Yet
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                Be the first to list an item for sale in your area and get noticed by thousands of eager buyers.
              </p>
              <Link
                href="/ads/create"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-full shadow-md transition-all"
              >
                Post an Advertisement
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-12 mb-20">
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-10 md:p-14 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-xl text-center md:text-left">
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full mb-3">
              Fast & Free
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
              Got something to sell? <br />
              Turn your unused items into cash.
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Post your ad in less than 2 minutes. Reach active buyers across Sri Lanka with zero listing fees.
            </p>
          </div>

          <div className="relative z-10">
            <Link
              href="/ads/create"
              className="bg-white hover:bg-slate-50 text-indigo-700 hover:text-indigo-800 font-extrabold text-sm px-8 py-4 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 tracking-wide"
            >
              <span>Post Your Ad Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dark Footer */}
      <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16 mb-12">
            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-600 rounded-xl p-2 flex items-center justify-center text-white">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <span className="text-xl font-black text-white tracking-tight">
                  QUICKSELL
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Sri Lanka&apos;s trusted classifieds marketplace for buying and selling vehicles, electronics, phones, and real estate.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white text-xs font-extrabold uppercase tracking-widest mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="/" className="hover:text-indigo-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/ads" className="hover:text-indigo-400 transition-colors">
                    Browse All Ads
                  </Link>
                </li>
                <li>
                  <Link href="/ads/create" className="hover:text-indigo-400 transition-colors">
                    Post Free Ad
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-indigo-400 transition-colors">
                    Account Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Safety & Help */}
            <div>
              <h4 className="text-white text-xs font-extrabold uppercase tracking-widest mb-4">
                Help & Safety
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Buyer Safety Tips</span>
                </li>
                <li className="text-slate-400">
                  <span>Meet sellers in public spaces</span>
                </li>
                <li className="text-slate-400">
                  <span>Never transfer money upfront</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white text-xs font-extrabold uppercase tracking-widest mb-4">
                Support
              </h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Colombo, Sri Lanka</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>+94 77 123 4567</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>support@quicksell.lk</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} QuickSell Marketplace. All rights reserved.</p>
            <p>Built with Next.js & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}