import { Request, Response } from "express";
import prisma from "../../PrismaClient";
import createRazorpayInstance from "../../config/razorpay-config";

export const coursePaymentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discountToken = req.headers.discounttoken as string;
    const { name, email, phone,clerkUserId } = req.body;


    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
    });

    let discountTokenData;
    if (discountToken) {
      try {
        discountTokenData = await prisma.discountToken.findUnique({
          where: { token: discountToken as string },
        });
      } catch (error) {
        discountTokenData = null;
        console.log(error);
      }
    }
    
    let discountedPrice = course!.price;
    if (discountTokenData?.courseIds.includes(course!.id)) {
      discountedPrice = discountTokenData.expiresAt > new Date()
        ? Math.round(
            course!.price * (1 - discountTokenData.discountPercentage / 100)
          ) 
        : course!.price;
    }

    const totalAmount = Math.round(
      (discountedPrice + (discountedPrice * 0.18)) * 100
    );

    const options = {
      amount: totalAmount, 
      currency: "INR",
      receipt: "receipt#1",
    };

    const razorPayInstance = createRazorpayInstance();
    const order = await razorPayInstance.orders.create(options);

    let transactionData = {
      name,
      email,
      phone,
      courseId: Number(id),
      razorpayOrderId: order.id,
      amount: totalAmount / 100,
    };

    if (clerkUserId) {
      const user = await prisma.user.findUnique({
        where: { clerkuserId: clerkUserId },
      });

      if (user) {
        transactionData.name = user.firstName + " " + user.lastName;
        transactionData.email = user.email;
        transactionData.phone = user.phoneNumber;
      }
    }

    const transaction = await prisma.transaction.create({
      data: transactionData,
    });

    res.status(200).json({ order, transactionId: transaction.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
