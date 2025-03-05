import { z } from "zod";

export const updateCategorySchema = z
  .object({
    name: z
      .string()
      .min(1, "Name of the category is required and it should be unique")
      .optional(),
    parentId: z.coerce
      .number()
      .int()
      .positive("Invalid category ID")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });
