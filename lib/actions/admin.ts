"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendAdApprovedEmail, sendAdRejectedEmail } from "@/lib/email";

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

  const updatedAd = await prisma.advertisement.update({
    where: { id: adId },
    data: { status: "APPROVED" },
    include: {
      user: true,
    },
  });

  if (updatedAd.user?.email) {
    await sendAdApprovedEmail(updatedAd.user.email, updatedAd.title);
  }
  revalidatePath("/admin");
}

export async function rejectAdAction(formData: FormData) {
  if (!(await isModerator())) {
    throw new Error("Unauthorized");
  }

  const adId = formData.get("adId") as string;
  const reason = (formData.get("reason") as string) // "doesn't meet our content";
  if (!adId) return;

  const updatedAd = await prisma.advertisement.update({
    where: { id: adId },
    data: { status: "REJECTED" },
    include: {
      user: true,
    },
  });

  if (updatedAd.user?.email) {
    await sendAdRejectedEmail(updatedAd.user.email, updatedAd.title, reason);
  }

  revalidatePath("/admin");
}