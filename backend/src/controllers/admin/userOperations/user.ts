import { Request, Response } from "express";
import prisma from "../../../PrismaClient";
import dotenv from "dotenv";

dotenv.config();

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

export const updateUserRoleController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
    });

    res.status(200).json(user);
  } catch (e: any) {
    console.error(e);

    if (e.code === "P2025") {
      // Prisma error code for "Record not found"
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
  }
};


//update user by id || use clerk backend sdk to DB-> CLERK data updation
// export const updateUserByIdController = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { firstName, lastName, imageUrl, email, role } = req.body;
  
//     const isUser = await prisma.user.findUnique({ where: { id: parseInt(id) } });
//     if (!isUser) {
//       res.status(404).json({ error: "User not found" });
//       return;
//     }

//     const userUpdated = await prisma.user.update({ 
//       where: { id: parseInt(id) },
//       data: { firstName, lastName, imageUrl, email, role },
//     });
//     if (!userUpdated) {
//       res.status(404).json({ error: "Error updating user" });
//       return;
//     }
//     res.status(200).json(userUpdated);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

//delete user by id
// export const deleteUserByIdController = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const user = await prisma.user.delete({ where: { id: parseInt(id) } });
//     if (!user) {
//       res.status(404).json({ error: "User not found" });
//       return;
//     }
//     res.status(200).json(user);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };  
