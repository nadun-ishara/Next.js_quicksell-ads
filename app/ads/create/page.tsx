import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CreateAdForm from "./CreateAdForm";

export default async function CreateAdPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const locations = await prisma.location.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Advertisement</h1>
      <CreateAdForm categories={categories} locations={locations} />
    </div>
  );
}