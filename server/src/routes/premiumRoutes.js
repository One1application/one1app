import express from "express";
import { z } from "zod";
import {premiumSchema} from "../types/premiumValidation.js";
import { SchemaValidator } from '../utils/validator.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createContent } from "../controllers/premiumController.js";

const premiumRouter = express.Router();

premiumRouter.use(authMiddleware);

premiumRouter.post('/create-content', SchemaValidator(premiumSchema),  createContent
);

export { premiumRouter };