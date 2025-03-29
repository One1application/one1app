import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { selfIdentification } from "../controllers/userController.js";





export const userRouter = Router();


userRouter.use(authMiddleware);


userRouter.get('/details', selfIdentification);