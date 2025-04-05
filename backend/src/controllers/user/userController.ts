import prisma from "../../PrismaClient";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

export const getUserbyIdController = async (req: Request, res: Response) => {
  try {
    const clerkuserId = req.params.clerkUserId;
    if (!clerkuserId) {
      res.status(400).json({
        error: "Please provide either id or clerkuserId to get user details",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { clerkuserId },
      include: {
        courses: true,
      }
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

export const getPurchasesByUserIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const clerkUserId = req.params.clerkUserId;
    const user = await prisma.user.findUnique({
      where: { clerkuserId: clerkUserId },
    });

    const purchases = await prisma.userCourse.findMany({
      where: { userId: user!.id },
    });
    res.status(200).json(purchases);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const isPurchaseController = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const clerkUserId = req.headers.clerkuserid as string;

    if (!clerkUserId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { clerkuserId: clerkUserId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const purchase = await prisma.userCourse.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: Number(courseId),
        },
      },
    });
    const isAdmin = user.role === 'ADMIN';
    res.status(200).json({ purchased: !!purchase || isAdmin });
    return;
  } catch (e) {
    console.error("Error checking purchase:", e);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};


export const updatePhoneNumberController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { phoneNumber } = req.body;

    // Check if the phone number is already registered
    const existingUser = await prisma.user.findMany({
      where: { phoneNumber: phoneNumber },
    });
    if (existingUser.length > 0) {
      res.status(400).json({ error: "Phone number is already registered" });
      return;
    }

    const user = await prisma.user.update({
      where: { clerkuserId: userId },
      data: { phoneNumber: phoneNumber },
    });

    res.status(200).json(user);
    return;
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}
