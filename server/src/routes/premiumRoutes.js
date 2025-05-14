import express from "express";
import { z } from "zod";
import {premiumSchema} from "../types/premiumValidation.js";
import { SchemaValidator } from '../utils/validator.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createContent ,getPremiumContent,createPremiumAccess ,premiumDashboard, purchasePremiumContent} from "../controllers/premiumController.js";
// import { getPremiumContent } from "../controllers/premiumAccessController.js";
// import { createPremiumAccess } from "../controllers/createPremiumAccessController.js";

const premiumRouter = express.Router();

premiumRouter.use(authMiddleware);

premiumRouter.post('/create-content',createContent);  //to create premium content

premiumRouter.get('/premium-content/:contentId', getPremiumContent );  //to get premium content by contentId in params

premiumRouter.post('/create-premium-access',createPremiumAccess)  // to create access after payment 

premiumRouter.get('/premiumDashboard' , premiumDashboard)    //  to get premium content created by that creater 
premiumRouter.post('/purchase-premium-content', purchasePremiumContent);
export { premiumRouter };