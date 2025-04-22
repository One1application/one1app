import prisma from "../db/dbClient.js"; 
import { premiumSchema } from "../types/premiumValidation.js"; // Import Zod validation schema
import { upload } from '../config/multer.js'; 
import { uploadOnImageKit } from '../config/imagekit.js'; 



export async function createContent(req, res) {
   
        const { title, category, unlockPrice, 'content.text': contentText,'content.image': contentImage,'content.file': contentFile,'discountCodes.code': discountCode,'discountCodes.discountPercentage': discountPercentage,'discountCodes.expirationDate': expirationDate } = req.body;
        const user = req.user;
        console.log("req.body:",req.body);
       
        // const validatedData = premiumSchema.parse(req.body);
        // console.log("validate data :",validatedData);
        // const { files } = req;

        // if (!files || files.length === 0) {
        //   return res.status(400).json({ error: "No files uploaded" });
        // }
    
        // const imageUrls = [];
        // const fileUrls = [];
        
  try { 
     // Upload images to ImageKit and get URLs
    //  for (let file of files) {
    //   const isImage = file.mimetype.startsWith('image/');
    //   const uploadResponse = await uploadOnImageKit(file.path, 'premium-content', false);

    //   if (isImage) {
    //     imageUrls.push(uploadResponse.url); // Store image URLs
    //   } else {
    //     fileUrls.push(uploadResponse.url); // Storee file URLs
    //   }}
    

    await prisma.PremiumContent.create({
            data: {
                title,
                category,
                unlockPrice: parseFloat(unlockPrice),
                text: contentText || null,
                images: contentImage ? [contentImage] : [],
                files: contentFile ? [contentFile] : [],
                code:discountCode|| null,
                discountPercentage:parseFloat(discountPercentage) || null ,
                expirationDate:expirationDate || null ,
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

export const getPremiumContent = async (req,res)=>{
    const { contentId } = req.params; 
  
  try {
    const userId = req.user.id; 

    // Check user has access to the premium content
    const access = await prisma.PremiumContentAccess.findFirst({
      where: {
        userId: userId,
        contentId: contentId,
        expiryDate: {
          gte: new Date(), // Check if the access is still valid (not expired)
        },
      },
    });

    if (!access) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this premium content.",
      });
    }

    //  content if the user can access it
    const content = await prisma.PremiumContent.findUnique({
      where: {
        id: contentId,
      },
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve premium content",
      error: error.message,
    });
  }
}

export const createPremiumAccess = async (req,res)=>{
    const { userId, contentId, expiryDate } = req.body;
    console.log(req.body);
    
  
    try {
      // user already have access or not
      const hasAccess = await prisma.PremiumContentAccess.findFirst({
        where: {
          userId: userId,
          contentId: contentId,
        },
      });
  
      if (hasAccess) {
        return res.status(400).json({
          success: false,
          message: "User already has access to this content.",
        });
      }
  
      // Create a new access record
      const newAccess = await prisma.PremiumContentAccess.create({
        data: {
          userId: userId,
          contentId: contentId,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),  //currently for 30 days
        },
      });
  
      res.status(201).json({
        success: true,
        message: "Premium access granted successfully.",
        data: newAccess,
      });
    } catch (error) {
      console.error("Error granting access:", error);
      res.status(500).json({
        success: false,
        message: "Failed to grant premium content access.",
        error: error.message,
      });
    }
}