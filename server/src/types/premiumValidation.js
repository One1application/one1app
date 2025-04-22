import { z } from "zod";

export const premiumSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    category: z.enum(["finance", "education", "food", "jobs", "entertainment"], {
        errorMap: () => ({ message: "Invalid category selected" })
    }),
    unlockPrice: z.preprocess(
        (val) => parseFloat(val),
        z.number().gt(0, "Unlock price must be greater than 0")
    ),
    content: z.object({
        text: z.string().optional(),
        images: z.array(
            z.object({
                name: z.string(),
                url: z.string().url()
            })
        ).optional(),
        files: z.array(
            z.object({
                name: z.string(),
                url: z.string().url()
            })
        ).optional()
    }),
    discountCodes: z.array(
        z.object({
            code: z.string(),
            discountPercentage: z.number().min(0).max(100),
            expirationDate: z.string().optional()
        })
    ).optional(),
    // advancedSettings: z.object({
    //     isActive: z.boolean().optional(),
    //     metadata: z.array(z.string()).optional()
    // }).optional()
});
