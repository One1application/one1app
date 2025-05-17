import express from "express";
import { z } from "zod";
import {premiumSchema} from "../types/premiumValidation.js";
import { SchemaValidator } from '../utils/validator.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createContent ,deleteContent,editContent,getCreatorContents , getPremiumContentById, purchasePremiumContent} from "../controllers/premiumController.js";
// import { getPremiumContent } from "../controllers/premiumAccessController.js";
// import { createPremiumAccess } from "../controllers/createPremiumAccessController.js";

const premiumRouter = express.Router();

premiumRouter.use(authMiddleware);

premiumRouter.post('/create-content',createContent);  //to create premium content
premiumRouter.post('/edit-premium-content/:contentId', editContent)
premiumRouter.delete('/delete-premium-content/:contentId', deleteContent)
premiumRouter.get('/premium-content/:contentId', getPremiumContentById );  //to get premium content by contentId in params
premiumRouter.get('/premiumDashboard' , getCreatorContents)    //  to get premium content created by that creater 
premiumRouter.post('/purchase-premium-content', purchasePremiumContent);
export { premiumRouter };