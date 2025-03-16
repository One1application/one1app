import { number, z } from "zod";

const linkSchema = z.object({
  meetingId: z.string().optional(),  
  meetingLink: z.string().url().optional(),
  meetingPassword: z.string().optional()
});

export const webinarSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  coverImage: z.string().url("Cover image must be a valid URL"),
  occurrence: z.string(),
  startDateTime: z.string(),
  endDateTime: z.string(),
  paymentEnabled: z.boolean().default(true),
  isOnline: z.boolean(),
  venue: z.string().optional(),
  link: linkSchema,
  isPaid: z.boolean(),
  quantity: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 1, "Quantity must be at least 1"),
  amount: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? undefined : Number(val)))
    .refine((val) => val === undefined || (typeof val === "number" && val > 0), "Amount must be a positive number")
    .optional(),
});
