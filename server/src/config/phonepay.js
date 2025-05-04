import dotenv from "dotenv";
dotenv.config({});
import { Env, StandardCheckoutClient } from "pg-sdk-node";

export const PhonePayClient = StandardCheckoutClient.getInstance(
  process.env.PHONEPAY_CLIENT_ID,
  process.env.PHONEPAY_CLIENT_SECRATE,
  1,
  process.env.NODE_ENV === "development" ? Env.SANDBOX : Env.PRODUCTION
);
