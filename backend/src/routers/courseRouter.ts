import express from "express";
import { getAllCoursesController, getCourseByIdController, getModulesByCourseIdController, getPopularCoursesController } from "../controllers/course/courseController";

const courseRouter = express.Router();


//route to get all courses
// api/v1/course/
courseRouter.get("/", getAllCoursesController);

//route to get popular courses
// api/v1/course/popular
courseRouter.get("/popular", getPopularCoursesController);

//route to get course by name of the course
// api/v1/course/:id
courseRouter.get("/:id", getCourseByIdController);


// Get all modules for a course
// api/v1/course/:id/modules
courseRouter.get("/:id/modules", getModulesByCourseIdController);






export default courseRouter;