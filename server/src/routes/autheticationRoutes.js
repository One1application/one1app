import express from "express";
import { register, signIn, verifyOtpForLogin ,verifyOtpForRegister} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const authenticationRouter = express.Router();

authenticationRouter.post("/register", register);
authenticationRouter.post("/register/verify-otp", verifyOtpForRegister);

authenticationRouter.post('/login', signIn);
authenticationRouter.post('/login/verify-otp', verifyOtpForLogin);

