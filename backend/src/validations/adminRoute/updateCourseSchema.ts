import { z } from "zod";

export const updateCourseSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").optional(),
    description: z.string().min(10, "Description must be at least 10 characters").optional(),
    price: z.coerce.number().min(0, "Price must be a positive number").optional(),
    imageUrl: z.string().url("Invalid image URL").optional(),
    categoryId: z.coerce.number().int().positive("Invalid category ID").optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });