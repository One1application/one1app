import express from 'express';
import { createWebinar, editWebinar, getCreatorWebinars, getWebinarById, purchaseWebinar } from '../controllers/webinarController.js';
import { authMiddleware, loggedMiddleware } from "../middlewares/authMiddleware.js";

export const webinarRouter = express.Router();

webinarRouter.get('/get-webinar-by-id/:webinarId', loggedMiddleware, 
    getWebinarById
);

webinarRouter.use(authMiddleware);


webinarRouter.post('/create-webinar', createWebinar
);
webinarRouter.post('/edit-webinar/:webinarId', editWebinar)

webinarRouter.get('/get-creator-webinars', 
    getCreatorWebinars
);

webinarRouter.post('/purchase-webinar', 
    purchaseWebinar
);