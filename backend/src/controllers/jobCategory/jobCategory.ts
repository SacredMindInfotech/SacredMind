import { Request, Response } from "express";
import prisma from "../../PrismaClient";

export const getJobCategoriesController = async (req: Request, res: Response) => {
    try {
        const jobCategories = await prisma.jobCategory.findMany();
        res.status(200).json(jobCategories);
        return;
    } catch (error) {
        res.status(500).json({ message: "Error fetching job categories" });
        return;
    }
}



