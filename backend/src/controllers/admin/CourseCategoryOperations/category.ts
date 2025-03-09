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

  
    const category = await prisma.category.create({
      data: {
        name,
        parentId: parentId ? parentId : null,
      },
    });

    res.status(201).json(category);
    return;
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(400).json({ error: "Category already exists" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
    return;
  }
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

    const isCategoryExists = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!isCategoryExists) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: { name, parentId: parentId ? parentId : null },
    });

    if (!category) {
      res.status(400).json({ error: "Failed to update category" });
      return;
    }
    res.status(200).json(category);
    return; 
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const deleteCategoryByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.category.findUnique({
      where: { id: Number(id) },
    });
    if (!existingCategory) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    const isConnectedToCourse = await prisma.course.findFirst({
      where: {
        categoryId: Number(id),
      },
    });

    if (isConnectedToCourse) {
      res.status(400).json({ error: "Category is connected to a course" });
      return;
    }

    const subcategories = await prisma.category.findMany({
      where: {
        parentId: Number(id),
      },
    });

    if (subcategories.length > 0) {
      res.status(400).json({ error: "Category has subcategories" });
      return;
    }

    const category = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      res.status(400).json({ error: "Failed to delete category" });
      return;
    }
    res.status(200).json(category);
    return;
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
