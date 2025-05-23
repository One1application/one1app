import prisma from "../db/dbClient.js";
import { premiumSchema } from "../types/premiumValidation.js"; // Import Zod validation schema
import { upload } from "../config/multer.js";
import { uploadOnImageKit } from "../config/imagekit.js";
import { randomUUID } from "crypto";
import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { PhonePayClient } from "../config/phonepay.js";

export async function createContent(req, res) {
  const { title, category, unlockPrice, discount, expiryDate, content } =
    req.body;
  const user = req.user;

  try {
    if (!title || !category || !unlockPrice || !content) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    if (typeof content !== "object") {
      return res.status(400).json({
        success: false,
        message:
          "Content must be an object with text, file, or image properties.",
      });
    }

    const { text, file, image } = content;
    if (!text && !file && !image) {
      return res.status(400).json({
        success: false,
        message: "Content must include at least one of: text, file, or image.",
      });
    }

    if (isNaN(parseFloat(unlockPrice)) || parseFloat(unlockPrice) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid unlock price. Price must be greater than zero.",
      });
    }

    if (discount) {
      if (typeof discount !== "object") {
        return res.status(400).json({
          success: false,
          message: "Discount must be an object.",
        });
      }

      // Check if discount has valid properties (optional validation)
      if (
        discount.percentage &&
        (isNaN(parseFloat(discount.percentage)) ||
          parseFloat(discount.percentage) < 0 ||
          parseFloat(discount.percentage) > 100)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid discount percentage. Should be between 0 and 100.",
        });
      }
    }

    // Validate expiry date if provided
    let formattedExpiryDate = null;
    if (expiryDate) {
      const expDate = new Date(expiryDate);
      const today = new Date();

      // Clear time portion for date comparison
      today.setHours(0, 0, 0, 0);

      if (isNaN(expDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid expiry date format.",
        });
      }

      if (expDate < today) {
        return res.status(400).json({
          success: false,
          message: "Expiry date must be greater than or equal to today's date.",
        });
      }

      formattedExpiryDate = expDate;
    }

    const premiumContent = await prisma.premiumContent.create({
      data: {
        title,
        category,
        unlockPrice: parseFloat(unlockPrice),
        content: content,
        discount: discount || null,
        // expiryDate: formattedExpiryDate,
        createdById: user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Content created successfully.",
      contentId: premiumContent.id,
    });
  } catch (error) {
    console.error("Error in creating content:", error);

    return res.status(500).json({
      success: false,
      message: "Error in creating content.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// edit premium content
export async function editContent(req, res) {
  const { contentId } = req.params;
  const { title, category, unlockPrice, discount, expiryDate, content } =
    req.body;
  const user = req.user;

  try {
    if (!contentId) {
      return res.status(400).json({
        success: false,
        message: "Content ID is required.",
      });
    }

    const existingContent = await prisma.premiumContent.findUnique({
      where: {
        id: contentId,
      },
    });

    if (!existingContent) {
      return res.status(404).json({
        success: false,
        message: "Premium content not found.",
      });
    }

    if (existingContent.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this content.",
      });
    }

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (unlockPrice !== undefined) {
      if (isNaN(parseFloat(unlockPrice)) || parseFloat(unlockPrice) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid unlock price. Price must be greater than zero.",
        });
      }
      updateData.unlockPrice = parseFloat(unlockPrice);
    }

    if (content !== undefined) {
      if (typeof content !== "object") {
        return res.status(400).json({
          success: false,
          message:
            "Content must be an object with text, file, or image properties.",
        });
      }

      const { text, file, image } = content;
      if (!text && !file && !image) {
        return res.status(400).json({
          success: false,
          message:
            "Content must include at least one of: text, file, or image.",
        });
      }

      updateData.content = content;
    }

    if (discount !== undefined) {
      if (discount === null) {
        updateData.discount = null;
      } else if (typeof discount === "object") {
        if (
          discount.percentage &&
          (isNaN(parseFloat(discount.percentage)) ||
            parseFloat(discount.percentage) < 0 ||
            parseFloat(discount.percentage) > 100)
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid discount percentage. Should be between 0 and 100.",
          });
        }
        updateData.discount = discount;
      } else {
        return res.status(400).json({
          success: false,
          message: "Discount must be an object or null.",
        });
      }
    }

    if (expiryDate !== undefined) {
      if (expiryDate === null) {
        updateData.expiryDate = null;
      } else {
        const expDate = new Date(expiryDate);
        const today = new Date();

        // Clear time portion for date comparison
        today.setHours(0, 0, 0, 0);

        if (isNaN(expDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid expiry date format.",
          });
        }

        if (expDate < today) {
          return res.status(400).json({
            success: false,
            message:
              "Expiry date must be greater than or equal to today's date.",
          });
        }

        updateData.expiryDate = expDate;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    // Update the premium content
    const updatedContent = await prisma.premiumContent.update({
      where: {
        id: contentId,
      },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Content updated successfully.",
      content: {
        id: updatedContent.id,
        title: updatedContent.title,
        category: updatedContent.category,
        unlockPrice: updatedContent.unlockPrice,
      },
    });
  } catch (error) {
    console.error("Error in updating content:", error);

    return res.status(500).json({
      success: false,
      message: "Error in updating content.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

//get creatorPremiumContent
export async function getCreatorContents(req, res) {
  try {
    const user = req.user;

    if(!user){
       return res.status(400).json({
         success: false,
         message: "User not found"
       })
    }

    const contents = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        premiumContent: {
          include: {
            _count: {
              select: {
                access: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Fetched premium contents successfully.",
      payload: contents,
    });
  } catch (error) {
    console.error("Error in fetching premium contents.", error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching premium contetnts.",
    });
  }
}

export async function deleteContent(req, res) {
  const { contentId } = req.params;
  const user = req.user;

  try {
    if (!contentId) {
      return res.status(400).json({
        success: false,
        message: "Content ID is required.",
      });
    }

    const existingContent = await prisma.premiumContent.findUnique({
      where: {
        id: contentId,
      },
    });

    if (!existingContent) {
      return res.status(404).json({
        success: false,
        message: "Premium content not found.",
      });
    }

    if (existingContent.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this content.",
      });
    }

    // Check if the content has been purchased by any users
    const accessCount = await prisma.premiumContentAccess.count({
      where: {
        contentId: contentId,
      },
    });

    if (accessCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete content that has been purchased by users.",
      });
    }

    // Delete the premium content
    await prisma.premiumContent.delete({
      where: {
        id: contentId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Content deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleting content:", error);

    return res.status(500).json({
      success: false,
      message: "Error in deleting content.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

export const getPremiumContentById= async (req, res) => {
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
        `${process.env.FRONTEND_URL}payment/verify?merchantOrderId=${orderId}&contentId=${contentId}`
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
