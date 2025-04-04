import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  published: z.boolean().optional(),
  isActive: z.boolean().optional(),
  categoryId: z.coerce.number().int().positive("Invalid category ID"),
  overview: z.array(z.string()).optional(),
  learningOutcomes: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  forwhom: z.array(z.string()).optional(),
  language: z.string().optional(),
});
