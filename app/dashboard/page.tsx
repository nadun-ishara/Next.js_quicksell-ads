import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Calendar, Tag, CheckCircle2, Clock, XCircle, TrendingUp, Check, Layers, DollarSign } from "lucide-react";
import AdActions from "./_components/AdActions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // Fetch advertisements for the logged in user
  const userAds = await prisma.advertisement.findMany({
    where: { userId: (session.user as any).id },
    include: {
      images: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalAds = userAds.length;
  const approvedAds = userAds.filter((ad) => ad.status === "APPROVED" && !ad.isSold).length;
  const soldAds = userAds.filter((ad) => ad.isSold).length;
  const pendingAds = userAds.filter((ad) => ad.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 pb-16 transition-colors">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              My Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Manage your uploaded listings, check moderation status, and update item availability.
            </p>
          </div>
          <Link
            href="/ads/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-extrabold px-5 py-3 rounded-full transition shadow-md hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider self-start sm:self-auto"
          >
            <Tag className="w-4 h-4" />
            <span>Post New Ad</span>
          </Link>
        </div>

        {/* Dashboard KPI Metric Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Total Listings</span>
              <Layers className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {totalAds}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Active Live</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {approvedAds}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Pending Review</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
              {pendingAds}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Sold Items</span>
              <TrendingUp className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
              {soldAds}
            </div>
          </div>
        </div>

        {/* Listings Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          {userAds.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                <Tag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 tracking-wider uppercase mb-1">
                NO ADS YET!
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
                You haven't posted any advertisements yet.
              </p>
              <Link
                href="/ads/create"
                className="bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-bold px-6 py-3 rounded-xl transition uppercase tracking-wider"
              >
                Post Your First Ad
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800">
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Advertisement Details
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                      Status
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                      Price
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {userAds.map((ad) => {
                    const primaryImage =
                      ad.images.find((img) => img.isPrimary)?.filePath ||
                      (ad.images.length > 0 ? ad.images[0].filePath : "/images/placeholder.jpg");

                    return (
                      <tr
                        key={ad.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-4 px-6 align-middle w-32">
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex-shrink-0">
                            <img
                              src={primaryImage}
                              alt={ad.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6 align-middle">
                          <div className="flex flex-col justify-center">
                            <div>
                              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mb-1 block">
                                {ad.category.name}
                              </span>
                              <Link
                                href={`/ads/${ad.id}`}
                                className="text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
                              >
                                {ad.title}
                              </Link>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-2">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(ad.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 align-middle">
                          <div className="flex flex-col gap-1.5 items-center">
                            {/* Moderation Status */}
                            {ad.status === "APPROVED" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-green-50 dark:bg-green-950/60 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-200 dark:border-green-900/60 whitespace-nowrap">
                                <CheckCircle2 className="w-3 h-3" />
                                Approved
                              </span>
                            )}
                            {ad.status === "PENDING" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-900/60 whitespace-nowrap">
                                <Clock className="w-3 h-3" />
                                In Review
                              </span>
                            )}
                            {ad.status === "REJECTED" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-200 dark:border-red-900/60 whitespace-nowrap">
                                <XCircle className="w-3 h-3" />
                                Rejected
                              </span>
                            )}

                            {/* Sale Status */}
                            {ad.isSold ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white tracking-wider shadow-xs">
                                Sold Out
                              </span>
                            ) : ad.isReserved ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-slate-950 tracking-wider shadow-xs">
                                Reserved
                              </span>
                            ) : (
                              ad.status === "APPROVED" && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 tracking-wider">
                                  Available
                                </span>
                              )
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 align-middle text-right">
                          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                            LKR {Number(ad.price).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-6 align-middle">
                          <AdActions adId={ad.id} isSold={ad.isSold} isReserved={ad.isReserved} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
