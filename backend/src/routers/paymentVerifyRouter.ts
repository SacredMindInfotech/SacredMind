import { Router } from "express";
import { verifyPaymentController } from "../controllers/payments/verifyPaymentController";

const paymentVerifyRouter = Router();

paymentVerifyRouter.post("/", verifyPaymentController);

export default paymentVerifyRouter;

