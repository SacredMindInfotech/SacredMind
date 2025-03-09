import { Router } from "express";
import { getAllJobsController, getJobByIdController } from "../controllers/job/jobController";

const router = Router();

// GET api/v1/job/
router.get("/", getAllJobsController );
// GET api/v1/job/:id
router.get("/:id", getJobByIdController);

export default router;
