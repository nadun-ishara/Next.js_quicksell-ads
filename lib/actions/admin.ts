"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function isModerator() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === "MODERATOR";
}

export async function approveAdAction(formData: FormData) {
  if (!(await isModerator())) {
    throw new Error("Unauthorized");
  }

  const adId = formData.get("adId") as string;
  if (!adId) return;

  await prisma.advertisement.update({
    where: { id: adId },
    data: { status: "APPROVED" },
  });

  revalidatePath("/admin");
}

export async function rejectAdAction(formData: FormData) {
  if (!(await isModerator())) {
    throw new Error("Unauthorized");
  }

  const adId = formData.get("adId") as string;
  if (!adId) return;

  await prisma.advertisement.update({
    where: { id: adId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin");
}
