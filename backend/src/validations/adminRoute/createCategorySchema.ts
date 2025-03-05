import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name of the category is required and it should be unique"),
  parentId: z.coerce.number().int().positive("Invalid category ID").optional(),
});

