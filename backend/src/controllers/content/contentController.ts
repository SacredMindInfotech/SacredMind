import { Request, Response } from "express";
import prisma from "../../PrismaClient";

export const createContentController = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    const { name, type, key } = req.body;
    const content = await prisma.content.create({
      data: { name, type, key, topicId: parseInt(topicId) },
    });
    res.status(200).json(content);
    return;
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const updateContentByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { contentId } = req.params;
    const { name, type, key } = req.body;
    const content = await prisma.content.update({
      where: { id: parseInt(contentId) },
      data: { name, type, key },
    });
    res.status(200).json(content);
    return;
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const deleteContentByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { contentId } = req.params;
    await prisma.content.delete({ where: { id: parseInt(contentId) } });
    res.status(200).json({ message: "Content deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
