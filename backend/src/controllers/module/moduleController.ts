import { Request, Response } from "express";
import prisma from "../../PrismaClient";

export const createModuleController = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;
    const module = await prisma.module.create({
      data: {
        title,
        course: {
          connect: {
            id: parseInt(courseId),
          },
        },
      },
    });
    res.status(200).json(module);
    return;
  } catch (error) {
    console.error("Error creating module:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const updateModuleByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { moduleId } = req.params;
    const { title } = req.body;
    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }
    const module = await prisma.module.update({
      where: { id: parseInt(moduleId) },
      data: { title },
    });
    res.status(200).json(module);
    return;
  } catch (error) {
    console.error("Error updating module:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const deleteModuleByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { moduleId } = req.params;
    await prisma.module.delete({ where: { id: parseInt(moduleId) } });
    res.status(200).json({ message: "Module deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting module:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
