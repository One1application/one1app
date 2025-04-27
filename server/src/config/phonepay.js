import { configDotenv } from "dotenv";
import { Env, StandardCheckoutClient } from "pg-sdk-node";
configDotenv();
export const PhonePayClient = StandardCheckoutClient.getInstance(
  process.env.PHONEPAY_CLIENT_ID,
  process.env.PHONEPAY_CLIENT_SECRATE,
  1,
  Env.SANDBOX // or Env.PRODUCTION for live
);
