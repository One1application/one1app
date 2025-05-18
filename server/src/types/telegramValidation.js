import {z} from 'zod';

export const telegramValidation = z.object({
  coverImage: z.string().url().optional(),
  channelLink: z.string().url().optional(),
  chatId: z.string().min(1).optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  genre: z.string().min(1, "Genre is required"),
  discount: z.any().optional(),
  subscriptions: z
    .array(z.object({ days: z.number(), cost: z.number() }))
    .min(1, "At least one subscription is required"),
});