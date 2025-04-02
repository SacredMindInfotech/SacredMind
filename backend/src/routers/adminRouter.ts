import { Router } from "express";
import {
  addUserToCourseController,
  removeUserFromCourseController,
  createCourseController,
  deleteCourseByIdController,
  getEnrollmentsController,
  updateCourseByIdController,
} from "../controllers/admin/course/course";
import {
  getAllUsersController,
  updateUserRoleController,
} from "../controllers/admin/user/user";
import {
  createCategoryController,
  deleteCategoryByIdController,
  updateCategoryByIdController,
} from "../controllers/admin/CourseCategory/category";
import {
  getCourseStats,
  getDashboardStats,
  getSalesStats,
  getUserStats,
} from "../controllers/admin/dashboard/dashboard";
import {
  getAllOrdersController,
  getOrderByIdController,
} from "../controllers/admin/orders/order";
import {
  createJobController,
  updateJobByIdController,
  deleteJobByIdController,
} from "../controllers/admin/job/job";
import {
  createJobCategoryController,
  deleteJobCategoryByIdController,
  updateJobCategoryByIdController,
} from "../controllers/admin/jobCategory/jobCategory";


import {
  createTopicController,
  deleteTopicByIdController,
  updateTopicByIdController,
} from "../controllers/topic/topicController";
import { createContentController, deleteContentByIdController, updateContentByIdController } from "../controllers/admin/content/content";
import { uploadS3 } from "../middleware/multer";
import { createModuleController, deleteModuleByIdController, updateModuleByIdController } from "../controllers/admin/courseModule/moduleController";
import { createDiscountTokenController, deleteDiscountTokenByIdController, getAllDiscountTokensController, updateDiscountTokenByIdController } from "../controllers/admin/discoutToken/discountTokens";

const adminRouter = Router();

// POST	/api/v1/admin/courses	Create a new course
adminRouter.post("/courses",uploadS3.single("image"), createCourseController);
// PUT	/api/v1/admin/courses/:id	Update course details
adminRouter.put("/courses/:id",uploadS3.single("image"), updateCourseByIdController);
// DELETE	/api/v1/admin/courses/:id	Delete a course
adminRouter.delete("/courses/:id", deleteCourseByIdController);
// GET /api/v1/admin/courses/:id/enrollments	Get all enrollments for a course
adminRouter.get("/courses/:id/enrollments", getEnrollmentsController);
//POST /api/v1/admin/:courseId/adduser Add a user to a course
adminRouter.post("/:courseId/adduser", addUserToCourseController);
//POST /api/v1/admin/:courseId/removeuser Remove a user from a course
adminRouter.post("/:courseId/removeuser", removeUserFromCourseController);

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



//POST /api/v1/admin/:courseId/module   Creating new module of a course by courseId
adminRouter.post("/:courseId/modules", createModuleController);
//PUT /api/v1/admin/:courseId/modules/:moduleId 
adminRouter.put("/:courseId/modules/:moduleId", updateModuleByIdController);
//DELETE /api/v1/admin/:courseId/modules/:moduleId   Deleting a module of a course by moduleId
adminRouter.delete("/:courseId/modules/:moduleId", deleteModuleByIdController);

//POST /api/v1/admin/modules/:moduleId/topics   Creating new topic of a module by moduleId
adminRouter.post("/modules/:moduleId/topics", createTopicController);
//PUT /api/v1/admin/modules/:moduleId/topics/:topicId   Updating a topic of a module by topicId
adminRouter.put("/modules/:moduleId/topics/:topicId", updateTopicByIdController);
//DELETE /api/v1/admin/modules/:moduleId/topics/:topicId   Deleting a topic of a module by topicId
adminRouter.delete("/modules/:moduleId/topics/:topicId", deleteTopicByIdController);



//POST /api/v1/admin/:topicId/content   Creating new content of a topic by topicId
adminRouter.post("/:topicId/content",uploadS3.single("file"), createContentController);
//PUT /api/v1/admin/content/:id   Updating a content of a topic by contentId
adminRouter.put("/content/:contentId", updateContentByIdController);
//DELETE /api/v1/admin/content/:id   Deleting a content of a topic by contentId
adminRouter.delete("/content/:contentId", deleteContentByIdController);

export default adminRouter;
