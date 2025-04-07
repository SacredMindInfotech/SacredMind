import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../../PrismaClient";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const verifyPaymentController = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      clerkUserId,
      amount,
      transactionId,
      name,
      email,
      phone,
    } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET!;

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    const course = await prisma.course.findUnique({
      where: {
        id: Number(courseId),
      },
    });

    if (!course) {
      console.log("Course not found", { courseId });
      res.status(404).json({
        message: "Course not found",
        courseFound: !!course,
      });
      return;
    }

    if (generatedSignature === razorpay_signature) {
      const transaction = await prisma.transaction.update({
        where: {
          id: Number(transactionId),
        },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          amount: amount,
          currency: "INR",
          status: "SUCCESS",
          createdAt: new Date(),
        },
      });

      if (clerkUserId) {
        const user = await prisma.user.findUnique({
          where: {
            clerkuserId: clerkUserId,
          },
        });
        if (user) {
          const getUserEnrolled = await prisma.userCourse.create({
            data: {
              userId: user.id,
              courseId: Number(courseId),
            },
          });
        }
      }
      // for non registered user, when user will signup, we will give access to in clerkwebhook controller by checking transaction status using signed up email

      //send email to user
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString();

      var mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Payment Successful - SacredMind Infotech",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f9; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; font-size: 24px; font-weight: bold;">SacredMind Infotech</h1>
              <h2 style="color: #27ae60; font-size: 20px; font-weight: normal;">Payment Successful</h2>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
              <h3 style="color: #2c3e50; font-size: 18px; font-weight: bold;">Transaction Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
                <tr>
                  <td style="padding: 10px 0; color: #34495e;"><strong>Course Name:</strong></td>
                  <td style="padding: 10px 0; color: #34495e;">${course.title}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #34495e;"><strong>Amount:</strong></td>
                  <td style="padding: 10px 0; color: #34495e;">₹${amount} (GST included)</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #34495e;"><strong>Date:</strong></td>
                  <td style="padding: 10px 0; color: #34495e;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #34495e;"><strong>Time:</strong></td>
                  <td style="padding: 10px 0; color: #34495e;">${formattedTime}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
              <h3 style="color: #2c3e50; font-size: 18px; font-weight: bold;">Customer Information</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
                <tr>
                  <td style="padding: 10px 0; color: #34495e;"><strong>Name:</strong></td>
                  <td style="padding: 10px 0; color: #34495e;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #34495e;"><strong>Email:</strong></td>
                  <td style="padding: 10px 0; color: #34495e;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #34495e;"><strong>Phone:</strong></td>
                  <td style="padding: 10px 0; color: #34495e;">${phone}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #7f8c8d; font-size: 14px;">
              <p>Thank you for choosing SacredMind Infotech!</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
            </div>
          </div>
        `
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(200).json({
        message: "Payment verified and user enrolled in course successfully",
      });
      return;
    } else {
      await prisma.transaction.update({
        where: {
          id: transactionId,
        },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          amount: amount,
          currency: "INR",
          status: "FAILED",
          createdAt: new Date(),
        },
      });
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
