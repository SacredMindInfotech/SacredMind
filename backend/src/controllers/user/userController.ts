import prisma from "../../PrismaClient";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

export const getUserbyIdController = async (req: Request, res: Response) => {
  try {
    // const { id } = req.params;
    const clerkuserId = req.params.id;
    if ( !clerkuserId) {
      res.status(400).json({
        error: "Please provide either id or clerkuserId to get user details",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where:  { clerkuserId },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};
