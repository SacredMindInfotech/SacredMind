import express from "express";
import { getAllCoursesController, getCourseByIdController } from "../controllers/course/courseController";

const courseRouter = express.Router();


//route to get all courses
// api/v1/course/
courseRouter.get("/", getAllCoursesController);

//route to get course by name of the course
// api/v1/course/:id
courseRouter.get("/:id", getCourseByIdController);





export default courseRouter;