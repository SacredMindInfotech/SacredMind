import { Request, Response } from "express";
import prisma from "../../../PrismaClient";

export const createModuleController = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { title, serialNumber } = req.body;
    if (!title || !serialNumber) {
      res.status(400).json({ error: "Title and serial number are required" });
      return;
    }
    // Get all existing modules
    const existingModules = await prisma.module.findMany({
      where: { courseId: Number(courseId) },
      orderBy: { serialNumber: 'asc' }
    });

    // Start a transaction to update serial numbers
    await prisma.$transaction(async (tx) => {
      // Shift serial numbers of existing modules if needed
      if (serialNumber <= existingModules.length) {
        await Promise.all(
          existingModules
            .filter(m => m.serialNumber >= serialNumber)
            .map(module => 
              tx.module.update({
                where: { id: module.id },
                data: { serialNumber: module.serialNumber + 1 }
              })
            )
        );
      }
      
      // Create the new module
      await tx.module.create({
        data: {
          title,
          serialNumber,
          courseId: Number(courseId)
        }
      });
    });

    
    res.status(201).json({ message: "Module created successfully" });
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
    const { courseId, moduleId } = req.params;

    const { title, serialNumber } = req.body;
    if (!title || !serialNumber) {
      res.status(400).json({ error: "Title and serial number are required" });
      return;
    }
    // Check if module exists
    const module = await prisma.module.findFirst({
      where: { 
        id: Number(moduleId),
        courseId: Number(courseId)
      }
    });
    
    if (!module) {
      res.status(404).json({ error: 'Module not found' });
      return;
    }
    
    // Get all modules for this course
    const allModules = await prisma.module.findMany({
      where: { courseId: Number(courseId) },
      orderBy: { serialNumber: 'asc' }
    });

    // Start a transaction to update serial numbers
    await prisma.$transaction(async (tx) => {
      const oldSerialNumber = module.serialNumber;
      
      // If serial number changed, adjust other modules
      if (serialNumber !== oldSerialNumber) {
        if (serialNumber > oldSerialNumber) {
          // Moving down in the list - decrease serial numbers for modules in between
          await Promise.all(
            allModules
              .filter(m => m.serialNumber > oldSerialNumber && m.serialNumber <= serialNumber && m.id !== Number(moduleId))
              .map(m => 
                tx.module.update({
                  where: { id: m.id },
                  data: { serialNumber: m.serialNumber - 1 }
                })
              )
          );
        } else {
          // Moving up in the list - increase serial numbers for modules in between
          await Promise.all(
            allModules
              .filter(m => m.serialNumber >= serialNumber && m.serialNumber < oldSerialNumber && m.id !== Number(moduleId))
              .map(m => 
                tx.module.update({
                  where: { id: m.id },
                  data: { serialNumber: m.serialNumber + 1 }
                })
              )
          );
        }
      }
      
      // Update the module itself
      await tx.module.update({
        where: { id: Number(moduleId) },
        data: { title, serialNumber }
      });
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
    const { moduleId, courseId } = req.params;
     // Check if module exists
     const module = await prisma.module.findFirst({
      where: { 
        id: Number(moduleId),
        courseId: Number(courseId)
      }
    });
    
    if (!module) {
      res.status(404).json({ error: 'Module not found' });
      return;
    }

    // Get all modules for this course
    const allModules = await prisma.module.findMany({
      where: { courseId: Number(courseId) },
      orderBy: { serialNumber: 'asc' }
    });
    
    // Start a transaction to delete module and update serial numbers
    await prisma.$transaction(async (tx) => {
      // Delete the module
      await tx.module.delete({
        where: { id: Number(moduleId) }
      });
      
      // Decrease serial numbers for modules after the deleted one
      await Promise.all(
        allModules
          .filter(m => m.serialNumber > module.serialNumber)
          .map(m => 
            tx.module.update({
              where: { id: m.id },
              data: { serialNumber: m.serialNumber - 1 }
            })
          )
      );
    });
    
    res.status(200).json({ message: "Module deleted successfully" });
    return;
  } catch (error) {
    console.error("Error deleting module:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
