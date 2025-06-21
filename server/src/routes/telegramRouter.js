import { Router } from "express";
import { createTelegram, getCreatorTelegram, getTelegramById, purchaseTelegram, getOwnedGroups, sendLoginCode, signInTelegram, deleteTelegram, editTelegram, editDiscount, deleteDiscount, createSubscription, editSubscription, deleteSubscription, createDiscount } from "../controllers/telegramController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


export const telegramRouter = Router();

telegramRouter.post('/create-telegrams', authMiddleware, createTelegram);
telegramRouter.delete('/:telegramId', authMiddleware, deleteTelegram);
telegramRouter.patch('/:telegramId', authMiddleware, editTelegram);
telegramRouter.post('/:telegramId/discounts', authMiddleware, createDiscount);
telegramRouter.patch('/:telegramId/discounts/:discountId', authMiddleware, editDiscount);
telegramRouter.delete('/:telegramId/discounts/:discountId', authMiddleware, deleteDiscount);
telegramRouter.post('/:telegramId/subscriptions', authMiddleware, createSubscription);
telegramRouter.patch('/:telegramId/subscriptions/:subscriptionId', authMiddleware, editSubscription);
telegramRouter.delete('/:telegramId/subscriptions/:subscriptionId', authMiddleware, deleteSubscription);


telegramRouter.get('/get-creator-telegrams', authMiddleware, getCreatorTelegram);
telegramRouter.get('/get-telegram-by-id/:telegramId', authMiddleware, getTelegramById);


telegramRouter.post('/purchase-telegram', authMiddleware, purchaseTelegram);



// Add route to fetch owned telegram groups
telegramRouter.get('/get-owned-groups', authMiddleware, getOwnedGroups);
// Telegram session login endpoints
telegramRouter.post('/send-login-code', sendLoginCode);
telegramRouter.post('/sign-in', signInTelegram);