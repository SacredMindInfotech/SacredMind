import { Request, Response } from "express";
import prisma from "../../PrismaClient";
import createRazorpayInstance from "../../config/razorpay-config";
import crypto from "crypto";

export const coursePaymentController = async (req: Request, res: Response) => {
  try {
    console.log("course payment controller");
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
    });
    console.log(course);
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

// export const verifyPaymentController = async (req: Request, res: Response) => {
//   try {
//     console.log("verify payment controller");
    
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//     const secret = process.env.RAZORPAY_KEY_SECRET!;

//     const hmac = crypto.createHmac("sha256", secret);
//     hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
//     const generatedSignature = hmac.digest("hex");
//     console.log(generatedSignature);
//     console.log(razorpay_signature);

//     if (generatedSignature === razorpay_signature) {
//       //db operations
//       console.log("Payment verified");
//       res.status(200).json({ message: "Payment verified" });
//       return;
//     } else {
//       console.log("Payment verification failed");
//       res.status(400).json({ message: "Payment verification failed" });
//       return;
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal server error" });
//     return;
//   }
// };
