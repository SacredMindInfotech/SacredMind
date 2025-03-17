import { NextFunction, Request, Response } from "express";
import prisma from "../PrismaClient";

export const isUserEnrolled = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const isUserEnrolled = await prisma.userCourse.findFirst({
      where: {
        userId: user.id,
        courseId: parseInt(id),
      },
      include: {
        course: true,
      },
    });
    if (!isUserEnrolled) {
      res.status(401).json({ message: "User not enrolled in this course" });
      return;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
