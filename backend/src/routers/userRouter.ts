import express from "express";
import { getPurchasesByUserIdController, getUserbyIdController, isPurchaseController } from "../controllers/user/userController";
import { isAdmin } from "../middleware/authMiddleware";

const userRouter = express.Router();

//route to get user by id
// api/v1/user/:id
userRouter.get("/:id", getUserbyIdController);

//router to get all courses purchased by user
// api/v1/user/purchases/:id
userRouter.get("/purchases/:id", getPurchasesByUserIdController);

//router to check if user has purchased a course
// api/v1/user/isPurchase/:id
userRouter.get("/isPurchase/:id", isPurchaseController);


export default userRouter;
