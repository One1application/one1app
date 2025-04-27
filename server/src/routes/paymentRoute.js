import {
  checkStatus,
  createPhonePayOrder,
} from "../controllers/paymentController.js";

import express from "express";
export const paymentRouter = express.Router();
paymentRouter.post("/payment", createPhonePayOrder);
paymentRouter.get("/checkstatus", checkStatus);
