import { Request, Response } from "express"
import prisma from "../../../PrismaClient";


export const createJobController = async (req: Request, res: Response) => {
    try {
        const { title, description, jobCategoryId, location, salary, type, experience, education, skills, responsibilities, requirements } = req.body;
        const job = await prisma.job.create({
            data: { title, description, responsibilities, requirements, skills, location, salary, type, experience, education, jobCategory: {
                connect: {
                    id: Number(jobCategoryId)
                }
            } }
        });
        res.status(201).json(job);
        return;
    } catch (error) {
        res.status(500).json({ message: "Error creating job" });
        return;
    }
}

export const updateJobByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, jobCategoryId, location, salary, type, experience, education, skills, responsibilities, requirements } = req.body;
        if(!title && !description && !jobCategoryId && !location && !salary && !type && !experience && !education && !skills && !responsibilities && !requirements) {
         res.status(400).json({ message: "No fields to update" });
         return;
        }
        const job = await prisma.job.update({
            where: { id: Number(id) },
            data: { title, description, responsibilities, requirements, skills, location, salary, type, experience, education, jobCategory: {
                connect: {
                    id: Number(jobCategoryId)
                }
            } }
        });
        res.status(200).json(job);
        return;
    } catch (error) {
        res.status(500).json({ message: "Error updating job" });
        return;
    }
}


export const deleteJobByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.job.delete({
            where: { id: Number(id) }
        });
        res.status(200).json({ message: "Job deleted successfully" });
        return;
    } catch (error) {
        res.status(500).json({ message: "Error deleting job" });
        return;
    }
}


