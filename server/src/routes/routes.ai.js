import express from "express";
import { generateDescription } from "../controllers/controller.ai.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/generate/description" , authMiddleware, generateDescription)

export default router;