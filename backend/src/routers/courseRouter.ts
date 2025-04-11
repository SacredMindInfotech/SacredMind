import express from "express";
import { getCourseByIdController, getCourseByTitleFirstThreeLettersController } from "../controllers/course/courseController";
import { getAllCoursesController, getCourseByTitleController, getCoursesByStringOfCategoryIdsController, getCoursesDiscountsByStringOfCourseIdsController,  getDiscountTokenByCourseIdController, getModulesByCourseIdController, getPopularCoursesController } from "../controllers/course/courseController";

const courseRouter = express.Router();


//route to get all courses
// api/v1/course/
courseRouter.get("/", getAllCoursesController);

//route to get popular courses  - by number of users enrolled in the course
// api/v1/course/popular
courseRouter.get("/popular", getPopularCoursesController);

//route to get multiple courses by their category ids
// api/v1/course/byCategories
courseRouter.get("/byCategories",getCoursesByStringOfCategoryIdsController);

//route to get multiple courses's discounted prices by their course ids - this returns map of course id and discounted price
// api/v1/course/batchDiscounts
courseRouter.get("/batchDiscounts",getCoursesDiscountsByStringOfCourseIdsController);

//route to get course by its id
// api/v1/course/:courseId
courseRouter.get("/id/:courseId", getCourseByIdController);

//route to get course by course's title 
// api/v1/course/:courseTitle
courseRouter.get("/title/:courseTitle", getCourseByTitleController);

courseRouter.get("/titleFirstThree/:courseTitle", getCourseByTitleFirstThreeLettersController);


// Get all modules for a course by course's id
// api/v1/course/:courseId/modules
courseRouter.get("/:courseId/modules", getModulesByCourseIdController);

//get discount token by course id if any
// api/v1/course/:courseId/discountToken
courseRouter.get("/:courseId/discountToken", getDiscountTokenByCourseIdController);



export default courseRouter;