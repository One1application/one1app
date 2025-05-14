import prisma from "../db/dbClient.js";
import { premiumSchema } from "../types/premiumValidation.js"; // Import Zod validation schema
import { upload } from "../config/multer.js";
import { uploadOnImageKit } from "../config/imagekit.js";
import { randomUUID } from "crypto";
import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { PhonePayClient } from "../config/phonepay.js";

export async function createContent(req, res) {
  const { title, category, unlockPrice, content, discount } = req.body;
  const user = req.user;
  console.log("req.body:", req.body);

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
    //     imageUrls.push(uploadResponse.url);
    //   } else {
    //     fileUrls.push(uploadResponse.url);
    //   }}

    await prisma.premiumContent.create({
      data: {
        title,
        category,
        unlockPrice: parseFloat(unlockPrice),
        content: content,
        discount: discount,
        createdById: user.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Content created successfully.",
    });
  } catch (error) {
    console.error("Error in creating content:", error);
    return res.status(500).json({
      success: false,
      message: "Error in creating content.",
    });
  }
}

export const getPremiumContent = async (req, res) => {
  const { contentId } = req.params;

  try {
    const userId = req.user.id;

    // Check user has access to the premium content
    const access = await prisma.premiumContentAccess.findFirst({
      where: {
        userId: userId,
        contentId: contentId,
        expiryDate: {
          gte: new Date(), // Check if the access is  valid
        },
      },
    });

    if (!access) {
      const content = await prisma.premiumContent.findFirst({
        where: { id: contentId },
        select: {
          title: true,
          unlockPrice: true,
        },
      });
      return res.status(200).json({
        success: true,
        message: "You have limited access to this premium content.",
        content: content,
      });
    }

    //  content if the user can access it
    const content = await prisma.premiumContent.findUnique({
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
};

export const createPremiumAccess = async (req, res) => {
  const { userId, contentId, expiryDate } = req.body;
  console.log(req.body);

  try {
    // user already have access or not
    const hasAccess = await prisma.premiumContentAccess.findFirst({
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
    const newAccess = await prisma.premiumContentAccess.create({
      data: {
        userId: userId,
        contentId: contentId,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //currently for 30 days
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
};

export const premiumDashboard = async (req, res) => {
  try {
    const response = await prisma.premiumContent.findMany({
      where: { createdById: req.user.id },
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching premium content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const purchasePremiumContent = async (req, res) => {
  try {
    const { contentId } = req.body;

    const user = req.user;

    if (!contentId) {
      return res.status(400).json({
        success: false,
        message: "Content id is required.",
      });
    }

    const content = await prisma.premiumContent.findUnique({
      where: {
        id: contentId,
      },
      include: {
        createdBy: true,
        access: user
          ? {
              where: {
                userId: user.id,
              },
            }
          : false,
      },
    });

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content not found.",
      });
    }

    if (content.access.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You already have access to this content.",
      });
    }

    if (content.createdById == user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot buy your own content.",
      });
    }

    const orderId = randomUUID();

    let totalAmount = content.unlockPrice;

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(orderId)
      .amount(totalAmount * 100)
      .redirectUrl(
        `${process.env.FRONTEND_URL}payment/verify?merchantOrderId=${orderId}&contentIdId=${contentId}`
      )
      .build();

    const response = await PhonePayClient.pay(request);
    return res.status(200).json({
      success: true,
      payload: {
        redirectUrl: response.redirectUrl,
      },
    });
  } catch (error) {
    console.error("Error in purchasing premium content.", error);
    return res.status(500).json({
      success: false,
      message: "Error in purchasing premium content. Please try again later",
    });
  }
};
