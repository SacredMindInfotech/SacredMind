import { Router } from "express";
// import { verifyPaymentController } from "../controllers/payments/PaymentController";
import { coursePaymentController } from "../controllers/payments/PaymentController";

const coursePaymentRouter =Router();

// api/v1/course/payment/:id
coursePaymentRouter.post("/:id", coursePaymentController);

// api/v1/course/payment/verify
// coursePaymentRouter.post("/verify", verifyPaymentController);


export default coursePaymentRouter;