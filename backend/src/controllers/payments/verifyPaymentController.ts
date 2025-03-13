import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../../PrismaClient";

export const verifyPaymentController = async (req: Request, res: Response) => {
  try {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,courseId,clerkUserId } =
      req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET!;

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    const user = await prisma.user.findUnique({
      where: {
        clerkuserId: clerkUserId,
      },
    });
    const course = await prisma.course.findUnique({
      where: {
        id: Number(courseId),
      },
    });
  

    if (generatedSignature === razorpay_signature) {
      //db operation
      const transaction=await prisma.transaction.create({
        data:{
          userId:user!.id,
          courseId:course!.id,
          razorpayOrderId:razorpay_order_id,
          razorpayPaymentId:razorpay_payment_id,
          razorpaySignature:razorpay_signature,
          amount:course!.price,
          currency:"INR",
          status:"SUCCESS",
          createdAt:new Date(),
        }
      })

      const userCourse = await prisma.userCourse.create({
        data: {
          userId: user!.id,
          courseId: course!.id,
        },
      });
      
      res.status(200).json({ message: "Payment verified and user enrolled in course successfully" });
      return;
    } 
    else {
      await prisma.transaction.create({
        data:{
          userId:user!.id,
          courseId:course!.id,
          razorpayOrderId:razorpay_order_id,
          razorpayPaymentId:razorpay_payment_id,
          razorpaySignature:razorpay_signature,
          amount:course!.price,
          currency:"INR",
          status:"FAILED",
          createdAt:new Date(),
        }
      })
      console.log("Payment verification failed");
      res.status(400).json({ message: "Payment Failed" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
