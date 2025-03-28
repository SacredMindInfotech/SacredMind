import { Request, Response } from "express";
import prisma from "../../PrismaClient";

export const createTopicController = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;

    const { title, description, serialNumber } = req.body;
    if (!title || !description) {
      res.status(400).json({ error: 'Title and description are required' });
      return;
    }
    // Get all existing topics
    const existingTopics = await prisma.topic.findMany({
      where: { moduleId: Number(moduleId) },
      orderBy: { serialNumber: 'asc' }
    });
    
    // Start a transaction to update serial numbers
    await prisma.$transaction(async (tx) => {
      // Shift serial numbers of existing topics if needed
      if (serialNumber <= existingTopics.length) {
        await Promise.all(
          existingTopics
            .filter(t => t.serialNumber >= serialNumber)
            .map(topic => 
              tx.topic.update({
                where: { id: topic.id },
                data: { serialNumber: topic.serialNumber + 1 }
              })
            )
        );
      }
      
      // Create the new topic
      await tx.topic.create({
        data: {
          title,
          description,
          serialNumber,
          moduleId: Number(moduleId)
        }
      });
    });

    res.status(201).json({ message: "Topic created successfully" });
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
    const { topicId,moduleId } = req.params;
    const { title, description,serialNumber } = req.body;
    if (!title || !description) {
      res.status(400).json({ error: 'Title or description is required' });
      return;
    }
    // Check if topic exists
    const topic = await prisma.topic.findFirst({
      where: { 
        id: Number(topicId),
        moduleId: Number(moduleId)
      }
    });
    
    if (!topic) {
      res.status(404).json({ error: 'Topic not found' });
      return;
    }
    
     // Get all topics for this module
     const allTopics = await prisma.topic.findMany({
      where: { moduleId: Number(moduleId) },
      orderBy: { serialNumber: 'asc' }
    });
    
    // Start a transaction to update serial numbers
    await prisma.$transaction(async (tx) => {
      const oldSerialNumber = topic.serialNumber;
      
      // If serial number changed, adjust other topics
      if (serialNumber !== oldSerialNumber) {
        if (serialNumber > oldSerialNumber) {
          // Moving down in the list - decrease serial numbers for topics in between
          await Promise.all(
            allTopics
              .filter(t => t.serialNumber > oldSerialNumber && t.serialNumber <= serialNumber && t.id !== Number(topicId))
              .map(t => 
                tx.topic.update({
                  where: { id: t.id },
                  data: { serialNumber: t.serialNumber - 1 }
                })
              )
          );
        } else {
          // Moving up in the list - increase serial numbers for topics in between
          await Promise.all(
            allTopics
              .filter(t => t.serialNumber >= serialNumber && t.serialNumber < oldSerialNumber && t.id !== Number(topicId))
              .map(t => 
                tx.topic.update({
                  where: { id: t.id },
                  data: { serialNumber: t.serialNumber + 1 }
                })
              )
          );
        }
      }
      
      // Update the topic itself
      await tx.topic.update({
        where: { id: Number(topicId) },
        data: { title, description, serialNumber }
      });
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
    const { topicId,moduleId } = req.params;

   // Check if topic exists
    const topic = await prisma.topic.findFirst({
      where: { 
        id: Number(topicId),
        moduleId: Number(moduleId)
      }
    });
    
    if (!topic) {
      res.status(404).json({ error: 'Topic not found' });
      return;
    }
    
    // Get all topics for this module
    const allTopics = await prisma.topic.findMany({
      where: { moduleId: Number(moduleId) },
      orderBy: { serialNumber: 'asc' }
    });

     // Start a transaction to delete topic and update serial numbers
     await prisma.$transaction(async (tx) => {
      // Delete the topic
      await tx.topic.delete({
        where: { id: Number(topicId) }
      });
      
      // Decrease serial numbers for topics after the deleted one
      await Promise.all(
        allTopics
          .filter(t => t.serialNumber > topic.serialNumber)
          .map(t => 
            tx.topic.update({
              where: { id: t.id },
              data: { serialNumber: t.serialNumber - 1 }
            })
          )
      );
    });

    res.status(200).json({ message: "Topic deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting topic:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
