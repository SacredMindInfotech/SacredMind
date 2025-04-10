import express from "express";
import {
  getCategoryByIdController,
  getCoursesByCategoryIdController,
  getOnlySubcategoriesController,
  getParentCategoriesController,
} from "../controllers/courseCategory/categoryController";

const categoryRouter = express.Router();

//route to get all parent categories
categoryRouter.get("/", getParentCategoriesController);

// route to get only categories that have parent 
categoryRouter.get("/onlySubcategories", getOnlySubcategoriesController);

//route to get category by name of the category
categoryRouter.get("/:categoryName", getCategoryByIdController);

//route to get courses of a sub-category
categoryRouter.get("/:categoryId/courses", getCoursesByCategoryIdController);



export default categoryRouter;
