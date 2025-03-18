import { Request, Response } from "express";
import prisma from "../../PrismaClient";

export const createTopicController = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const { title, description } = req.body;
    const topic = await prisma.topic.create({
      data: {
        title,
        description,
        module: {
          connect: {
            id: parseInt(moduleId),
          },
        },
      },
    });
    res.status(200).json(topic);
    return;
  } catch (error) {
    console.error("Error creating topic:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const updateTopicByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { topicId } = req.params;
    const { title, description } = req.body;
    const topic = await prisma.topic.update({
      where: { id: parseInt(topicId) },
      data: { title, description },
    });
    res.status(200).json(topic);
    return;
  } catch (error) {
    console.error("Error updating topic:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const deleteTopicByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { topicId } = req.params;
    await prisma.topic.delete({ where: { id: parseInt(topicId) } });
    res.status(200).json({ message: "Topic deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting topic:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
