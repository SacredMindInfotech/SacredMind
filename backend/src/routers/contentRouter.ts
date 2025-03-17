import {Router} from "express";
import { getContentByIdController } from "../controllers/content/contentController";
import { isUserEnrolled } from "../middleware/isUserEnrolled";

const contentRouter = Router();

//get content of a course by id
// api/v1/content/:id
contentRouter.get("/:id", isUserEnrolled,getContentByIdController);

export default contentRouter;
