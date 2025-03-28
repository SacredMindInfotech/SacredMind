import { Router } from "express";
import { getActiveJobsController, getAllJobsController, getJobByIdController } from "../controllers/job/jobController";

const router = Router();

// GET api/v1/job/
router.get("/", getActiveJobsController );
//GET api/v1/job
router.get("/alljobs",getAllJobsController);
// GET api/v1/job/:id
router.get("/:id", getJobByIdController);

export default router;
