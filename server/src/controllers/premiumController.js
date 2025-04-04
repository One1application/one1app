import { prisma } from "../prismaClient"; // Ensure Prisma client is configured
import { premiumSchema } from "../types/premiumValidation.js"; // Import Zod validation schema

export async function createContent(req, res) {
    try {
        // Destructure required fields from request body
        const { title, category, unlockPrice, content } = req.body;
        const user = req.user; // Get authenticated user (ensure middleware is set up)

        // Validate input using Zod
        const validatedData = premiumSchema.parse(req.body);

        // Create content in the database
        await prisma.content.create({
            data: {
                title,
                category,
                unlockPrice: parseFloat(unlockPrice), // Ensure price is a float
                text: content?.text || null,
                images: content?.images || [],
                files: content?.files || [],
                createdById: user.id, // Associate with user
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
