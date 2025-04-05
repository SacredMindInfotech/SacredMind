import {Router} from "express";
import {  getContentByKeyController } from "../controllers/courseContent/courseContentController";
import { isUserEnrolled } from "../middleware/isUserEnrolled";

const contentRouter = Router();

//get content of a course by id
// api/v1/content/:id
// contentRouter.get("/:id", isUserEnrolled,getContentByIdController);

//get particular content of a course by cloudflare key
// api/v1/content/:key/stream-file

contentRouter.get("/:id/stream-file", isUserEnrolled,getContentByKeyController);

export default contentRouter;
