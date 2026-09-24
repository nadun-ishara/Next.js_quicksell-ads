"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAdSchema } from "@/lib/validations/ad";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function createAdAction(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      error: "You must be logged in to post an advertisement.",
    };
  }

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    phone: formData.get("phone"),
    condition: formData.get("condition"),
    isNegotiable: formData.get("isNegotiable"),
    categoryId: formData.get("categoryId"),
    locationId: formData.get("locationId"),
  };

  const validation = createAdSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const images = formData.getAll("images") as File[];
  const validImages = images.filter((img) => img.size > 0 && img.name !== "undefined");

  if (validImages.length === 0) {
    return {
      error: "Please upload at least 1 image.",
    };
  }

  if (validImages.length > 4) {
    return {
      error: "You can only upload a maximum of 4 images.",
    };
  }

  const { title, description, price, phone, condition, isNegotiable, categoryId, locationId } = validation.data;

  let savedImageUrls: string[] = [];

  try {
    const uploadPromises = validImages.map((file) => uploadToCloudinary(file));
    savedImageUrls = await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return {
      error: "Failed to upload images. Please try again.",
    };
  }

  try {
    await prisma.advertisement.create({
      data: {
        userId: session.user.id,
        title,
        description,
        price: parseFloat(price),
        phone,
        condition,
        isNegotiable,
        categoryId,
        locationId,
        status: "PENDING",
        images: {
          create: savedImageUrls.map((url, index) => ({
            filePath: url,
            isPrimary: index === 0,
          })),
        },
      },
    });

    // Update user's default phone if they don't have one
    await prisma.user.update({
      where: { id: session.user.id },
      data: { phone },
    }).catch(() => {});
  } catch (error) {
    console.error("DB Error:", error);
    return {
      error: "Failed to post ad. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateAdAction(adId: string, prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      error: "You must be logged in to update an advertisement.",
    };
  }

  const existingAd = await prisma.advertisement.findUnique({
    where: { id: adId },
    include: { images: true },
  });

  if (!existingAd || existingAd.userId !== session.user.id) {
    return { error: "Ad not found or unauthorized." };
  }

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    phone: formData.get("phone"),
    condition: formData.get("condition"),
    isNegotiable: formData.get("isNegotiable"),
    categoryId: formData.get("categoryId"),
    locationId: formData.get("locationId"),
  };

  const validation = createAdSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const images = formData.getAll("images") as File[];
  const validImages = images.filter((img) => img.size > 0 && img.name !== "undefined");

  if (validImages.length > 4) {
    return {
      error: "You can only upload a maximum of 4 images.",
    };
  }

  const { title, description, price, phone, condition, isNegotiable, categoryId, locationId } = validation.data;

  let updateData: any = {
    title,
    description,
    price: parseFloat(price),
    phone,
    condition,
    isNegotiable,
    categoryId,
    locationId,
    status: "PENDING", // require re-approve
  };

  if (validImages.length > 0) {
    let savedImageUrls: string[] = [];
    try {
      const uploadPromises = validImages.map((file) => uploadToCloudinary(file));
      savedImageUrls = await Promise.all(uploadPromises);
      
      updateData.images = {
        deleteMany: {},
        create: savedImageUrls.map((url, index) => ({
          filePath: url,
          isPrimary: index === 0,
        })),
      };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return {
        error: "Failed to upload images. Please try again.",
      };
    }
  }

  try {
    await prisma.advertisement.update({
      where: { id: adId },
      data: updateData,
    });
  } catch (error) {
    console.error("DB Error:", error);
    return {
      error: "Failed to update ad. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteAdAction(adId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      error: "You must be logged in to delete an advertisement.",
    };
  }

  const ad = await prisma.advertisement.findUnique({
    where: { id: adId },
  });

  if (!ad) {
    return { error: "Ad not found." };
  }

  if (ad.userId !== session.user.id) {
    return { error: "Unauthorized." };
  }

  try {
    await prisma.advertisement.delete({
      where: { id: adId },
    });
  } catch (error) {
    console.error("DB Error:", error);
    return { error: "Failed to delete ad. Please try again." };
  }

  revalidatePath("/dashboard");
}

export async function toggleAdSoldAction(adId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const ad = await prisma.advertisement.findUnique({
    where: { id: adId },
  });

  if (!ad) {
    return { error: "Ad not found." };
  }

  if (ad.userId !== session.user.id) {
    return { error: "Unauthorized." };
  }

  const nextSold = !ad.isSold;

  await prisma.advertisement.update({
    where: { id: adId },
    data: {
      isSold: nextSold,
      ...(nextSold ? { isReserved: false } : {}),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/ads");
  revalidatePath(`/ads/${adId}`);

  return { success: true, isSold: nextSold };
}

export async function toggleAdReservedAction(adId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const ad = await prisma.advertisement.findUnique({
    where: { id: adId },
  });

  if (!ad) {
    return { error: "Ad not found." };
  }

  if (ad.userId !== session.user.id) {
    return { error: "Unauthorized." };
  }

  const nextReserved = !ad.isReserved;

  await prisma.advertisement.update({
    where: { id: adId },
    data: {
      isReserved: nextReserved,
      ...(nextReserved ? { isSold: false } : {}),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/ads");
  revalidatePath(`/ads/${adId}`);

  return { success: true, isReserved: nextReserved };
}

export async function getSavedAdsAction(adIds: string[]) {
  if (!adIds || adIds.length === 0) {
    return [];
  }

  try {
    const ads = await prisma.advertisement.findMany({
      where: {
        id: { in: adIds },
        status: "APPROVED",
      },
      include: {
        images: true,
        category: true,
        location: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return ads.map((ad) => ({
      ...ad,
      price: Number(ad.price),
    }));
  } catch (error) {
    console.error("Error fetching saved ads:", error);
    return [];
  }
}