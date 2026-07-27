import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Calendar, MapPin, Tag, User, ShieldAlert } from "lucide-react";
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

  const primaryImage =
    ad.images.find((img) => img.isPrimary)?.filePath ||
    (ad.images.length > 0 ? ad.images[0].filePath : "/images/placeholder.jpg");

  const otherImages = ad.images.filter((img) => img.filePath !== primaryImage);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 mt-8">
        <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="hover:text-slate-900 transition-colors cursor-pointer">{ad.category.name}</span>
          <span>/</span>
          <span className="text-slate-900 font-medium line-clamp-1">{ad.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* images and details */}
          <div className="lg:col-span-2 space-y-8">

            {/* images */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden p-2">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={primaryImage}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {otherImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {otherImages.map((img) => (
                    <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer">
                      <img
                        src={img.filePath}
                        alt={`${ad.title} secondary`}
                        className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* main content */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                    {ad.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {ad.location.name}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      {ad.category.name}
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-black text-indigo-600 whitespace-nowrap">
                  LKR {Number(ad.price).toLocaleString()}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Description</h2>
                <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
                  {ad.description}
                </div>
              </div>
            </div>
          </div>

          {/*seller details */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Seller Information
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden flex-shrink-0">
                  {ad.user.image ? (
                    <img src={ad.user.image} alt={ad.user.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg">
                    {ad.user.name || "Unknown User"}
                  </div>
                  <div className="text-sm text-slate-500">
                    Member since {new Date(ad.user.createdAt).getFullYear()}
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mb-3">
                Contact Seller
              </button>
              <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200">
                Show Phone Number
              </button>
            </div>

            <div className="bg-amber-50 rounded-3xl border border-amber-200 p-6">
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Safety Tips
              </h3>
              <ul className="text-sm text-amber-800 space-y-2 list-disc pl-4">
                <li>Meet in a safe public place.</li>
                <li>Check the item before you buy.</li>
                <li>Pay only after collecting the item.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


