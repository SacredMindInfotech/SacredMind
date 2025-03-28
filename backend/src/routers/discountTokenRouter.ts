import { Router } from "express";
import { validateDiscountTokenController } from "../controllers/discountTokens/discountTokenController";
const tokenRouter=Router();

// api/v1/discountToken/:token
tokenRouter.get("/:token", validateDiscountTokenController);

export default tokenRouter;