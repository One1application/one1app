import { z } from "zod";

export const payingUpSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    paymentDetails: z.object({
        paymentEnabled: z.boolean(),
        totalAmount: z.number().optional()
    }),
    category: z.object({
        name: z.string(),
        value: z.string()
    }),
    testimonials: z.array(z.object({
        name: z.string(),
        testimonial: z.string()
    })),
    faqs: z.array(z.object({
        question: z.string(),
        answer: z.string()
    })),
    refundPolicies: z.array(z.string()),
    tacs: z.array(z.string()),
    coverImage: z.object({
        name: z.string(),
        url: z.string().url()
    }),
    files: z.object({
        name: z.string(),
        value: z.array(z.object({
            name: z.string(),
            url: z.string().url()
        }))
    })
}); 