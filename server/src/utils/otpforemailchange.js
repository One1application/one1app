import crypto from "crypto";

 
export const otpforemailchange = () => {
  return crypto.randomInt(100000, 999999).toString();
 
};