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

export const getCourseByTitleController = async (req: Request, res: Response) => {
  try {
    const { courseTitle } = req.params;
    const course = await prisma.course.findUnique({
      where: { title: courseTitle },
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

export const getDiscountTokenByCourseIdController = async (
  req: Request,
  res: Response
) => {
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

export const getCoursesByStringOfCategoryIdsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { categoryIds, published } = req.query;

    if (!categoryIds) {
      res.status(400).json({ error: "categoryIds is required" });
      return;
    }

    // Convert comma-separated string to array of strings
    const categoryIdArray = (categoryIds as string)
      .split(",")
      .map((id) => id.trim());


    const courses = await prisma.course.findMany({
      where: {
        categoryId: { in: categoryIdArray.map(Number) },
        ...(published !== undefined && { published: published === "true" }),
      },
    });

    res.status(200).json(courses);
    return;
  } catch (error) {
    console.error("Error fetching courses by category:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};


export const getCourseByIdController = async (req: Request, res: Response) => {
  try{
    const {courseId} = req.params;
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: {
        category: true,
      },
    });
    if(!course){
      res.status(204).json({ message: "Course not found" });
      return;
    }
    res.status(200).json(course);
    return;
  }
  catch(error){
    console.error("Error fetching course by id:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}

export const getCoursesDiscountsByStringOfCourseIdsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { courseIds } = req.query;
    if (!courseIds) {
      res.status(400).json({ error: "courseIds is required" });
      return;
    }
    const courseIdArray = (courseIds as string)
      .split(",")
      .map((id) => id.trim());

    const discountTokens = await prisma.discountToken.findMany({
      where: {
        courseIds: { hasSome: courseIdArray.map(Number) },
      },
    });

    const courses = await prisma.course.findMany({
      where: {
        id: { in: courseIdArray.map(Number) },
      },
    });

    // Create a map of course ID to discounted price
    const discountedPricesMap: Record<number, number> = {};
    
    courses.forEach((course) => {
      const discountToken = discountTokens.find((token) => 
        token.courseIds.includes(course.id)
      );
      
      if (discountToken) {
        const discountPercentage = discountToken.discountPercentage;
        const discountedPrice = Math.round(course.price * (1 - discountPercentage / 100));
        discountedPricesMap[course.id] = discountedPrice;
      } else {
        discountedPricesMap[course.id] = 0; // No discount
      }
    });
    
    res.status(200).json(discountedPricesMap);
    return;
  } catch (error) {
    console.error("Error fetching courses discounts:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

