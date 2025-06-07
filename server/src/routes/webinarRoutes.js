import express from "express";
import {
  createWebinar,
  editWebinar,
  getCreatorWebinars,
  getWebinarById,
  purchaseWebinar,
} from "../controllers/webinarController.js";
import {
  authMiddleware,
  loggedMiddleware,
} from "../middlewares/authMiddleware.js";
import { SchemaValidator } from "../utils/validator.js";
import { webinarSchema } from "../types/webinarValidation.js";

export const webinarRouter = express.Router();

webinarRouter.get(
  "/get-webinar-by-id/:webinarId",
  loggedMiddleware,
  getWebinarById
);

webinarRouter.use(authMiddleware);


webinarRouter.post('/create-webinar', SchemaValidator(webinarSchema),  createWebinar
);
webinarRouter.post('/edit-webinar/:webinarId', SchemaValidator(webinarSchema) ,editWebinar)

webinarRouter.get('/get-creator-webinars', 
    getCreatorWebinars
);

webinarRouter.post('/purchase-webinar', 
    purchaseWebinar
);