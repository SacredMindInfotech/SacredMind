import { Router } from "express";
import {  createCourseController, deleteCourseByIdController, updateCourseByIdController } from "../controllers/admin/courseOperations/course";
import { getAllUsersController } from "../controllers/admin/userOperations/user";
import { deleteCategoryByIdController, updateCategoryByIdController } from "../controllers/admin/categoryOperations/category";
import { createCategoryController } from "../controllers/admin/categoryOperations/category";

const adminRouter = Router();


// POST	/api/admin/courses	Create a new course	Admin
adminRouter.post("/courses",createCourseController)

// PUT	/api/admin/courses/:id	Update course details Admin       
adminRouter.put("/courses/:id",updateCourseByIdController)


// DELETE	/api/admin/courses/:id	Delete a course	Admin
adminRouter.delete("/courses/:id",deleteCourseByIdController)



// GET	/api/admin/users	Get all users	Admin
adminRouter.get("/users",getAllUsersController)






// GET	/api/admin/orders	View all transactions	Admin
adminRouter.get("/orders", async (req, res) => {
})

// GET	/api/admin/orders/:id	View specific order details	Admin
adminRouter.get("/orders/:id", async (req, res) => {
})  

// PUT	/api/admin/orders/:id	Update order status	Admin
adminRouter.put("/orders/:id", async (req, res) => {
})




// POST	/api/admin/categories	Create a new category	Admin
adminRouter.post("/categories",createCategoryController)

// PUT	/api/admin/categories/:id	Update category details	Admin
adminRouter.put("/categories/:id",updateCategoryByIdController)

// DELETE	/api/admin/categories/:id	Delete a category	Admin
adminRouter.delete("/categories/:id",deleteCategoryByIdController)


export default adminRouter;
