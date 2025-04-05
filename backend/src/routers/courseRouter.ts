import express from "express";
import { getAllCoursesController, getCourseByIdController, getDiscountPriceByCourseIdController, getDiscountTokenByCourseIdController, getModulesByCourseIdController, getPopularCoursesController } from "../controllers/course/courseController";

const courseRouter = express.Router();


//route to get all courses
// api/v1/course/
courseRouter.get("/", getAllCoursesController);

//route to get popular courses  - by number of users enrolled
// api/v1/course/popular
courseRouter.get("/popular", getPopularCoursesController);

//route to get course by courseID of the course
// api/v1/course/:courseId
courseRouter.get("/:courseId", getCourseByIdController);


// Get all modules for a course
// api/v1/course/:courseId/modules
courseRouter.get("/:courseId/modules", getModulesByCourseIdController);

// get if any discount is applied on the course
// api/v1/course/:courseId/discount
courseRouter.get("/:courseId/discountAmount", getDiscountPriceByCourseIdController);

//get discount token by course id if any
// api/v1/course/:courseId/discountToken
courseRouter.get("/:courseId/discountToken", getDiscountTokenByCourseIdController);





export default courseRouter;