import express from "express";
import { getPurchasesByUserIdController, getUserbyIdController, isPurchaseController, updatePhoneNumberController } from "../controllers/user/userController";

const userRouter = express.Router();

//route to get user by id
// api/v1/user/:clerkUserId
userRouter.get("/:clerkUserId", getUserbyIdController);

//router to get all courses purchased by user
// api/v1/user/:userId/purchases
userRouter.get("/:clerkUserId/purchases/", getPurchasesByUserIdController);

//router to check if user has purchased a course
// api/v1/user/isPurchase/:courseTitle
userRouter.get("/isPurchase/:courseTitle", isPurchaseController);

//router to update phone number
// api/v1/user/:userId/updatePhoneNumber
userRouter.put("/:userId/updatePhoneNumber", updatePhoneNumberController);




export default userRouter;
