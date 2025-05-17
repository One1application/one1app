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
               url: z.string().url()
            })
        ),
        files: z.array(
            z.object({
                url: z.string().url()
            })
        )
    }),
    expiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "End date must be a valid ISO date-time string",
    }).optional(),
    discount: z.object({
        discountCode: z.string().optional(),
        discountPercent: z.preprocess((val) => Number(val), z.number().min(1, "Discount percentage must be at least 1").max(99, "Discount percentage must not exceed 99")).optional(),
        discountExpiry: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "End date must be a valid ISO date-time string",
        })
      }).optional()
    // advancedSettings: z.object({
    //     isActive: z.boolean().optional(),
    //     metadata: z.array(z.string()).optional()
    // }).optional()
});
