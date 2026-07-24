import { z } from "zod";

export const createAdSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be at most 100 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description must be at most 1000 characters" }),

  price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number",
    }),

  categoryId: z
    .string()
    .min(1, { message: "Please select a Category" }),

  locationId: z
    .string()
    .min(1, { message: "Please select a Location" }),

});

export type CreateAdInput = z.infer<typeof createAdSchema>;