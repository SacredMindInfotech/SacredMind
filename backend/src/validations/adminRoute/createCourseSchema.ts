import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  imageUrl: z.string().url("Invalid image URL").optional(),
  categoryId: z.coerce.number().int().positive("Invalid category ID"),
});

