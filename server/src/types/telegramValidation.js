import {z} from 'zod';

export const telegramValidation = z.object({
  chatId: z.string().min(1, "Chat ID is required"),
  coverImage: z.string().url().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  genre: z.string().min(1, "Genre is required"),
  discount: z.any().optional(),
  subscriptions: z
    .array(z.object({ days: z.number(), cost: z.number() }))
    .min(1, "At least one subscription is required"),
});