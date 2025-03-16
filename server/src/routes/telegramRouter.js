import { Router } from "express";
import { createTelegram, getCreatorTelegram, getTelegramById, purchaseTelegram } from "../controllers/telegramController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


export const telegramRouter = Router();
telegramRouter.use(authMiddleware)

telegramRouter.post('/create-telegram', createTelegram);
telegramRouter.get('/get-creator-telegrams', getCreatorTelegram);
telegramRouter.get('/get-telegram-by-id/:telegramId', getTelegramById);
telegramRouter.post('/purchase-telegram', purchaseTelegram);