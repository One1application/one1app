import { z } from "zod";

export const signupValidation = z.object({

    email: z.string().email("Invalid email format"),
    phone: z.string(),
    name: z.string(),
    role: z.enum(["User", "Creator","Admin","Co Admin","Super Admin"]),
    verified: z.boolean().default(false),
    goals: z.array(z.string()),
    socialMedia: z.string().optional(),
    heardAboutUs: z.string().optional(),
  
    

});

export const signUpOtpValidation = z.object({
  otp: z.string().length(6, "OTP must be 6 characters long"),
  phone: z.string(),
});
