"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAdSchema } from "@/lib/validations/ad";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

  const { title, description, price, categoryId, locationId } = validation.data;
  
  const savedImagePaths: string[] = [];

  try {
    const uploadDir = path.join(process.cwd(), "public/uploads/ads");
    await mkdir(uploadDir, { recursive: true });

    for (const file of validImages) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      
      savedImagePaths.push(`/uploads/ads/${filename}`);
    }
  } catch (error) {
    console.error("File Save Error:", error);
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
        categoryId,
        locationId,
        status: "PENDING",
        images: {
          create: savedImagePaths.map((filePath, index) => ({
            filePath,
            isPrimary: index === 0, // First uploaded image is primary
          })),
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
  redirect("/dashboard");
}