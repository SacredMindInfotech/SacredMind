import { Request, Response } from "express";
import prisma from "../../../PrismaClient";
import { createCategorySchema } from "../../../validations/adminRoute/createCategorySchema";
import { updateCategorySchema } from "../../../validations/adminRoute/updateCategorySchema";

export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const validatedData = createCategorySchema.safeParse(req.body);
    if (!validatedData.success) {
      res.status(400).json({ error: validatedData.error.errors });
      return;
    }
    const { name, parentId } = validatedData.data;

    const existingCategory = await prisma.category.findUnique({
      where: {
        name,
      },
    });
    if (existingCategory) {
      res.status(400).json({ error: "Category already exists" });
      return;
    }
    const category = await prisma.category.create({
      data: {
        name,
        parentId: parentId ? parentId : null,
      },
    });
    if (!category) {
      res.status(400).json({ error: "Failed to create category" });
      return;
    }
    res.status(201).json(category);
  } catch (error) {}
};

export const updateCategoryByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = updateCategorySchema.safeParse(req.body);
    if (!validatedData.success) {
      res.status(400).json({ error: validatedData.error.errors });
      return;
    }

    const { id } = req.params;
    const { name, parentId } = validatedData.data;

    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: { name, parentId: parentId ? parentId : null },
    });

    if (!category) {
      res.status(400).json({ error: "Failed to update category" });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategoryByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingCategory) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    const subcategories = await prisma.category.findMany({
      where: {
        parentId: parseInt(id),
      },
    });
    if (subcategories.length > 0) {
      await prisma.category.updateMany({
        where: {
          parentId: parseInt(id),
        },
        data: {
          parentId: null,
        },
      });
    }

    const category = await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!category) {
      res.status(400).json({ error: "Failed to delete category" });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
