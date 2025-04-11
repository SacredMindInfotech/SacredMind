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
      orderBy: {
        id: "asc",
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
    return;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

//this will return all categories including subcategories
export const getCategoryByNameController = async (
  req: Request,
  res: Response
) => {
  try {
    const { categoryName } = req.params;
    const allCategories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    const category = allCategories.find(
      (cat) => cat.name.toLowerCase() === categoryName
    );
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json(category);
    return;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

//this will return all courses of a sub-category
export const getCoursesByCategoryIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      res.status(400).json({ error: "Category ID is required" });
      return;
    }
    const courses = await prisma.course.findMany({
      where: {
        categoryId: parseInt(categoryId),
      },
      include: {
        category: true,
      },
    });

    // if (courses.length === 0) {
    //   res.status(204).json({ "Message": "No courses found" });
    //   return;
    // }
    res.status(200).json(courses);
    return;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const getOnlySubcategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: { not: null } },
    });
    if (!categories) {
      res.status(400).json({ error: "Failed to get categories" });
      return;
    }
    if (categories.length === 0) {
      res.status(204).json({ Message: "No subcategories found" });
      return;
    }
    res.status(200).json(categories);
    return;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
