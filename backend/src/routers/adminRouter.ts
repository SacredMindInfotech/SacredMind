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
import {
  createJobController,
  updateJobByIdController,
  deleteJobByIdController,
} from "../controllers/admin/jobOperations/job";
import {
  createJobCategoryController,
  deleteJobCategoryByIdController,
  updateJobCategoryByIdController,
} from "../controllers/admin/jobCategoryOperations/jobCategory";
import {
  createDiscountTokenController,
  deleteDiscountTokenByIdController,
  getAllDiscountTokensController,
  updateDiscountTokenByIdController,
} from "../controllers/discountTokens/discountTokenController";
import {
  createModuleController,
  deleteModuleByIdController,
  updateModuleByIdController,
} from "../controllers/module/moduleController";
import {
  createTopicController,
  deleteTopicByIdController,
  updateTopicByIdController,
} from "../controllers/topic/topicController";
import { createContentController, deleteContentByIdController, updateContentByIdController } from "../controllers/content/contentController";

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

// POST	/api/v1/admin/discountTokens	Create a new discount token
adminRouter.post("/discountTokens", createDiscountTokenController);
// GET	/api/v1/admin/discountTokens	Get all discount tokens
adminRouter.get("/discountTokens", getAllDiscountTokensController);
// PUT	/api/v1/admin/discountTokens/:id	Update discount token details
adminRouter.put("/discountTokens/:id", updateDiscountTokenByIdController);
// DELETE	/api/v1/admin/discountTokens/:id	Delete a discount token
adminRouter.delete("/discountTokens/:id", deleteDiscountTokenByIdController);

//POST /api/v1/admin/module/:id   Creating new module of a course by courseId
adminRouter.post("/module/:courseId", createModuleController);
//PUT /api/v1/admin/module/:id   Updating a module of a course -  only title can be updated by moduleId
adminRouter.put("/module/:moduleId", updateModuleByIdController);
//DELETE /api/v1/admin/module/:id   Deleting a module of a course by moduleId
adminRouter.delete("/module/:moduleId", deleteModuleByIdController);

//POST /api/v1/admin/topic/:id   Creating new topic of a module by moduleId
adminRouter.post("/topic/:moduleId", createTopicController);
//PUT /api/v1/admin/topic/:id   Updating a topic of a module by topicId
adminRouter.put("/topic/:topicId", updateTopicByIdController);
//DELETE /api/v1/admin/topic/:id   Deleting a topic of a module by topicId
adminRouter.delete("/topic/:topicId", deleteTopicByIdController);

//POST /api/v1/admin/content/:id   Creating new content of a topic by topicId
adminRouter.post("/content/:topicId", createContentController);
//PUT /api/v1/admin/content/:id   Updating a content of a topic by contentId
adminRouter.put("/content/:contentId", updateContentByIdController);
//DELETE /api/v1/admin/content/:id   Deleting a content of a topic by contentId
adminRouter.delete("/content/:contentId", deleteContentByIdController);

export default adminRouter;
