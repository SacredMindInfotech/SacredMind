import { Request, Response } from "express";
import prisma from "../../PrismaClient";

//this will return only parent categories
export const getParentCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
      },
    });
    if (!categories) {
      res.status(400).json({ error: "Failed to get categories" });
      return;
    }
    if (categories.length === 0) {
      res.status(404).json({ error: "No categories found" });
      return;
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//this will return all categories including subcategories
export const getCategoryByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { name: id },
      include: {
        subcategories: true,
      },
    });
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


//this will return all courses of a sub-category
export const getCoursesByCategoryIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Category ID is required" });
      return;
    }
    const courses = await prisma.course.findMany({
      where: {
        categoryId: parseInt(id),
      },
      include: {
        category: true,
      },
    });

    if (courses.length === 0) {
      res.status(204).json({ "Message": "No courses found" });
      return;
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};