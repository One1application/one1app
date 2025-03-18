import { z } from "zod";

const linkSchema = z.object({
  meetingId: z.string().optional(),  
  meetingLink: z.string().url("Meeting link must be a valid URL").optional(),
  meetingPassword: z.string().optional()
});

export const webinarSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  coverImage: z.string().url("Cover image must be a valid URL"),
  occurrence: z.string(),
  startDateTime: z.coerce.date().refine((date) => date instanceof Date, {
    message: "Start date must be a valid date",
  }),
  endDateTime: z.coerce.date().refine((date) => date instanceof Date, {
    message: "End date must be a valid date",
  }),
  isPaid: z.boolean(),
  isOnline: z.boolean(),
  venue: z.string().optional(),
  link: linkSchema.optional(),
  quantity: z.coerce.number()
    .refine((val) => val >= 1, "Quantity must be at least 1"),
  amount: z.coerce.number()
    .optional()
    .refine((val) => val === undefined || val > 0, "Amount must be a positive number"),
});
