import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  getCoursePurchases,
  getPayingUpPurchases,
  getPremiumContentAccess,
  getTelegramSubscriptions,
  getWebinarPurchases,
  selfIdentification,
  updateUserProfile,
  userCustomers,
} from "../controllers/userController.js";

export const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.get("/details", selfIdentification);
userRouter.get("/customers", userCustomers);
userRouter.get("/purchases/webinars", getWebinarPurchases);
userRouter.get("/purchases/courses", getCoursePurchases);
userRouter.get("/purchases/premium-content", getPremiumContentAccess);
userRouter.get("/purchases/paying-up", getPayingUpPurchases);
userRouter.get("/purchases/telegram", getTelegramSubscriptions);
userRouter.put("/update/profile" , updateUserProfile)
