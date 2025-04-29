import express from "express";
import { z } from "zod";
import {premiumSchema} from "../types/premiumValidation.js";
import { SchemaValidator } from '../utils/validator.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createContent ,getPremiumContent,createPremiumAccess } from "../controllers/premiumController.js";
// import { getPremiumContent } from "../controllers/premiumAccessController.js";
// import { createPremiumAccess } from "../controllers/createPremiumAccessController.js";

const premiumRouter = express.Router();

premiumRouter.use(authMiddleware);

premiumRouter.post('/create-content',createContent);

premiumRouter.get('/premium-content/:contentId', getPremiumContent );

premiumRouter.post('/create-premium-access',createPremiumAccess)

export { premiumRouter };