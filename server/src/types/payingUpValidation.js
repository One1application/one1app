import { z } from "zod";

export const payingUpSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    paymentDetails: z.object({
        currencySymbol: z.string(),
        paymentEnabled: z.boolean(),
        paymentLink: z.string().optional(),
        totalAmount: z.preprocess((val) => parseFloat(val), z.number().optional()),
        paymentButtonTitle: z.string(),
        ownerEmail: z.string().email(),
        ownerPhone: z.string()
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
                statement: z.string(),
                profilePic: z.string().url().optional(),
                rating: z.number(),
                id: z.string()
            }).optional(),
        )
    }).optional(),
    faqs: z.object({
        title: z.string(),
        isActive: z.boolean(),
        faQMetaData: z.array(
            z.object({
                question: z.string(),
                answer: z.string()
            })
        )
    }).optional(),
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
        value: z.array(
            z.object({
                name: z.string(),
                id: z.string(),
                url: z.string().url()
            })
        )
    }),

 discount: z.array(
  z.object({
    id: z.number().or(z.string().regex(/^\d+$/, "ID must be a numeric string")),
    code: z.string(),
    percent: z.number().or(z.string().transform(val => Number(val))),
    expiry: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Expiry date must be a valid ISO date-time string",
    })
  })
).optional()

   
})
