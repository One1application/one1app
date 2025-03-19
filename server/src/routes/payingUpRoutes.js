import express from 'express';
import { createPayingUp, editPayingUpDetails, getCreatorPayingUps, getPayingUpById, purchasePayingUp } from '../controllers/payingUpContoller.js';
import { authMiddleware, loggedMiddleware } from '../middlewares/authMiddleware.js';
import { SchemaValidator } from '../utils/validator.js';
import { payingUpSchema } from '../types/payingUpValidation.js';

export const payingUpRoutes = express.Router();

payingUpRoutes.get('/get-payingup-by-id/:payingUpId', loggedMiddleware,
    getPayingUpById
);

payingUpRoutes.use(authMiddleware);

payingUpRoutes.post('/create-payingup',
    createPayingUp
);

payingUpRoutes.post('/edit-payingup/:payingUpId',
    editPayingUpDetails
);

payingUpRoutes.get('/get-creator-payingups',
    getCreatorPayingUps
);

payingUpRoutes.post('/purchase-payingup',
    purchasePayingUp
);