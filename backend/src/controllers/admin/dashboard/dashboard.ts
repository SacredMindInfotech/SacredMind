import { Request, Response } from "express";
import prisma from "../../../PrismaClient";


export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalCourses = await prisma.course.count();
        res.status(200).json({
            totalUsers,
            totalCourses
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getSalesStats = async (req: Request, res: Response) => {
    try {
        // const lastMonth = new Date();
        // lastMonth.setMonth(lastMonth.getMonth() - 1);

        // const monthlySales = await prisma.order.count({
        //     where: { createdAt: { gte: lastMonth } }
        // });

        // const lastWeek = new Date();
        // lastWeek.setDate(lastWeek.getDate() - 7);

        // const weeklySales = await prisma.order.count({
        //     where: { createdAt: { gte: lastWeek } }
        // });

        // const dailySales = await prisma.order.count({
        //     where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        // });

        // res.json({ dailySales, weeklySales, monthlySales });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch sales stats" });
    }
};


export const getUserStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await prisma.user.count();

        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const newUsersLastMonth = await prisma.user.count({
            where: { createdAt: { gte: lastMonth } }
        });

        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const newUsersLastWeek = await prisma.user.count({
            where: { createdAt: { gte: lastWeek } }
        });

        const newUsersToday = await prisma.user.count({ 
            where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        });



        res.json({ totalUsers, newUsersLastMonth, newUsersLastWeek, newUsersToday });

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user stats" });
    }
};


export const getCourseStats = async (req: Request, res: Response) => {
    try {
      const totalCourses = await prisma.course.count();
  
      const mostEnrolledCourses = await prisma.course.findMany({
        orderBy: { users: { _count: "desc" } },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          imageUrl: true,
          _count: { select: { users: true } },
        },
      });
  
      res.json({ totalCourses, mostEnrolledCourses });

    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course stats" });
    }
  };
  
