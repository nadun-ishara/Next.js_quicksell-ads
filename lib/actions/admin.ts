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

export async function createCategoryAction(formData: FormData) {
  if (!(await isModerator())) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const parentId = formData.get("parentId") as string;

  if (!name) return { error: "Name is required" };

  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  await prisma.category.create({
    data: {
      name,
      slug,
      parentId: parentId || null
    }
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteCategoryAction(categoryId: string) {
  if (!(await isModerator())) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId }
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete category (it may have child elements)" };
  }
}