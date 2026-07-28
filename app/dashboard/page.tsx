import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag, CheckCircle2, Clock, XCircle } from "lucide-react";
import AdActions from "./_components/AdActions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // Fetch advertisements for the logged in user
  const userAds = await prisma.advertisement.findMany({
    where: { userId: session.user.id },
    include: {
      images: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              My Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your uploaded advertisements
            </p>
          </div>
          <Link
            href="/ads/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-md uppercase tracking-wider"
          >
            Post New Ad
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {userAds.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <Tag className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-400 tracking-wider uppercase mb-1">
                NO ADS YET!
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                You haven't posted any advertisements yet.
              </p>
              <Link
                href="/ads/create"
                className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold px-6 py-3 rounded-xl transition uppercase tracking-wider"
              >
                Post Your First Ad
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Advertisement Details
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                      Status
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                      Price
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {userAds.map((ad) => {
                    const primaryImage =
                      ad.images.find((img) => img.isPrimary)?.filePath ||
                      "/images/placeholder.jpg";

                    return (
                      <tr
                        key={ad.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="py-4 px-6 align-middle w-32">
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
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
                              <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-1 block">
                                {ad.category.name}
                              </span>
                              <Link
                                href={`/ads/${ad.id}`}
                                className="text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1"
                              >
                                {ad.title}
                              </Link>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(ad.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 align-middle">
                          {ad.status === "APPROVED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-[11px] font-bold uppercase tracking-wider border border-green-200 whitespace-nowrap">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approved
                            </span>
                          )}
                          {ad.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[11px] font-bold uppercase tracking-wider border border-amber-200 whitespace-nowrap">
                              <Clock className="w-3.5 h-3.5" />
                              Pending
                            </span>
                          )}
                          {ad.status === "REJECTED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-[11px] font-bold uppercase tracking-wider border border-red-200 whitespace-nowrap">
                              <XCircle className="w-3.5 h-3.5" />
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 align-middle text-right">
                          <span className="text-sm font-extrabold text-slate-800 whitespace-nowrap">
                            LKR {Number(ad.price).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-6 align-middle">
                          <AdActions adId={ad.id} />
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
