import { Request, Response } from "express";
import prisma from "../../../PrismaClient";

//user controller
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    if (!users) {
      res.status(404).json({ error: "No users found" });
      return;
    }
    res.status(200).json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};


