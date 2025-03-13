import { Request, Response } from "express";
import prisma from "../../PrismaClient";
import createRazorpayInstance from "../../config/razorpay-config";

export const coursePaymentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const  discountToken  = req.headers.discounttoken as string;

    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
    });

    let discountTokenData;
    if (discountToken) {
      try{
        discountTokenData = await prisma.discountToken.findUnique({
          where: { token: discountToken as string },
        });
      }
      catch(error){
        discountTokenData=null;
        console.log(error);
      }
    }

    let discountedPrice=course!.price;
    if(discountTokenData?.courseIds.includes(course!.id)){
      discountedPrice = discountTokenData?.isActive
        ? Math.round(course!.price * (1 - discountTokenData.discountPercentage / 100))-1
        : course!.price;
    }
    
    const options = {
      amount: discountedPrice * 100,
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
