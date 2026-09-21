import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import AdGallery from "@/components/AdGallery";
import AdContactActions from "@/components/AdContactActions";
import {
  Calendar,
  MapPin,
  Tag,
  User as UserIcon,
  ShieldCheck,
  ChevronRight,
  Clock,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface AdPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdPage({ params }: AdPageProps) {
  const resolvedParams = await params;

  const ad = await prisma.advertisement.findUnique({
    where: { id: resolvedParams.id },
    include: {
      images: true,
      category: true,
      location: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      },
    },
  });

  if (!ad) {
    notFound();
  }

  const formattedPrice = Number(ad.price).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const memberYear = new Date(ad.user.createdAt).getFullYear();
  const postedDate = new Date(ad.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        {/* Navigation Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link
            href="/"
            className="hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href={`/ads?category=${ad.category.id}`}
            className="hover:text-indigo-600 transition-colors"
          >
            {ad.category.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold truncate max-w-xs md:max-w-md">
            {ad.title}
          </span>
        </div>

        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/ads"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all advertisements</span>
          </Link>
        </div>

        {/* Two-Column Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Main Column: Gallery & Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Image Gallery Component */}
            <AdGallery images={ad.images} title={ad.title} />

            {/* Main Content Details Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-8 space-y-6">
              {/* Header Title & Price */}
              <div className="border-b border-slate-100 pb-6">
                {/* Meta Pills */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {ad.category.name}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-500" />
                    {ad.location.name}
                  </span>
                  <span className="bg-slate-100 text-slate-500 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {postedDate}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {ad.title}
                </h1>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-sm font-black text-indigo-600 uppercase tracking-wide">
                    LKR
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {formattedPrice}
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div>
                <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                  Description
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {ad.description}
                </div>
              </div>

              {/* Ad Specifications / Attributes */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">
                  Overview Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Category
                    </span>
                    <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                      {ad.category.name}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Location
                    </span>
                    <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                      {ad.location.name}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Status
                    </span>
                    <span className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Seller Profile, Contact Actions & Safety */}
          <div className="space-y-6">
            {/* Seller Contact Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 block">
                Seller Information
              </span>

              {/* Seller Avatar & Name */}
              <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-lg overflow-hidden shadow-sm shrink-0">
                  {ad.user.image ? (
                    <img
                      src={ad.user.image}
                      alt={ad.user.name || "Seller"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {(ad.user.name || ad.user.email || "S")[0].toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-base truncate">
                    {ad.user.name || "Verified Seller"}
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">
                    Member since {memberYear}
                  </div>
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified User
                  </div>
                </div>
              </div>

              {/* Interactive Contact Actions Component */}
              <AdContactActions
                adId={ad.id}
                adTitle={ad.title}
                sellerName={ad.user.name || "Seller"}
                sellerEmail={ad.user.email}
              />
            </div>

            {/* Safety Tips Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200/70 p-6 shadow-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Safety Guidelines</span>
              </div>
              <ul className="text-xs text-amber-900/80 space-y-2.5 pl-1 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Meet the seller in person in a safe, public location.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Carefully inspect the item before finalizing payment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>Never wire or transfer money in advance.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
