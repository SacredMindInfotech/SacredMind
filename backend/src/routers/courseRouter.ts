import express from "express";
import { getAllCoursesController, getCourseByIdController } from "../controllers/course/courseController";

const courseRouter = express.Router();


//route to get all courses
courseRouter.get("/", getAllCoursesController);

//route to get course by name of the course
courseRouter.get("/:id", getCourseByIdController);





export default courseRouter;