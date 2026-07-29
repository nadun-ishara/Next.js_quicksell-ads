import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { approveAdAction, rejectAdAction } from "@/lib/actions/admin";
import CategoryManager from "./_components/CategoryManager";

interface AdminPanelPageProps {
  searchParams: Promise<{
    status?: string;
    tab?: string;
  }>;
}

export default async function AdminPanelPage({ searchParams }: AdminPanelPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "MODERATOR") {
    redirect("/");
  }

  const resolvedParams = await searchParams;
  const currentStatus = resolvedParams.tab || resolvedParams.status || "PENDING";

  let ads: any[] = [];
  let categories: any[] = [];

  if (currentStatus === "CATEGORIES") {
    categories = await prisma.category.findMany({
      include: {
        parent: true,
        children: true,
      },
      orderBy: { name: "asc" },
    });
  } else {
    const whereClause: any = {};
    if (currentStatus !== "ALL") {
      whereClause.status = currentStatus;
    }

    ads = await prisma.advertisement.findMany({
      where: whereClause,
      include: {
        images: true,
        category: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

 //admin tabs 
  const tabs = ["PENDING", "APPROVED", "REJECTED", "ALL"];

  return (
    <div className="min-h-screen bg-white font-sans pb-12">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 mt-12">
        {currentStatus === "CATEGORIES" ? (
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900">Manage Categories</h1>
            <p className="text-slate-500 mt-2">Create and organize advertisement categories.</p>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
              <p className="text-slate-500 mt-2">Manage all advertisements.</p>
            </div>

            {/* tabs */}
            <div className="flex gap-8 mb-8 border-b border-slate-200">
              {tabs.map((tab) => (
                <Link
                  key={tab}
                  href={`/admin?tab=${tab}`}
                  className={`pb-4 text-sm font-medium transition-colors ${currentStatus === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-slate-500 hover:text-slate-900"
                    }`}
                >
                  {tab === "ALL" ? "All Ads" : `${tab.charAt(0) + tab.slice(1).toLowerCase()} Ads`}
                </Link>
              ))}
            </div>
          </>
        )}

        <div>
          {currentStatus === "CATEGORIES" ? (
            <CategoryManager categories={categories} />
          ) : ads.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-slate-500 text-lg">No advertisements found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-4 px-6 font-semibold text-xs tracking-wider uppercase text-left w-24">Image</th>
                    <th className="py-4 px-6 font-semibold text-xs tracking-wider uppercase text-left">Title</th>
                    <th className="py-4 px-6 font-semibold text-xs tracking-wider uppercase text-left whitespace-nowrap">Price</th>
                    <th className="py-4 px-6 font-semibold text-xs tracking-wider uppercase text-left whitespace-nowrap">Date</th>
                    {currentStatus !== "PENDING" && (
                      <th className="py-4 px-6 font-semibold text-xs tracking-wider uppercase text-center w-40">Status</th>
                    )}
                    <th className="py-4 px-6 font-semibold text-xs tracking-wider uppercase text-left">User</th>
                    {currentStatus === "PENDING" && (
                      <th className="py-4 px-6 font-semibold text-xs tracking-wider uppercase text-right w-48">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ads.map((ad) => {
                    const primaryImage =
                      ad.images.find((img: any) => img.isPrimary)?.filePath ||
                      "/images/placeholder.jpg";

                    return (
                      <tr key={ad.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 align-middle text-left w-24">
                          <img
                            src={primaryImage}
                            alt={ad.title}
                            className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                          />
                        </td>
                        <td className="py-4 px-6 align-middle text-left">
                          <Link
                            href={`/ads/${ad.id}`}
                            className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                          >
                            {ad.title}
                          </Link>
                        </td>
                        <td className="py-4 px-6 align-middle text-left whitespace-nowrap">
                          <span className="text-sm font-medium text-slate-700">LKR {Number(ad.price).toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-6 align-middle text-left whitespace-nowrap">
                          <span className="text-sm text-slate-500">{new Date(ad.createdAt).toLocaleDateString()}</span>
                        </td>
                        {currentStatus !== "PENDING" && (
                          <td className="py-4 px-6 align-middle text-center w-40">
                            <span className={`inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${ad.status === "APPROVED" ? "bg-green-50 border-green-200 text-green-700" :
                                ad.status === "REJECTED" ? "bg-red-50 border-red-200 text-red-700" :
                                  "bg-amber-50 border-amber-200 text-amber-700"
                              }`}>
                              {ad.status}
                            </span>
                          </td>
                        )}
                        <td className="py-4 px-6 align-middle text-left">
                          <div className="text-sm font-semibold text-slate-900">{ad.user.name || "Unknown"}</div>
                          <div className="text-sm text-slate-500">{ad.user.email}</div>
                        </td>
                        {currentStatus === "PENDING" && (
                          <td className="py-4 px-6 align-middle text-right w-48">
                            <div className="flex items-center justify-end gap-3">
                              {ad.status !== "APPROVED" && (
                                <form action={approveAdAction}>
                                  <input type="hidden" name="adId" value={ad.id} />
                                  <button
                                    type="submit"
                                    className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-green-50 border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                </form>
                              )}
                              {ad.status !== "REJECTED" && (
                                <form action={rejectAdAction}>
                                  <input type="hidden" name="adId" value={ad.id} />
                                  <button
                                    type="submit"
                                    className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </form>
                              )}
                            </div>
                          </td>
                        )}
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