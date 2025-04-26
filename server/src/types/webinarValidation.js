import { z } from "zod";

const linkSchema = z.object({
  meetingId: z.string().optional(),  
  meetingLink: z.string().optional(),
  meetingPassword: z.string().optional(),
  platformLink: z.string().optional()
});

const discountSchema=z.object({
  discountCode: z.string().optional(),
  discountPercent: z.preprocess((val) => Number(val), z.number().min(1, "Discount percentage must be at least 1").max(99, "Discount percentage must not exceed 99")).optional(),
  discountExpiry: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End date must be a valid ISO date-time string",
  })
})

export const webinarSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  coverImage: z.string().url("Cover image must be a valid URL"),
  occurrence: z.string().optional(),
  startDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start date must be a valid ISO date-time string",
  }),
  endDateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End date must be a valid ISO date-time string",
  }),
  isPaid: z.boolean(),
  isOnline: z.boolean(),
  venue: z.string().optional(),
  link: linkSchema.optional(),
  discount:discountSchema.optional(),
  quantity: z.preprocess((val) => Number(val), z.number().min(1, "Quantity must be at least 1")),
  amount: z.preprocess((val) => parseFloat(val), z.number().nonnegative("Amount must be a positive number").optional()),
});
