import { z } from "zod";

export const payingUpSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    paymentDetails: z.object({
        paymentEnabled: z.boolean(),
        totalAmount: z.preprocess((val) => Number(val), z.number().optional()) 
    }),
    category: z.object({
        title: z.string(),
        isActive: z.boolean(),
        categoryMetaData: z.array(z.string())
    }),
    testimonials: z.object({
        title: z.string(),
        isActive: z.boolean(),
        testimonialsMetaData: z.array(
            z.object({
                name: z.string(),
                testimonial: z.string()
            })
        )
    }),
    faqs: z.object({
        title: z.string(),
        isActive: z.boolean(),
        faQMetaData: z.array(
            z.object({
                question: z.string(),
                answer: z.string()
            })
        )
    }),
    refundPolicies: z.object({
        title: z.string(),
        isActive: z.boolean(),
        refundPoliciesMetaData: z.array(z.string())
    }),
    tacs: z.object({
        title: z.string(),
        isActive: z.boolean(),
        termAndConditionsMetaData: z.array(z.string())
    }),
    coverImage: z.object({
        title: z.string(),
        isActive: z.boolean(),
        value: z.string().url()
    }),
    files: z.object({
        title: z.string(),
        isActive: z.boolean(),
        value: z.array(
            z.object({
                name: z.string(),
                id: z.string(),
                url: z.string().url()
            })
        )
    }),
    discounts: z.array(z.unknown()) 
});