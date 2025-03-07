import { Router } from "express";
import {  createCourseController, deleteCourseByIdController, updateCourseByIdController } from "../controllers/admin/courseOperations/course";
import {  getAllUsersController, updateUserRoleController } from "../controllers/admin/userOperations/user";
import { deleteCategoryByIdController, updateCategoryByIdController } from "../controllers/admin/categoryOperations/category";
import { createCategoryController } from "../controllers/admin/categoryOperations/category";

const adminRouter = Router();


// POST	/api/v1/admin/courses	Create a new course	Admin
adminRouter.post("/courses",createCourseController)
// PUT	/api/v1/admin/courses/:id	Update course details Admin       
adminRouter.put("/courses/:id",updateCourseByIdController)
// DELETE	/api/v1/admin/courses/:id	Delete a course	Admin
adminRouter.delete("/courses/:id",deleteCourseByIdController)


// GET	/api/v1/admin/users	Get all users	Admin
adminRouter.get("/users",getAllUsersController)
//POST /api/v1/admin/users/:id Update the role of the user
adminRouter.post("/users/:id",updateUserRoleController)
  




// POST	/api/v1/admin/categories	Create a new category	Admin
adminRouter.post("/categories",createCategoryController)
// PUT	/api/v1/admin/categories/:id	Update category details	Admin
adminRouter.put("/categories/:id",updateCategoryByIdController)
// DELETE	/api/v1/admin/categories/:id	Delete a category	Admin
adminRouter.delete("/categories/:id",deleteCategoryByIdController)



// GET	/api/v1/admin/orders	View all transactions	Admin
adminRouter.get("/orders", async (req, res) => {
})
// GET	/api/v1/admin/orders/:id	View specific order details	Admin
adminRouter.get("/orders/:id", async (req, res) => {
})  
// PUT	/api/v1/admin/orders/:id	Update order status	Admin
adminRouter.put("/orders/:id", async (req, res) => {
})



export default adminRouter;
