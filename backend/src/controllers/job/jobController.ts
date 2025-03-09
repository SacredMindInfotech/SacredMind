import { Request, Response } from "express";
import prisma from "../../PrismaClient";

export const getAllJobsController = async (req: Request, res: Response) => {
    try {
        const jobs = await prisma.job.findMany({
            include: {
                jobCategory: true,
            },
        });
        res.status(200).json(jobs);
        return;
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs" });
        return;
    }
};

export const getJobByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await prisma.job.findUnique({
            where: { id: Number(id) },
        });
        res.status(200).json(job);
        return;
    } catch (error) {
        res.status(500).json({ message: "Error fetching job" });
        return;
    }
};



