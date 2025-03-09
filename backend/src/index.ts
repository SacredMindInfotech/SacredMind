import express from "express";
import cors from "cors";
import userRouter from "./routers/userRouter";
import adminRouter from "./routers/adminRouter";
import { isAdmin, isUser } from "./middleware/authMiddleware";
import WebhookController from "./controllers/clerk-webhook/webhook-controller";
import courseRouter from "./routers/courseRouter";
import categoryRouter from "./routers/courseCategoryRouter";
import jobRouter from "./routers/jobRouter";
import jobCategoryRouter from "./routers/jobCategoryRouter";

const app = express();

app.use(cors());
app.use(express.json());

//sync clerk user with database
app.post("/api/webhooks/clerk", WebhookController);

//admin routes - operations on courses, users, orders only by admin.
app.use("/api/v1/admin", isAdmin, adminRouter);

//user routes
app.use("/api/v1/user", isUser, userRouter);

//course routes
app.use("/api/v1/course", courseRouter);

//category routes
app.use("/api/v1/category", categoryRouter);

//job routes
app.use("/api/v1/job", jobRouter);

//job category routes
app.use("/api/v1/jobCategory", jobCategoryRouter);

app.listen(3000, () => {
  console.log("server listening on port 3000");
});