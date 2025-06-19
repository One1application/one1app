import { Router } from "express";
import { createTelegram, getCreatorTelegram, getTelegramById, purchaseTelegram, getOwnedGroups, sendLoginCode, signInTelegram } from "../controllers/telegramController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


export const telegramRouter = Router();

telegramRouter.post('/create-telegram', authMiddleware, createTelegram);
telegramRouter.get('/get-creator-telegrams', authMiddleware, getCreatorTelegram);
telegramRouter.get('/get-telegram-by-id/:telegramId', authMiddleware, getTelegramById);
telegramRouter.post('/purchase-telegram', authMiddleware, purchaseTelegram);
// Add route to fetch owned telegram groups
telegramRouter.get('/get-owned-groups', authMiddleware, getOwnedGroups);
// Telegram session login endpoints
telegramRouter.post('/send-login-code', sendLoginCode);
telegramRouter.post('/sign-in', signInTelegram);