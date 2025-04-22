import express from "express";
import { register, signIn, verifyOtpForLogin ,verifyOtpForRegister} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const authenticationRouter = express.Router();

authenticationRouter.post("/register", register);
authenticationRouter.post("/register/verify-otp", verifyOtpForRegister);

authenticationRouter.post('/login', signIn);
authenticationRouter.post('/login/verify-otp', verifyOtpForLogin);

authenticationRouter.get("/verify-token", authMiddleware, (req, res) => {
	// If we get here, it means the token was valid (authMiddleware passed)
	return res.status(200).json({
		success: true,
		user: {
			id: req.user.id,
			role: req.user.role
		}
	});
});