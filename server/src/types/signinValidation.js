import { z } from 'zod';


export const signInValidation = z.object({
    email: z.string().email().optional(),
    phoneNumber: z.string().optional()
})
.refine(
    (data) => data.email || data.phoneNumber,
    {
        message: "Either email or phoneNumber is required.",
        path: ["email", "phoneNumber"]
    }
)

export const signInOtpValidation = z.object({
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    otp: z.string().max(6).min(6)
})
.refine(
    (data) => data.email || data.phoneNumber,
    {
        message: "Either email or phoneNumber is required.",
        path: ["email", "phoneNumber"]
    }
)