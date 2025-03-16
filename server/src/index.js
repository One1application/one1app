import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { authenticationRouter } from "./routes/autheticationRoutes.js";
import { webinarRouter } from "./routes/webinarRoutes.js";
import { courseRouter } from "./routes/courseRoutes.js";
import { uploadRouter } from "./routes/uploadRoute.js";
import { walletRoutes } from "./routes/walletRoutes.js";
import { payingUpRoutes } from "./routes/payingUpRoutes.js";
import { telegramRouter } from "./routes/telegramRouter.js";
import rateLimit from "express-rate-limit";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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

const Port = process.env.SERVER_PORT || 5000;

app.listen(Port, () => {
  console.log("Server running on", Port);
});
