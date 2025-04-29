import {z} from 'zod';

export const telegramValidation = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    subscription: z.any(),
    imageUrl: z.string().url("Invalid image URL"), 
    genre: z.string().min(1, "Genre is required"),
    channelId: z.string().min(1, "Channel ID is required"),
    channelName: z.string().min(1, "Channel Name is required"),
    createdById: z.string().min(1, "Created By ID is required"),
  });