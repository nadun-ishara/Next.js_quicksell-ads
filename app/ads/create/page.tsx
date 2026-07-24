import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CreateAdForm from "./CreateAdForm";
import Navbar from "@/components/Navbar";

export default async function CreateAdPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/ads/create");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-indigo-600 py-6 px-8 text-center">
            <h1 className="text-xl font-extrabold text-white tracking-wider uppercase mb-1">
              POST YOUR ADVERTISEMENT
            </h1>
            <p className="text-indigo-100 text-xs font-medium">
              Fill in the details below to reach thousands of buyers.
            </p>
          </div>
          
          {/* Form Container */}
          <div className="p-0">
            <CreateAdForm categories={categories} locations={locations} />
          </div>
        </div>
      </main>
    </div>
  );
}