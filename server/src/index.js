import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from 'url';
// Load environment variables from server/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { PhonePayClient } from "./config/phonepay.js";
import { authenticationRouter } from "./routes/autheticationRoutes.js";
import { courseRouter } from "./routes/courseRoutes.js";
import { payingUpRoutes } from "./routes/payingUpRoutes.js";
import { paymentRouter } from "./routes/paymentRoute.js";
import { premiumRouter } from "./routes/premiumRoutes.js";
import { telegramRouter } from "./routes/telegramRouter.js";
import { uploadRouter } from "./routes/uploadRoute.js";
import { userRouter } from "./routes/userRoutes.js";
import { walletRoutes } from "./routes/walletRoutes.js";
import { webinarRouter } from "./routes/webinarRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import { adminRouter } from "./routes/adminRoutes.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import { productRouter } from "./routes/productRoutes.js";
import airouter from "./routes/routes.ai.js"


const app = express();

app.set("trust proxy", 1);
app.use(express.json({ limit: "1gb" }));
// parse cookies
app.use(cookieParser());
app.use(express.urlencoded({ limit: "1gb", extended: true }));
 
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174'
    ],
    credentials: true,
  })
);


const postLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests, please try again.",
  headers: true,
});

app.use((req, res, next) => {
  if (req.method === "POST") {
    return postLimiter(req, res, next);
  }
  next();
});



app.use("/auth", authenticationRouter);
app.use("/webinar", webinarRouter);
app.use("/course", courseRouter);
app.use("/telegram", telegramRouter);
app.use("/wallet", walletRoutes);
app.use("/upload", uploadRouter);
app.use("/payingup", payingUpRoutes);
app.use("/self", userRouter);
app.use("/premium", premiumRouter);
app.use("/payment", paymentRouter);
app.use("/newsletter", newsletterRoutes);
app.use("/review", reviewRoutes);
app.use("/admin", adminRouter);
app.use('/product', productRouter)
app.use("/AI" , airouter)
 

const Port = process.env.SERVER_PORT || 5000;

app.listen(Port, async () => {
  console.log(await PhonePayClient.env);
  console.log("Server running on", Port);
});



app.use((err, req, res, next) => {
  console.error("Error:", err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
});

app.use(globalErrorHandler)