import { Request, Response } from "express";
import prisma from "../../PrismaClient";

export const getContentByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        modules: {
          orderBy: { id: "asc" },
          include: {
            topics: {
              orderBy: { id: "asc" },
              include: {
                contents: {
                  orderBy: { id: "asc" },
                },
              },
            },
          },
        },
      },
    });

    res.status(200).json(course);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
