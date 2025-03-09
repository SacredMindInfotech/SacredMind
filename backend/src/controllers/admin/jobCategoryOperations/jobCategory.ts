import { Request, Response } from "express";
import prisma from "../../../PrismaClient";

export const createJobCategoryController = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const jobCategory = await prisma.jobCategory.create({ data: { name } });
        res.status(201).json(jobCategory);
        return;
    } catch (error) {
        res.status(500).json({ message: "Error creating job category" });
        return;
    }
}

export const updateJobCategoryByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const jobCategory = await prisma.jobCategory.update({
        where: { id: parseInt(id) },
        data: { name }
        });
        res.status(200).json(jobCategory);
        return;
    } catch (error) {
        res.status(500).json({ message: "Error updating job category" });
        return;
    }
}

export const deleteJobCategoryByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.jobCategory.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: "Job category deleted successfully" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Error deleting job category" });
        return;
    }
}


