import { Request, Response } from "express";
import prisma from "../../PrismaClient";
import createRazorpayInstance from "../../config/razorpay-config";

export const coursePaymentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
    });
    const options = {
      amount: course!.price * 100,
      currency: "INR",
      receipt: "receipt#1",
    };

    const razorPayInstance = createRazorpayInstance();
    const order = await razorPayInstance.orders.create(options);


    res.status(200).json({ order });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

