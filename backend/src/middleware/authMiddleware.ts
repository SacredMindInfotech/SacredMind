import { NextFunction, Request, Response } from "express";
import prisma from "../PrismaClient";
import { decodeJwt } from "jose";


export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract JWT from "Bearer <token>"
    if (!token) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }

    // Decode JWT to get the Clerk User ID
    const decoded: any = decodeJwt(token);
   
    const clerkUserId = decoded.sub; // Clerk assigns "sub" as the user ID

    if (!clerkUserId) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
      return;
    }

    // Fetch the user from your database
    const user = await prisma.user.findUnique({ where: { clerkuserId: clerkUserId } }); // Use Clerk ID stored in DB
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not found" });
      return;
    }
  


    if (user.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden: Admin access required" });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return;
  }
};

export const isUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract JWT from "Bearer <token>"
    if (!token) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }
    // Decode JWT to get the Clerk User ID
    
    const decoded: any = decodeJwt(token);
   
    const clerkUserId = decoded.sub; // Clerk assigns "sub" as the user ID

    if (!clerkUserId) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
      return;
    }

    // Fetch the user from your database
    const user = await prisma.user.findUnique({ where: { clerkuserId: clerkUserId } }); // Use Clerk ID stored in DB
    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not found" });
      return;
    }

    next();
  } catch (error) {
    
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return;
  }
};

