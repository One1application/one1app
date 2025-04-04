import express from "express";
import { z } from "zod";
import {premiumSchema} from "../types/premiumValidation.js";
import { SchemaValidator } from '../utils/validator.js';
import { authMiddleware, loggedMiddleware } from "../middlewares/authMiddleware.js";
import { createContent } from "../controllers/premiumController.js";

const premiumRouter = express.Router();

premiumRouter.use(authMiddleware);

premiumRouter.post('/create-content', SchemaValidator(premiumSchema),  createContent
);

// Middleware to validate request body against the schema