"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAdSchema } from "@/lib/validations/ad";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
    categoryId: formData.get("categoryId"),
    locationId: formData.get("locationId"),
    imageUrl: formData.get("imageUrl") || "/images/placeholder.jpg",
  };

  const validation = createAdSchema.safeParse(rawData);
  
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { title, description, price, categoryId, locationId, imageUrl } = validation.data;

  try {
    await prisma.advertisement.create({
      data: {
        userId: session.user.id,
        title,
        description,
        price: parseFloat(price),
        categoryId,
        locationId,
        status: "PENDING",
        images: {
          create: [
            {
              filePath: imageUrl || "/images/placeholder.jpg",
              isPrimary: true,
            },
          ],
        },
      },
    });
  } catch (error) {
    console.error("DB Error:", error);
    return {
      error: "Failed to post ad. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/");
}