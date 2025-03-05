import express from "express";
import {
  getCategoryByIdController,
  getCoursesByCategoryIdController,
  getParentCategoriesController,
} from "../controllers/category/categoryController";

const categoryRouter = express.Router();

//route to get all parent categories
categoryRouter.get("/", getParentCategoriesController);

//route to get category by name of the category
categoryRouter.get("/:id", getCategoryByIdController);


//route to get courses of a sub-category
categoryRouter.get("/:id/courses", getCoursesByCategoryIdController);

export default categoryRouter;
