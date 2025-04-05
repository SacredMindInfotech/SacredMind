import { Request, Response } from "express";
import prisma from "../../PrismaClient";

export const getAllCoursesController = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        category: true,
      },
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

export const getPopularCoursesController = async (
  req: Request,
  res: Response
) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        category: true,
        users: true,
        _count: {
          select: { users: true },
        },
      },
      orderBy: {
        users: {
          _count: "desc",
        },
      },
      take: 10, // Limit to top 10 popular courses
    });

    if (!courses || courses.length === 0) {
      res.status(404).json({ error: "No courses found" });
      return;
    }

    // Format the response to include enrollment count
    const formattedCourses = courses.map((course) => ({
      ...course,
      enrollmentCount: course._count.users,
      // Remove the users array to avoid sending unnecessary data
      users: undefined,
      _count: undefined,
    }));

    res.status(200).json(formattedCourses);
  } catch (error) {
    console.error("Error fetching popular courses:", error);
    res.status(500).json({ error: "Failed to fetch popular courses" });
  }
};

export const getCourseByIdController = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
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
      res.status(204).json({ message: "Course not found" });
      return;
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getModulesByCourseIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { courseId } = req.params;
    const modules = await prisma.module.findMany({
      where: { courseId: Number(courseId) },
      include: {
        topics: {
          include: {
            contents: true,
          },
          orderBy: { serialNumber: "asc" },
        },
      },
      orderBy: { serialNumber: "asc" },
    });

    res.status(200).json(modules);
    return;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const getDiscountPriceByCourseIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { courseId } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });
    if (!course) {
      res.status(204).json({ message: "Course not found" });
      return;
    }
    const discountTokens = await prisma.discountToken.findMany({
      where: { courseIds: { has: Number(courseId) } },
    });
    if (discountTokens.length === 0) {
      res.status(200).json(0);
      return;
    }
    //there will be only one discount token for a course
    const discoutPercentage = discountTokens[0].discountPercentage;
    const discountedPrice = course.price * (1 - discoutPercentage / 100);
    res.status(200).json(Math.round(discountedPrice));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};


export const getDiscountTokenByCourseIdController = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const discountToken = await prisma.discountToken.findFirst({
      where: { courseIds: { has: Number(courseId) } },
    });
    if (!discountToken) {
      res.status(200).json(null);
      return;
    }
    res.status(200).json(discountToken);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

