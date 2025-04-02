import { Router } from "express";
// import { verifyPaymentController } from "../controllers/payments/PaymentController";
import { coursePaymentController } from "../controllers/payments/PaymentController";

const coursePaymentRouter =Router();

// api/v1/course/payment/:id
coursePaymentRouter.post("/:id", coursePaymentController);



export default coursePaymentRouter;