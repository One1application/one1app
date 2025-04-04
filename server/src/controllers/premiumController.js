import { prisma } from "../prismaClient"; // Ensure Prisma client is configured
import { premiumSchema } from "../types/premiumValidation.js"; // Import Zod validation schema

export async function createContent(req, res) {
    try {
        const { title, category, unlockPrice, content } = req.body;
        const user = req.user;

        const validatedData = premiumSchema.parse(req.body);

        
        await prisma.content.create({
            data: {
                title,
                category,
                unlockPrice: parseFloat(unlockPrice),
                text: content?.text || null,
                images: content?.images || [],
                files: content?.files || [],
                createdById: user.id, 
            }
        });

        return res.status(200).json({
            success: true,
            message: "Content created successfully."
        });

    } catch (error) {
        console.error("Error in creating content:", error);
        return res.status(500).json({
            success: false,
            message: "Error in creating content."
        });
    }
}
