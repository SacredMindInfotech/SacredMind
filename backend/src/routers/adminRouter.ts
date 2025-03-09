import { Router } from "express";
import {
  createCourseController,
  deleteCourseByIdController,
  updateCourseByIdController,
} from "../controllers/admin/courseOperations/course";
import {
  getAllUsersController,
  updateUserRoleController,
} from "../controllers/admin/userOperations/user";
import {
  createCategoryController,
  deleteCategoryByIdController,
  updateCategoryByIdController,
} from "../controllers/admin/CourseCategoryOperations/category";
import {
  getCourseStats,
  getDashboardStats,
  getSalesStats,
  getUserStats,
} from "../controllers/admin/dashboardOperations/dashboard";
import {
  getAllOrdersController,
  getOrderByIdController,
} from "../controllers/admin/ordersOperations/order";
import { createJobController, updateJobByIdController, deleteJobByIdController } from "../controllers/admin/jobOperations/job";
import { createJobCategoryController, deleteJobCategoryByIdController, updateJobCategoryByIdController } from "../controllers/admin/jobCategoryOperations/jobCategory";

const adminRouter = Router();

// POST	/api/v1/admin/courses	Create a new course
adminRouter.post("/courses", createCourseController);
// PUT	/api/v1/admin/courses/:id	Update course details
adminRouter.put("/courses/:id", updateCourseByIdController);
// DELETE	/api/v1/admin/courses/:id	Delete a course
adminRouter.delete("/courses/:id", deleteCourseByIdController);

// GET	/api/v1/admin/users	Get all users
adminRouter.get("/users", getAllUsersController);
//POST /api/v1/admin/users/:id Update the role of the user
adminRouter.post("/users/:id", updateUserRoleController);

// POST	/api/v1/admin/categories	Create a new category
adminRouter.post("/categories", createCategoryController);
// PUT	/api/v1/admin/categories/:id	Update category details
adminRouter.put("/categories/:id", updateCategoryByIdController);
// DELETE	/api/v1/admin/categories/:id	Delete a category
adminRouter.delete("/categories/:id", deleteCategoryByIdController);

// GET	/api/v1/admin/orders	View all transactions	Admin
adminRouter.get("/orders", getAllOrdersController);
// GET	/api/v1/admin/orders/:id	View specific order details	Admin
adminRouter.get("/orders/:id", getOrderByIdController);

// GET	/api/v1/admin/dashboard/stats	Get dashboard stats
adminRouter.get("/dashboard/stats", getDashboardStats);
// GET	/api/v1/admin/dashboard/sales	Get sales stats
adminRouter.get("/dashboard/sales", getSalesStats);
// GET	/api/v1/admin/dashboard/users	Get user stats
adminRouter.get("/dashboard/users", getUserStats);
// GET	/api/v1/admin/dashboard/courses	Get course stats
adminRouter.get("/dashboard/courses", getCourseStats);


// POST	/api/v1/admin/jobs	Create a new job
adminRouter.post("/jobs", createJobController);
// PUT	/api/v1/admin/jobs/:id	Update job details
adminRouter.put("/jobs/:id", updateJobByIdController);
// DELETE	/api/v1/admin/jobs/:id	Delete a job
adminRouter.delete("/jobs/:id", deleteJobByIdController);

//post /api/v1/admin/jobCategories Create a new job category
adminRouter.post("/jobCategories", createJobCategoryController);
// PUT	/api/v1/admin/jobCategories/:id	Update job category details
adminRouter.put("/jobCategories/:id", updateJobCategoryByIdController);
// DELETE	/api/v1/admin/jobCategories/:id	Delete a job category
adminRouter.delete("/jobCategories/:id", deleteJobCategoryByIdController);

export default adminRouter;
