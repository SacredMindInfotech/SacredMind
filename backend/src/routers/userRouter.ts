import express from "express";
import { getUserbyIdController } from "../controllers/user/userController";
import { isAdmin } from "../middleware/authMiddleware";

const userRouter = express.Router();

//route to get user by id
userRouter.get("/:id", getUserbyIdController);


export default userRouter;
