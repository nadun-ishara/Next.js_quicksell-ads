import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import EditAdForm from "./EditAdForm";
import Navbar from "@/components/Navbar";

export default async function EditAdPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callbackUrl=/ads/${params.id}/edit`);
  }

  const ad = await prisma.advertisement.findUnique({
    where: { id: params.id },
    include: {
      images: true,
    }
  });

  if (!ad) {
    notFound();
  }

  if (ad.userId !== session.user.id) {
    redirect("/dashboard");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  const serializedAd = {
    ...ad,
    price: ad.price.toNumber()
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-indigo-600 py-6 px-8 text-center">
            <h1 className="text-xl font-extrabold text-white tracking-wider uppercase mb-1">
              EDIT ADVERTISEMENT
            </h1>
            <p className="text-indigo-100 text-xs font-medium">
              Update the details of your advertisement below.
            </p>
          </div>
          
          {/* Form Container */}
          <div className="p-0">
            <EditAdForm categories={categories} locations={locations} ad={serializedAd} />
          </div>
        </div>
      </main>
    </div>
  );
}
