import prisma from "../db/dbClient.js";




export const selfIdentification = async (req, res) => {
    try {

        const user = req.user;

        const userDetails = await prisma.user.findFirst({
            where: {
                id: user.id
            },
            select: {
                email: true,
                phone: true,
                name: true,
                verified: true
            }
        })

        if(!userDetails) {
            return res.status(400).json({
                success: false,
                message: "USer not found."
            })
        }

        return res.status(200).json({
            success: true,
            userDetails
        });
        
    } catch (error) {
        console.error("Error in self identifying.", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server error."
        })
        
    }
}