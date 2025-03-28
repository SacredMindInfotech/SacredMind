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

// route to get only subcategories
categoryRouter.get("/onlySubcategories", getOnlySubcategoriesController);

//route to get category by name of the category
categoryRouter.get("/:id", getCategoryByIdController);

//route to get courses of a sub-category
//api/v1/category/:id/courses
categoryRouter.get("/:id/courses", getCoursesByCategoryIdController);



export default categoryRouter;
