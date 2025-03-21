import { Request, Response } from "express";
import prisma from "../../PrismaClient";

export const getAllCoursesController = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        category: true
      }
    });
    if (!courses) {
      res.status(404).json({ error: "No courses found" });
      return;
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

export const getCourseByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        modules: {
          orderBy: { serialNumber: "asc" },
          include: {
            topics: {
              orderBy: { serialNumber: "asc" },
              include: {
                contents: true,
              },
            },
          },
        },
      },
    });
    if (!course) {
      res.status(204).json({ "message": "Course not found" });
      return;
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};