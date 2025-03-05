import prisma from "../../PrismaClient";
import dotenv from "dotenv";
import { User } from "@prisma/client";

dotenv.config();

//methods used by clerk webhook to sync user data with database.

export const createUser = async (data: User) => {
  try {
    // Get admin and manager emails from .env, ensure they are lowercase for comparison
    const adminEmails = process.env.ADMIN_EMAILS?.toLowerCase().split(",") || [];
    const managerEmails = process.env.MANAGER_EMAILS?.toLowerCase().split(",") || [];

    // Default role is "USER"
    let role: "ADMIN" | "MANAGER" | "USER" = "USER";

    if (adminEmails.includes(data.email.toLowerCase())) {
      role = "ADMIN";
    } else if (managerEmails.includes(data.email.toLowerCase())) {
      role = "MANAGER";
    }

    // Ensure email uniqueness
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return { error: "User already exists" };
    }

    // Create user with the assigned role
    const user = await prisma.user.create({
      data: { ...data, role },
    });

    console.log("User created successfully:", user);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Internal server error" };
  }
};

export const updateUserbyId = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<User>;
}) => {
  try {
    const user = await prisma.user.update({
      where: {
        clerkuserId: id,
      },
      data,
    });
    if (user) {
      console.log("User updated successfully");
      return user;
    }
  } catch (e) {
    console.error(e);
  }
};

export const deleteUserbyId = async ({
  id,
  clerkuserId,
}: {
  id?: number;
  clerkuserId?: string;
}) => {
  try {
    if (!id && !clerkuserId) {
      throw new Error("Please provide either id or clerkUserId to delete the user");
    }

    const whereCondition = id ? { id } : { clerkuserId };

    const deletedUser = await prisma.user.delete({
      where: whereCondition,
    });

    console.log("User deleted successfully", deletedUser);
    return deletedUser;
  } catch (e) {
    console.error("Error deleting user:", e);
    return { error: e };
  }
};
