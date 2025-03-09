import { Router } from "express";
import { getJobCategoriesController } from "../controllers/jobCategory/jobCategory";

const jobCategoryRouter = Router();


jobCategoryRouter.get("/", getJobCategoriesController);

export default jobCategoryRouter;