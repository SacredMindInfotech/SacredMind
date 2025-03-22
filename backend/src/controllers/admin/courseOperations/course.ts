import { Request, Response } from "express";
import prisma from "../../../PrismaClient";
import { createCourseSchema } from "../../../validations/adminRoute/createCourseSchema";
import { updateCourseSchema } from "../../../validations/adminRoute/updateCourseSchema";

export const createCourseController = async (req: Request, res: Response) => {
  try {
    const validatedData = createCourseSchema.safeParse(req.body);
    if (!validatedData.success) {
      res.status(400).json({ error: validatedData.error.errors });
      return;
    }

    // Destructure after validation
    const { title, description, price, imageUrl, categoryId, published, overview, learningOutcomes, requirements, forwhom, language } =
      validatedData.data;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        imageUrl,
        category: {
          connect: { id: categoryId },
        },
        published,
        overview,
        learningOutcomes,
        requirements,
        forwhom,
        language,
      },
    });

    res.status(201).json(course);
    return;
  } catch (e: any) {
    console.error(e);

    if (e.code === "P2002") {
      res.status(400).json({ error: "Course title already exists" });
      return;
    }

    if (e.code === "P2025") {
      res.status(400).json({ error: "Invalid category ID" });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const updateCourseByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Course ID is required" });
      return;
    }

    const validatedData = updateCourseSchema.safeParse(req.body);

    if (!validatedData.success) {
      res.status(400).json({ error: validatedData.error.errors });
      return;
    }

    const { title, description, price, imageUrl, categoryId, published,overview,learningOutcomes,requirements,forwhom,language,isActive,showCourseNotice,courseNotice } =
      validatedData.data;

    // update data object with only provided fields
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (categoryId) {
      updateData.category = { connect: { id: Number(categoryId) } };
    }
    if (typeof published !== "undefined") updateData.published = published;
    if (typeof isActive !== "undefined") updateData.isActive = isActive;
    if (typeof showCourseNotice !== "undefined") updateData.showCourseNotice = showCourseNotice;
    if (overview) updateData.overview = overview;
    if (learningOutcomes) updateData.learningOutcomes = learningOutcomes;
    if (requirements) updateData.requirements = requirements;
    if (forwhom) updateData.forwhom = forwhom;
    if (language) updateData.language = language;
    if (courseNotice) updateData.courseNotice = courseNotice;


    const updatedCourse = await prisma.course.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.status(200).json(updatedCourse);
    return;
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Category or course not found" });
      return;
    }

    if (error.code === "P2002") {
      res.status(400).json({ error: "Course title already exists" });
      return;
    }

    if (error.code === "P2003") {
      res.status(400).json({ error: "Invalid category ID" });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const deleteCourseByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Course ID is required" });
      return;
    }

    await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Course deleted successfully" });
    return;
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2025") {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
