import { z } from "zod";

export const AD_CONDITIONS = [
  { value: "BRAND_NEW", label: "Brand New", description: "Unopened or never used" },
  { value: "LIKE_NEW", label: "Like New", description: "Used very little, in mint condition" },
  { value: "USED", label: "Used", description: "Normal wear, fully functional" },
  { value: "FOR_PARTS", label: "For Parts", description: "Needs repair or for parts" },
] as const;

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

  phone: z
    .string()
    .min(7, { message: "Please enter a valid phone number (at least 7 digits)" })
    .max(25, { message: "Phone number is too long" }),

  condition: z
    .enum(["BRAND_NEW", "LIKE_NEW", "USED", "FOR_PARTS"])
    .default("USED"),

  isNegotiable: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => val === true || val === "true" || val === "on"),

  categoryId: z
    .string()
    .min(1, { message: "Please select a Category" }),

  locationId: z
    .string()
    .min(1, { message: "Please select a Location" }),
});

export type CreateAdInput = z.infer<typeof createAdSchema>;