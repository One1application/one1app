import axios from "axios";
import { randomUUID } from "crypto";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { razorpay } from "../config/razorpay.js";
import prisma from "../db/dbClient.js";
import {
  applyCouponSchema,
  createDiscountSchema,
  createSubscriptionSchema,
  createTelegramSchema,
  editDiscountSchema,
  editSubscriptionSchema,
  editTelegramSchema,
  getTelegramByIdSchema,
  purchaseSubscriptionSchema,
} from "../types/telegramValidation.js";
import { sendOtp } from "../utils/sendOtp.js";
import { SchemaValidator } from "../utils/validator.js";

import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { PhonePayClient } from "../config/phonepay.js";
// API credentials loaded by index.js via dotenv.config()
const apiId = parseInt(process.env.API_ID, 10);
const apiHash = process.env.API_HASH;

// Create Telegram
export async function createTelegram(req, res) {
  try {
    const isValid = await SchemaValidator(createTelegramSchema, req.body, res);
    if (!isValid) return;

    const {
      coverImage,
      title,
      description,
      chatId,
      discounts,
      subscriptions,
      genre,
      gstDetails,
      courseDetails,
      inviteLink,
      sessionString,
    } = req.body;

    const user = req.user;

    // Additional server-side validation beyond schema
    
    // Validate title
    if (!title || title.trim().length < 3 || title.trim().length > 75) {
      return res.status(400).json({
        success: false,
        message: "Title must be between 3 and 75 characters"
      });
    }

    // Validate description
    if (!description || description.trim().length < 10 || description.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Description must be between 10 and 500 characters"
      });
    }

    // Validate subscriptions
    if (!subscriptions || subscriptions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one subscription is required"
      });
    }

    // Validate subscription data
    for (let i = 0; i < subscriptions.length; i++) {
      const sub = subscriptions[i];
      const subType = sub.inputValue || sub.type || sub.selectedValue;
      const subCost = parseFloat(sub.cost || sub.price || 0);
      const subDays = parseInt(sub.days || sub.validDays || 0);

      if (!subType || subType.trim().length < 3 || subType.trim().length > 50) {
        return res.status(400).json({
          success: false,
          message: `Subscription ${i + 1}: Type must be between 3 and 50 characters`
        });
      }

      if (subCost <= 0 || subCost > 100000) {
        return res.status(400).json({
          success: false,
          message: `Subscription ${i + 1}: Cost must be between ₹1 and ₹100,000`
        });
      }

      if (!sub.isLifetime && (subDays <= 0 || subDays > 3650)) {
        return res.status(400).json({
          success: false,
          message: `Subscription ${i + 1}: Days must be between 1 and 3650 for non-lifetime subscriptions`
        });
      }
    }

    // Validate discounts if provided
    if (discounts && discounts.length > 0) {
      for (let i = 0; i < discounts.length; i++) {
        const discount = discounts[i];

        if (!discount.code || discount.code.trim().length < 3 || discount.code.trim().length > 20) {
          return res.status(400).json({
            success: false,
            message: `Discount ${i + 1}: Code must be between 3 and 20 characters`
          });
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(discount.code.trim())) {
          return res.status(400).json({
            success: false,
            message: `Discount ${i + 1}: Code can only contain letters, numbers, hyphens, and underscores`
          });
        }

        if (!discount.percent || discount.percent <= 0 || discount.percent > 100) {
          return res.status(400).json({
            success: false,
            message: `Discount ${i + 1}: Percentage must be between 1 and 100`
          });
        }

        if (!discount.expiry) {
          return res.status(400).json({
            success: false,
            message: `Discount ${i + 1}: Expiry date is required`
          });
        }

        const expiryDate = new Date(discount.expiry);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (expiryDate <= today) {
          return res.status(400).json({
            success: false,
            message: `Discount ${i + 1}: Expiry date must be in the future`
          });
        }
      }

      // Check for duplicate discount codes (case-insensitive)
      const discountCodes = discounts.map(d => d.code.toLowerCase().trim());
      const uniqueCodes = new Set(discountCodes);
      if (uniqueCodes.size !== discountCodes.length) {
        return res.status(400).json({
          success: false,
          message: "Discount codes must be unique"
        });
      }
    }

    // Check for duplicate subscription types (case-insensitive)
    const subTypes = subscriptions.map(sub => (sub.inputValue || sub.type || sub.selectedValue).toLowerCase().trim());
    const uniqueSubTypes = new Set(subTypes);
    if (uniqueSubTypes.size !== subTypes.length) {
      return res.status(400).json({
        success: false,
        message: "Subscription types must be unique"
      });
    }

    // Validate GST details if provided
    if (gstDetails && gstDetails.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "GST details must not exceed 200 characters"
      });
    }

    // Validate course details if provided
    if (courseDetails && courseDetails.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Course details must not exceed 500 characters"
      });
    }

    // Validate genre
    const validGenres = ['education', 'entertainment', 'marketing'];
    if (!genre || !validGenres.includes(genre.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Genre must be education, entertainment, or marketing"
      });
    }

    console.log({
      coverImage,
      title,
      description,
      chatId,
      discounts,
      subscriptions,
      genre,
      gstDetails,
      courseDetails,
      inviteLink,
      sessionString, // <-- log it for now
    });

    // Check bot admin status
    let botHaveAdmin = false;
    let isGroupMonitored = false;
    if (chatId) {
      try {
        const adminCheckResponse = await axios.post(
          `${process.env.BOT_SERVER_URL}/check-admin-status`,
          { chatId }
        );
        if (adminCheckResponse.data.success) {
          botHaveAdmin = adminCheckResponse.data.isAdmin;
          isGroupMonitored = botHaveAdmin;
        }
      } catch (error) {
        console.error("Error checking bot admin status:");
      }
    }

    // Create Telegram with discounts and subscriptions in a transaction
    const telegram = await prisma.$transaction(async (tx) => {
      const newTelegram = await tx.telegram.create({
        data: {
          coverImage: coverImage || "https://default-cover.com",
          title,
          description,
          chatId,
          genre,
          gstDetails: gstDetails || null,
          courseDetails: courseDetails || null,
          inviteLink: inviteLink || null,
          createdById: user.id,
          isGroupMonitored,
        },
      });

      if (discounts && discounts.length > 0) {
        await tx.discount.createMany({
          data: discounts.map((d) => ({
            code: d.code,
            percent: d.percent,
            expiry: new Date(d.expiry),
            plan: d.plan || null,
            telegramId: newTelegram.id,
          })),
        });
      }

      if (subscriptions && subscriptions.length > 0) {
        await tx.subscription.createMany({
          data: subscriptions.map((s) => ({
            type: s.inputValue || s.type,
            price: parseFloat(s.cost || s.price || 0),
            validDays: s.isLifetime ? null : s.days || s.validDays,
            isLifetime: s.isLifetime || false,
            telegramId: newTelegram.id,
          })),
        });
      }

      return newTelegram;
    });

    return res.status(200).json({
      success: true,
      message: "Telegram created successfully.",
      payload: {
        telegramId: telegram.id,
        isGroupMonitored,
        botHaveAdmin,
        warning: !botHaveAdmin
          ? "Bot doesn't have admin permissions. Group will not be monitored until bot is made admin."
          : null,
      },
    });
  } catch (error) {
    // console.error("Error in creating telegram:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("chatId")) {
      return res.status(400).json({
        success: false,
        message: "Chat ID already exists.",
      });
    }
    if (error.code === "P2002" && error.meta?.target?.includes("type")) {
      return res.status(400).json({
        success: false,
        message: "Duplicate subscription type for this Telegram.",
      });
    }
    console.log(error?.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

// Edit the Telegram
export async function editTelegram(req, res) {
  try {
    const { telegramId } = req.params;
    const user = req.user;

    const isValid = await SchemaValidator(editTelegramSchema, req.body, res);
    if (!isValid) return;

    const {
      coverImage,
      title,
      description,
      genre,
      gstDetails,
      courseDetails,
      inviteLink,
    } = req.body;

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      select: { createdById: true },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: "Telegram not found.",
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this Telegram.",
      });
    }

    const updatedTelegram = await prisma.telegram.update({
      where: { id: telegramId },
      data: {
        coverImage,
        title,
        description,
        genre,
        gstDetails: gstDetails !== undefined ? gstDetails : undefined,
        courseDetails: courseDetails !== undefined ? courseDetails : undefined,
        inviteLink: inviteLink !== undefined ? inviteLink : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Telegram updated successfully.",
      payload: {
        telegramId: updatedTelegram.id,
      },
    });
  } catch (error) {
    console.error("Error in editing telegram:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("chatId")) {
      return res.status(400).json({
        success: false,
        message: "Chat ID already exists.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

// Delete Telegram
export async function deleteTelegram(req, res) {
  try {
    const { telegramId } = req.params;
    const user = req.user;

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      select: { createdById: true },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: "Telegram not found.",
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this Telegram.",
      });
    }

    await prisma.telegram.delete({
      where: { id: telegramId },
    });

    return res.status(200).json({
      success: true,
      message: "Telegram deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleting telegram:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

// Create Discount

export async function createDiscount(req, res) {
  try {
    const { telegramId } = req.params;
    const user = req.user;

    const isValid = await SchemaValidator(createDiscountSchema, req.body, res);
    if (!isValid) return;

    if (
      !telegramId.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Telegram ID format.",
      });
    }

    const { code, percent, expiry, plan } = req.body;

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      select: { createdById: true },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: "Telegram not found.",
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to add discounts to this Telegram.",
      });
    }

    if (plan) {
      const subscription = await prisma.subscription.findFirst({
        where: {
          telegramId,
          type: { equals: plan, mode: "insensitive" },
        },
      });
      if (!subscription) {
        return res.status(400).json({
          success: false,
          message: `Subscription type '${plan}' does not exist for this Telegram.`,
        });
      }
    }

    const existingDiscount = await prisma.discount.findFirst({
      where: { telegramId, code },
    });

    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        message: `Discount code '${code}' already exists for this Telegram.`,
      });
    }

    const discount = await prisma.discount.create({
      data: {
        code,
        percent,
        expiry: new Date(expiry),
        plan: plan || null,
        telegramId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Discount created successfully.",
      payload: { discountId: discount.id },
    });
  } catch (error) {
    console.error("Error in creating discount:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

// Edit Discounts
export async function editDiscount(req, res) {
  try {
    const { telegramId, discountId } = req.params;
    const user = req.user;

    const isValid = await SchemaValidator(editDiscountSchema, req.body, res);
    if (!isValid) return;

    const { code, percent, expiry, plan } = req.body;

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      select: { createdById: true },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: "Telegram not found.",
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit discounts for this Telegram.",
      });
    }

    const discount = await prisma.discount.findUnique({
      where: { id: discountId, telegramId },
    });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Discount not found.",
      });
    }

    if (plan) {
      const subscription = await prisma.subscription.findFirst({
        where: {
          telegramId,
          type: { equals: plan, mode: "insensitive" },
        },
      });
      if (!subscription) {
        return res.status(400).json({
          success: false,
          message: `Subscription type '${plan}' does not exist for this Telegram.`,
        });
      }
    }
    const existingDiscount = await prisma.discount.findFirst({
      where: {
        telegramId,
        code,
        id: {
          not: discountId,
        },
      },
    });

    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        message: `Discount code '${code}' already exists for this Telegram.`,
      });
    }

    const updatedDiscount = await prisma.discount.update({
      where: { id: discountId },
      data: {
        code: code !== undefined ? code : undefined,
        percent: percent !== undefined ? percent : undefined,
        expiry: expiry ? new Date(expiry) : undefined,
        plan: plan !== undefined ? plan : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Discount updated successfully.",
      payload: { discountId: updatedDiscount.id },
    });
  } catch (error) {
    console.error("Error in editing discount:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

//  Delete Discount
export async function deleteDiscount(req, res) {
  try {
    const { telegramId, discountId } = req.params;
    const user = req.user;

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      select: { createdById: true },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: "Telegram not found.",
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete discounts for this Telegram.",
      });
    }

    const discount = await prisma.discount.findUnique({
      where: { id: discountId, telegramId },
    });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Discount not found.",
      });
    }

    await prisma.discount.delete({
      where: { id: discountId },
    });

    return res.status(200).json({
      success: true,
      message: "Discount deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleting discount:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

// Telegram Subcription related Controller

export async function createSubscription(req, res) {
  try {
    const { telegramId } = req.params;
    const user = req.user;

    const isValid = await SchemaValidator(
      createSubscriptionSchema,
      req.body,
      res
    );
    if (!isValid) return;

    const { type, cost, price, days, validDays, isLifetime } = req.body;

    // Ensure price is provided and valid
    const subscriptionPrice = parseFloat(cost || price || 0);
    if (subscriptionPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0.",
      });
    }

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      select: { createdById: true },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: "Telegram not found.",
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to add subscriptions to this Telegram.",
      });
    }

    const existingSubscription = await prisma.subscription.findUnique({
      where: { telegramId_type: { telegramId, type } },
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: `Subscription type '${type}' already exists for this Telegram.`,
      });
    }

    const subscription = await prisma.subscription.create({
      data: {
        type,
        price: subscriptionPrice,
        validDays: isLifetime ? null : days || validDays,
        isLifetime: isLifetime || false,
        telegramId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Subscription created successfully.",
      payload: { subscriptionId: subscription.id },
    });
  } catch (error) {
    console.error("Error in creating subscription:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("type")) {
      return res.status(400).json({
        success: false,
        message: `Subscription type '${type}' already exists for this Telegram.`,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function editSubscription(req, res) {
  try {
    const { telegramId, subscriptionId } = req.params;
    const user = req.user;

    const isValid = await SchemaValidator(
      editSubscriptionSchema,
      req.body,
      res
    );
    if (!isValid) return;

    const { type, cost, price, days, validDays, isLifetime } = req.body;

    // Validate price if provided
    const subscriptionPrice =
      cost !== undefined
        ? parseFloat(cost)
        : price !== undefined
          ? parseFloat(price)
          : undefined;
    if (subscriptionPrice !== undefined && subscriptionPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0.",
      });
    }

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      select: { createdById: true },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: "Telegram not found.",
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to edit subscriptions for this Telegram.",
      });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId, telegramId },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found.",
      });
    }

    if (type && type !== subscription.type) {
      const existingSubscription = await prisma.subscription.findUnique({
        where: { telegramId_type: { telegramId, type } },
      });
      if (existingSubscription) {
        return res.status(400).json({
          success: false,
          message: `Subscription type '${type}' already exists for this Telegram.`,
        });
      }
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        type: type !== undefined ? type : undefined,
        price: subscriptionPrice !== undefined ? subscriptionPrice : undefined,
        validDays: isLifetime
          ? null
          : days !== undefined
            ? days
            : validDays !== undefined
              ? validDays
              : undefined,
        isLifetime: isLifetime !== undefined ? isLifetime : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Subscription updated successfully.",
      payload: { subscriptionId: updatedSubscription.id },
    });
  } catch (error) {
    console.error("Error in editing subscription:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("type")) {
      return res.status(400).json({
        success: false,
        message: `Subscription type '${type}' already exists for this Telegram.`,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function deleteSubscription(req, res) {
  try {
    const { telegramId, subscriptionId } = req.params;
    const user = req.user;

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      select: { createdById: true },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: "Telegram not found.",
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete subscriptions for this Telegram.",
      });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId, telegramId },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found.",
      });
    }

    // Check if the subscription is referenced by any discounts
    const referencedDiscounts = await prisma.discount.findMany({
      where: { telegramId, plan: subscription.type },
    });

    if (referencedDiscounts.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete subscription '${subscription.type}' because it is referenced by ${referencedDiscounts.length} discount(s).`,
      });
    }

    await prisma.subscription.delete({
      where: { id: subscriptionId },
    });

    return res.status(200).json({
      success: true,
      message: "Subscription deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleting subscription:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

// Telegram Subcription related Controller

export async function getCreatorTelegram(req, res) {
  try {
    const user = req.user;

    const telegrams = await prisma.telegram.findMany({
      where: {
        createdById: user.id,
      },
      include: {
        discounts: {
          select: {
            id: true,
            code: true,
            percent: true,
            expiry: true,
            plan: true,
          },
        },
        subscriptions: {
          select: {
            id: true,
            type: true,
            price: true,
            validDays: true,
            isLifetime: true,
          },
        },
        telegramSubscriptions: {
          include: {
            subscription: {
              select: {
                type: true,
                price: true,
              },
            },
            boughtBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            telegramSubscriptions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate analytics for each telegram
    const telegramsWithAnalytics = await Promise.all(
      telegrams.map(async (telegram) => {
        // Get total revenue from transactions
        const transactions = await prisma.transaction.findMany({
          where: {
            productId: telegram.id,
            productType: "TELEGRAM",
            status: "COMPLETED",
            creatorId: user.id,
          },
          select: {
            amount: true,
            amountAfterFee: true,
            createdAt: true,
          },
        });

        const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        const totalEarnings = transactions.reduce((sum, transaction) => sum + (transaction.amountAfterFee || 0), 0);

        // Calculate subscription stats
        const activeSubscriptions = telegram.telegramSubscriptions.filter(sub => !sub.isExpired).length;
        const expiredSubscriptions = telegram.telegramSubscriptions.filter(sub => sub.isExpired).length;
        const lifetimeSubscriptions = telegram.telegramSubscriptions.filter(sub => sub.isLifetime).length;

        // Get subscription type breakdown
        const subscriptionBreakdown = {};
        telegram.telegramSubscriptions.forEach(sub => {
          const type = sub.subscription.type;
          if (!subscriptionBreakdown[type]) {
            subscriptionBreakdown[type] = {
              count: 0,
              revenue: 0,
            };
          }
          subscriptionBreakdown[type].count++;
          subscriptionBreakdown[type].revenue += sub.subscription.price;
        });

        return {
          ...telegram,
          analytics: {
            totalSubscribers: telegram.telegramSubscriptions.length,
            activeSubscribers: activeSubscriptions,
            expiredSubscribers: expiredSubscriptions,
            lifetimeSubscribers: lifetimeSubscriptions,
            totalRevenue,
            totalEarnings,
            subscriptionBreakdown,
            recentTransactions: transactions.slice(0, 5),
          },
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Telegrams fetched successfully.",
      payload: {
        telegrams: telegramsWithAnalytics,
      },
    });
  } catch (error) {
    console.error("Error in fetching creator telegrams:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getCreatorTelegramById(req, res) {
  try {
    const { telegramId } = req.params;
    const user = req.user;

    const isValid = await SchemaValidator(
      getTelegramByIdSchema,
      { telegramId },
      res
    );
    if (!isValid) return;

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId, createdById: user?.id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        discounts: {
          select: {
            id: true,
            code: true,
            percent: true,
            expiry: true,
            plan: true,
          },
        },
        subscriptions: {
          select: {
            id: true,
            type: true,
            price: true,
            validDays: true,
            isLifetime: true,
          },
        },
        _count: {
          select: {
            telegramSubscriptions: true,
          },
        },
      },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: "Telegram not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Telegram fetched successfully.",
      payload: {
        telegram,
      },
    });
  } catch (error) {
    console.error("Error in fetching telegram by ID:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getTelegramById(req, res) {
  try {
    const { telegramId } = req.params;

    const isValid = await SchemaValidator(
      getTelegramByIdSchema,
      { telegramId },
      res
    );
    if (!isValid) return;

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        subscriptions: {
          select: {
            id: true,
            type: true,
            price: true,
            validDays: true,
            isLifetime: true,
          },
        },
        _count: {
          select: {
            telegramSubscriptions: true,
          },
        },
      },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: "Telegram not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Telegram fetched successfully.",
      payload: {
        telegram,
      },
    });
  } catch (error) {
    console.error("Error in fetching telegram by ID:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function applyCoupon(req, res) {
  try {
    const isValid = await SchemaValidator(applyCouponSchema, req.body, res);
    if (!isValid) return;

    const { telegramId, subscriptionId, couponCode } = req.body;

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId, telegramId },
      select: { price: true, type: true, isLifetime: true, validDays: true },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found.",
      });
    }

    let discountPrice = 0;
    let discount = null;

    if (couponCode) {
      discount = await prisma.discount.findFirst({
        where: {
          telegramId,
          code: couponCode,
          expiry: { gte: new Date() },
          OR: [
            { plan: null },
            { plan: { equals: subscription.type, mode: "insensitive" } },
          ],
        },
      });

      if (!discount) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired coupon code.",
        });
      }

      discountPrice = Math.round(subscription.price * (discount.percent / 100));
    }

    const totalAmount = Math.max(0, subscription.price - discountPrice);

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",
      payload: {
        originalPrice: subscription.price,
        discountPrice,
        totalAmount,
        couponCode: discount ? discount.code : null,
      },
    });
  } catch (error) {
    console.log("Error in applyCoupon:", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

const GST_RATE = 0.18; // 18% GST on commission

// Helper: Calculate expiry date
export const calculateExpiryDate = (validDays) => {
  if (!validDays) return null;
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + validDays);
  return expireDate;
};

// Helper: Check if subscription is renewable/upgradable
const isSubscriptionRenewable = (subscription) => {
  if (!subscription || subscription.isLifetime || subscription.isExpired)
    return false;
  const daysRemaining = Math.ceil(
    (new Date(subscription.expireDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  return daysRemaining <= 5;
};

// Helper: Calculate remaining days
const getRemainingDays = (expireDate) => {
  if (!expireDate) return 0;
  const diff = new Date(expireDate) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// Helper: Calculate commission and GST
const calculateCommissionAndGST = (amount, commissionRate) => {
  const commissionPercent = commissionRate || 8; // Default 8%
  const commissionAmount =
    Math.round(((commissionPercent * amount) / 100) * 100) / 100;
  const gstOnCommission = Math.round(commissionAmount * GST_RATE * 100) / 100;
  const amountAfterFee =
    Math.round((amount - commissionAmount - gstOnCommission) * 100) / 100;
  return { commissionAmount, gstOnCommission, amountAfterFee };
};

export async function purchaseTelegramSubscription(req, res) {
  try {
    const isValid = await SchemaValidator(
      purchaseSubscriptionSchema,
      req.body,
      res
    );
    if (!isValid) return;

    const { telegramId, subscriptionId, couponCode, validateOnly } = req.body;
    const user = req.user;
    console.log(req.body);
    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: "Telegram ID is required.",
      });
    }

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      select: {
        createdById: true,
        createdBy: {
          select: { creatorComission: true, paymentProvider: true },
        },
      },
    });
    console.log("TELEGRAM IS", telegram);


    const creator = await prisma.telegram.findFirst({
      where: {
        id: telegramId,
      },
      select: {
        createdById: true,
        createdBy: true,
      },
    });

    if (!creator) {
      return res
        .status(400)
        .json({ success: false, message: "Creator not found." });
    }

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: "Telegram not found.",
      });
    }

    if (telegram.createdById === user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot purchase your own Telegram subscription.",
      });
    }
    console.log("telegramId", telegramId);
    console.log("subscriptionId", subscriptionId);
    // Fix the subscription query - use findFirst instead of findUnique
    const subscription = await prisma.subscription.findUnique({
      where: {
        id: subscriptionId,
        telegramId: telegramId,
      },
      select: { price: true, type: true, isLifetime: true, validDays: true },
    });
    console.log("subscription", subscription);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found for this telegram.",
      });
    }

    // Check existing subscription
    const existingSubscription = await prisma.telegramSubscription.findFirst({
      where: {
        telegramId,
        boughtById: user.id,
        isExpired: false,
      },
      include: {
        subscription: {
          select: { type: true, validDays: true, isLifetime: true },
        },
      },
    });

    let CheckExistingSubcriptionTransactionStatus = null;
    if (existingSubscription) {
      CheckExistingSubcriptionTransactionStatus =
        await prisma.transaction.findUnique({
          where: {
            id: existingSubscription.paymentId,
          },
        });

      if (
        CheckExistingSubcriptionTransactionStatus !== null &&
        CheckExistingSubcriptionTransactionStatus.status === "PENDING"
      ) {
        await prisma.telegramSubscription.delete({
          where: {
            id: existingSubscription.id,
          },
        });

        await prisma.transaction.update({
          where: {
            id: CheckExistingSubcriptionTransactionStatus.id,
          },
          data: {
            status: "FAILED",
          },
        });
      }
    }

    let remainingDays = 0;
    let newValidDays = subscription.validDays;
    let markExistingAsExpired = false;

    if (
      existingSubscription &&
      CheckExistingSubcriptionTransactionStatus !== null &&
      CheckExistingSubcriptionTransactionStatus?.status === "COMPLETED"
    ) {
      if (!isSubscriptionRenewable(existingSubscription)) {
        return res.status(400).json({
          success: false,
          message:
            "You already have an active subscription. Renewal or upgrade is only allowed within 5 days of expiry.",
        });
      }

      remainingDays = getRemainingDays(existingSubscription.expireDate);
      markExistingAsExpired = true;

      if (existingSubscription.subscriptionId === subscriptionId) {
        // Renewal: Same plan
        newValidDays = (subscription.validDays || 0) + remainingDays;
      } else if (!subscription.isLifetime) {
        // Upgrade: Different non-lifetime plan
        newValidDays = (subscription.validDays || 0) + remainingDays;
      }
      // Lifetime upgrade: Ignore remaining days, no validDays
    }

    // Apply coupon
    let discountPrice = 0;
    let discount = null;

    if (couponCode) {
      discount = await prisma.discount.findFirst({
        where: {
          telegramId,
          code: couponCode,
          expiry: { gte: new Date() },
          OR: [
            { plan: null },
            { plan: { equals: subscription.type, mode: "insensitive" } },
          ],
        },
      });

      if (!discount) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired coupon code.",
        });
      }

      discountPrice =
        Math.round(subscription.price * (discount.percent / 100) * 100) / 100;
    }

    const totalAmount = Math.max(0, subscription.price - discountPrice);

    // Calculate commission and GST
    const { commissionAmount, gstOnCommission, amountAfterFee } =
      calculateCommissionAndGST(
        totalAmount,
        telegram.createdBy.creatorComission || 8
      );

    if (validateOnly) {
      return res.status(200).json({
        success: true,
        message: "Price validated successfully.",
        payload: {
          originalPrice: subscription.price,
          discountPrice,
          totalAmount,
          commissionAmount,
          gstOnCommission,
          amountAfterFee,
          validDays: newValidDays,
          isLifetime: subscription.isLifetime,
        },
      });
    }

    // Generate unique IDs for the transaction
    const orderId = randomUUID();
    const paymentId = randomUUID();

    // Get creator wallet
    const creatorWallet = await prisma.wallet.findUnique({
      where: {
        userId: creator.createdById,
      },
    });

    if (!creatorWallet) {
      return res.status(400).json({
        success: false,
        message: "Creator wallet not found.",
      });
    }

    // Create order and initiate payment
    if (telegram.createdBy.paymentProvider === "PhonePay") {
      console.log("orderId", subscriptionId);

      const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(orderId)
        .amount(totalAmount * 100)
        .redirectUrl(
          `${process.env.FRONTEND_URL}payment/verify?merchantOrderId=${orderId}&telegramId=${telegramId}&subscriptionId=${subscriptionId}&discountedPrice=${totalAmount}`
        )
        .build();
      console.log(
        `${process.env.FRONTEND_URL}payment/verify?merchantOrderId=${orderId}&telegramId=${telegramId}&subscriptionId=${subscriptionId}&discountedPrice=${totalAmount}`
      );
      const paymentResponse = await PhonePayClient.pay(request);
      console.log("response from phonepe", paymentResponse.orderId);

      return res.status(200).json({
        success: true,
        message: "Payment initiated successfully.",
        payload: {
          redirectUrl: paymentResponse.redirectUrl,
          paymentProvider: "PhonePay",
          orderId,
          transactionId: orderId,
          paymentId,
          totalAmount,
          discountPrice,
          commissionAmount,
        },
      });
    } else if (telegram.createdBy.paymentProvider === "Razorpay") {
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
        notes: {
          telegramId: telegramId,
          subscriptionId: subscriptionId,
          userId: user.id,
          discountedPrice: totalAmount,
          paymentId: paymentId,
        },
      });

      console.log("Razorpay order created", razorpayOrder);

      return res.status(200).json({
        success: true,
        message: "Payment initiated successfully.",
        payload: {
          razorpayOrderId: razorpayOrder.id,
          redirectUrl: `${process.env.FRONTEND_URL}/payment/verify`,
          amount: totalAmount * 100, // Amount in paise for frontend
          currency: "INR",
          paymentProvider: "Razorpay",
          orderId: razorpayOrder.id,
          transactionId: razorpayOrder.id,
          paymentId,
          totalAmount,
          discountPrice,
          key: process.env.RAZORPAY_KEY_ID,
          commissionAmount,
          gstOnCommission,
          amountAfterFee,
          validDays: newValidDays,
          isLifetime: subscription.isLifetime,
        },
      });
    } else {
      // Default payment method or direct wallet payment
      await prisma.$transaction(async (tx) => {
        // Create Transaction
        await tx.transaction.create({
          data: {
            id: paymentId,
            walletId: creatorWallet.id,
            amount: totalAmount,
            amountAfterFee,
            productId: telegramId,
            productType: "TELEGRAM",
            buyerId: user.id,
            creatorId: telegram.createdById,
            modeOfPayment: "WALLET",
            status: "COMPLETED",
          },
        });

        // Mark existing subscription as expired if applicable
        if (markExistingAsExpired && existingSubscription) {
          await tx.telegramSubscription.update({
            where: { id: existingSubscription.id },
            data: { isExpired: true, updatedAt: new Date() },
          });
        }

        // Create new TelegramSubscription
        await tx.telegramSubscription.create({
          data: {
            telegramId,
            subscriptionId,
            boughtById: user.id,
            validDays: subscription.isLifetime ? null : newValidDays,
            expireDate: subscription.isLifetime
              ? null
              : calculateExpiryDate(newValidDays),
            isLifetime: subscription.isLifetime,
            isExpired: false,
            paymentId,
            orderId,
          },
        });
      });

      return res.status(200).json({
        success: true,
        message: "Subscription purchased successfully.",
        payload: {
          paymentProvider: "WALLET",
          orderId,
          transactionId: paymentId,
          paymentId,
          totalAmount,
          discountPrice,
          commissionAmount,
          gstOnCommission,
          amountAfterFee,
          validDays: newValidDays,
          isLifetime: subscription.isLifetime,
        },
      });
    }
  } catch (error) {
    console.log(error);

    console.log("Error in purchaseTelegramSubscription:", {

      error: error.message,
      stack: error.stack,
      requestBody: req.body,
    });
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
export async function verifyTelegramPaymentCallback(req, res) {
  try {
    const { paymentId, transactionId } = req.body;

    if (!paymentId || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "Invalid callback data.",
      });
    }

    const transaction = await prisma.transaction.findFirst({
      where: { id: paymentId, phonePayTransId: transactionId },
      include: {
        wallet: { select: { userId: true } },
        creator: { select: { creatorComission: true } },
      },
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    if (transaction.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Transaction already processed.",
      });
    }

    // Verify payment with PhonePe
    const paymentDetails = await PhonePayClient.getOrderStatus(
      transaction.phonePayTransId
    );

    if (!paymentDetails || paymentDetails.state === "FAILED") {
      // Handle failed payment
      await prisma.$transaction(async (tx) => {
        // Update transaction to FAILED
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: "FAILED", updatedAt: new Date() },
        });

        // Mark subscription as expired
        await tx.telegramSubscription.update({
          where: { paymentId: transaction.id },
          data: { isExpired: true, updatedAt: new Date() },
        });
      });

      return res.status(200).json({
        success: true,
        message: "Payment callback processed successfully (failed payment).",
      });
    }

    // Handle successful payment
    await prisma.$transaction(async (tx) => {
      // Update transaction to COMPLETED
      await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: "COMPLETED", updatedAt: new Date() },
      });

      // Update creator's wallet
      await tx.wallet.update({
        where: { userId: transaction.creatorId },
        data: {
          balance: { increment: transaction.amountAfterFee },
          totalEarnings: { increment: transaction.amountAfterFee },
          updatedAt: new Date(),
        },
      });

      // // Generate and update Telegram invite link
      // const telegram = await tx.telegram.findUnique({
      //   where: { id: transaction.productId },
      //   select: { chatId: true },
      // });

      // try {
      //   const response = await axios.get(
      //     `${process.env.BOT_SERVER_URL}/channel/generate-invite?channelId=${telegram.chatId}&boughtById=${transaction.buyerId}`
      //   );
      //   await tx.telegram.update({
      //     where: { id: transaction.productId },
      //     data: { inviteLink: response.data.payload.inviteLink },
      //   });
      // } catch (error) {
      //   logger.error('Failed to generate Telegram invite link:', { error: error.message });
      //   throw new Error('Failed to generate invite link.');
      // }
    });
    console.log("PAYMENT DOEN");

    return res.status(200).json({
      success: true,
      message: "Payment callback processed successfully.",
      payload: {
        telegramId: transaction.productId,
      },
    });
  } catch (error) {
    console.log("Error in verifyTelegramPaymentCallback:", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

// Get detailed analytics for charts
export async function getTelegramAnalytics(req, res) {
  try {
    const { telegramId } = req.params;
    const { user } = req;
    const { period = 'month' } = req.query;

    // Validate period to prevent SQL injection
    const validPeriods = ['day', 'week', 'month', 'year'];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid period. Must be one of: day, week, month, year.',
      });
    }

    // Validate telegramId format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(telegramId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid telegramId format. Must be a valid UUID.',
      });
    }

    // Verify ownership
    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId, createdById: user.id },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: 'Telegram not found or access denied.',
      });
    }

    // Calculate date range based on period
    const now = new Date();
    const startDate = new Date(now);

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 30); // Last 30 days
        break;
      case 'week':
        startDate.setDate(now.getDate() - 84); // 12 weeks
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 12); // 12 months
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 5); // 5 years
        break;
      default:
        startDate.setMonth(now.getMonth() - 12); // Default to 12 months
    }

    // Fixed subscription trends query - construct the SQL string properly
    let subscriptionTrends;

    if (period === 'day') {
      subscriptionTrends = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('day', ts."createdAt") as period,
          COUNT(*)::integer as subscriptions,
          COALESCE(SUM(s.price), 0)::float as revenue,
          COUNT(CASE WHEN ts."isLifetime" = true THEN 1 END)::integer as lifetime_subs,
          COUNT(CASE WHEN ts."isExpired" = false THEN 1 END)::integer as active_subs
        FROM "TelegramSubscription" ts
        JOIN "Subscription" s ON ts."subscriptionId" = s.id
        WHERE ts."telegramId" = ${telegramId}
          AND ts."createdAt" >= ${startDate}
        GROUP BY DATE_TRUNC('day', ts."createdAt")
        ORDER BY period ASC
      `;
    } else if (period === 'week') {
      subscriptionTrends = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('week', ts."createdAt") as period,
          COUNT(*)::integer as subscriptions,
          COALESCE(SUM(s.price), 0)::float as revenue,
          COUNT(CASE WHEN ts."isLifetime" = true THEN 1 END)::integer as lifetime_subs,
          COUNT(CASE WHEN ts."isExpired" = false THEN 1 END)::integer as active_subs
        FROM "TelegramSubscription" ts
        JOIN "Subscription" s ON ts."subscriptionId" = s.id
        WHERE ts."telegramId" = ${telegramId}
          AND ts."createdAt" >= ${startDate}
        GROUP BY DATE_TRUNC('week', ts."createdAt")
        ORDER BY period ASC
      `;
    } else if (period === 'month') {
      subscriptionTrends = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', ts."createdAt") as period,
          COUNT(*)::integer as subscriptions,
          COALESCE(SUM(s.price), 0)::float as revenue,
          COUNT(CASE WHEN ts."isLifetime" = true THEN 1 END)::integer as lifetime_subs,
          COUNT(CASE WHEN ts."isExpired" = false THEN 1 END)::integer as active_subs
        FROM "TelegramSubscription" ts
        JOIN "Subscription" s ON ts."subscriptionId" = s.id
        WHERE ts."telegramId" = ${telegramId}
          AND ts."createdAt" >= ${startDate}
        GROUP BY DATE_TRUNC('month', ts."createdAt")
        ORDER BY period ASC
      `;
    } else {
      // year
      subscriptionTrends = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('year', ts."createdAt") as period,
          COUNT(*)::integer as subscriptions,
          COALESCE(SUM(s.price), 0)::float as revenue,
          COUNT(CASE WHEN ts."isLifetime" = true THEN 1 END)::integer as lifetime_subs,
          COUNT(CASE WHEN ts."isExpired" = false THEN 1 END)::integer as active_subs
        FROM "TelegramSubscription" ts
        JOIN "Subscription" s ON ts."subscriptionId" = s.id
        WHERE ts."telegramId" = ${telegramId}
          AND ts."createdAt" >= ${startDate}
        GROUP BY DATE_TRUNC('year', ts."createdAt")
        ORDER BY period ASC
      `;
    }

    // Get revenue by payment method
    const revenueByPayment = await prisma.transaction.groupBy({
      by: ['modeOfPayment'],
      where: {
        productId: telegramId,
        productType: 'TELEGRAM',
        status: 'COMPLETED',
        creatorId: user.id,
        createdAt: {
          gte: startDate,
        },
      },
      _sum: {
        amount: true,
        amountAfterFee: true,
      },
      _count: {
        _all: true,
      },
    });

    // Get subscription type breakdown
    const subscriptionTypeBreakdown = await prisma.telegramSubscription.groupBy({
      by: ['subscriptionId'],
      where: {
        telegramId,
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        _all: true,
      },
    });

    // Get subscription details with proper error handling
    const subscriptionBreakdownWithDetails = await Promise.all(
      subscriptionTypeBreakdown.map(async (item) => {
        try {
          const subscription = await prisma.subscription.findUnique({
            where: { id: item.subscriptionId },
            select: { type: true, price: true },
          });

          const details = await prisma.telegramSubscription.findMany({
            where: {
              telegramId,
              subscriptionId: item.subscriptionId,
              createdAt: { gte: startDate },
            },
            select: { isExpired: true },
          });

          return {
            type: subscription?.type || 'Unknown',
            total_subscriptions: item._count._all,
            active_subscriptions: details.filter((d) => !d.isExpired).length,
            total_revenue: (subscription?.price || 0) * item._count._all,
            avg_price: subscription?.price || 0,
          };
        } catch (error) {
          console.error('Error processing subscription breakdown:', error);
          return {
            type: 'Unknown',
            total_subscriptions: item._count._all,
            active_subscriptions: 0,
            total_revenue: 0,
            avg_price: 0,
          };
        }
      })
    );

    const finalSubscriptionTypeBreakdown = subscriptionBreakdownWithDetails.sort(
      (a, b) => b.total_subscriptions - a.total_subscriptions
    );

    // Get top subscribers by spending
    const topSubscribersData = await prisma.telegramSubscription.findMany({
      where: {
        telegramId,
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        boughtBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subscription: {
          select: {
            price: true,
          },
        },
      },
    });

    // Group by user and calculate totals
    const userSpendingMap = {};
    topSubscribersData.forEach((sub) => {
      const userId = sub.boughtBy.id;
      if (!userSpendingMap[userId]) {
        userSpendingMap[userId] = {
          name: sub.boughtBy.name,
          email: sub.boughtBy.email,
          subscription_count: 0,
          total_spent: 0,
          last_purchase: sub.createdAt,
        };
      }
      userSpendingMap[userId].subscription_count++;
      userSpendingMap[userId].total_spent += sub.subscription.price;
      if (new Date(sub.createdAt) > new Date(userSpendingMap[userId].last_purchase)) {
        userSpendingMap[userId].last_purchase = sub.createdAt;
      }
    });

    const topSubscribers = Object.values(userSpendingMap)
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 10);

    // Fixed overall stats query - removed the problematic JOIN and made it simpler
    const overallStats = await prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT ts."boughtById")::integer as unique_subscribers,
        COUNT(ts.id)::integer as total_subscriptions,
        COUNT(CASE WHEN ts."isExpired" = false THEN 1 END)::integer as active_subscriptions,
        COUNT(CASE WHEN ts."isLifetime" = true THEN 1 END)::integer as lifetime_subscriptions,
        COALESCE(AVG(s.price), 0)::float as avg_subscription_price
      FROM "TelegramSubscription" ts
      LEFT JOIN "Subscription" s ON ts."subscriptionId" = s.id
      WHERE ts."telegramId" = ${telegramId}
        AND ts."createdAt" >= ${startDate}
    `;

    // Get revenue data separately to avoid complex joins
    const revenueStats = await prisma.transaction.aggregate({
      where: {
        productId: telegramId,
        productType: 'TELEGRAM',
        status: 'COMPLETED',
        creatorId: user.id,
        createdAt: {
          gte: startDate,
        },
      },
      _sum: {
        amount: true,
        amountAfterFee: true,
      },
    });

    // Combine overall stats with revenue stats
    const combinedOverallStats = {
      ...overallStats[0],
      total_revenue: revenueStats._sum.amount || 0,
      total_earnings: revenueStats._sum.amountAfterFee || 0,
    };

    return res.status(200).json({
      success: true,
      message: 'Telegram analytics fetched successfully.',
      payload: {
        telegramId,
        period,
        dateRange: {
          startDate,
          endDate: now,
        },
        overallStats: combinedOverallStats || {},
        subscriptionTrends: subscriptionTrends || [],
        revenueByPayment: revenueByPayment || [],
        subscriptionTypeBreakdown: finalSubscriptionTypeBreakdown || [],
        topSubscribers: topSubscribers || [],
      },
    });
  } catch (error) {
    console.error('Error in fetching telegram analytics:', error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
// Get dashboard overview analytics for all telegrams
export async function getTelegramDashboardAnalytics(req, res) {
  try {
    const user = req.user;
    const { period = 'month' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    console.log(period);

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 84);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 12);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 5);
        break;
      default:
        startDate.setMonth(now.getMonth() - 12);
    }

    // Get overview stats for all user's telegrams
    const overviewStats = await prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT t.id)::int as total_telegrams,
        COUNT(DISTINCT ts."boughtById")::int as total_subscribers,
        COUNT(CASE WHEN ts."isExpired" = false THEN 1 END)::int as active_subscribers,
        COALESCE(SUM(tr.amount), 0)::float as total_revenue,
        COALESCE(SUM(tr."amountAfterFee"), 0)::float as "totalEarnings"
      FROM "Telegram" t
      LEFT JOIN "TelegramSubscription" ts ON t.id = ts."telegramId"
      LEFT JOIN "Transaction" tr ON tr."productId" = t.id 
        AND tr."productType" = 'TELEGRAM'
        AND tr.status = 'COMPLETED'
      WHERE t."createdById" = ${user.id}
        AND (ts."createdAt" >= ${startDate} OR ts."createdAt" IS NULL)
    `;

    // Get daily transaction trends for chart
    const dailyTransactionTrends = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', tr."createdAt") as transaction_date,
        COUNT(tr.id)::int as transaction_count,
        COALESCE(SUM(tr.amount), 0)::float as daily_revenue,
        COALESCE(SUM(tr."amountAfterFee"), 0)::float as daily_earnings,
        COUNT(DISTINCT tr."buyerId")::int as unique_buyers
      FROM "Transaction" tr
      JOIN "Telegram" t ON tr."productId" = t.id
      WHERE t."createdById" = ${user.id}
        AND tr."productType" = 'TELEGRAM'
        AND tr.status = 'COMPLETED'
        AND tr."createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('day', tr."createdAt")
      ORDER BY transaction_date ASC
    `;

    // Get weekly transaction trends (for better visualization when period is week/month)
    const weeklyTransactionTrends = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('week', tr."createdAt") as transaction_week,
        COUNT(tr.id)::int as transaction_count,
        COALESCE(SUM(tr.amount), 0)::float as weekly_revenue,
        COALESCE(SUM(tr."amountAfterFee"), 0)::float as weekly_earnings,
        COUNT(DISTINCT tr."buyerId")::int as unique_buyers
      FROM "Transaction" tr
      JOIN "Telegram" t ON tr."productId" = t.id
      WHERE t."createdById" = ${user.id}
        AND tr."productType" = 'TELEGRAM'
        AND tr.status = 'COMPLETED'
        AND tr."createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('week', tr."createdAt")
      ORDER BY transaction_week ASC
    `;

    // Get monthly transaction trends
    const monthlyTransactionTrends = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', tr."createdAt") as transaction_month,
        COUNT(tr.id)::int as transaction_count,
        COALESCE(SUM(tr.amount), 0)::float as monthly_revenue,
        COALESCE(SUM(tr."amountAfterFee"), 0)::float as monthly_earnings,
        COUNT(DISTINCT tr."buyerId")::int as unique_buyers
      FROM "Transaction" tr
      JOIN "Telegram" t ON tr."productId" = t.id
      WHERE t."createdById" = ${user.id}
        AND tr."productType" = 'TELEGRAM'
        AND tr.status = 'COMPLETED'
        AND tr."createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('month', tr."createdAt")
      ORDER BY transaction_month ASC
    `;

    // Get performance by telegram
    const telegramPerformance = await prisma.$queryRaw`
      SELECT 
        t.id,
        t.title,
        t."coverImage",
        COUNT(DISTINCT ts."boughtById")::int as subscribers,
        COUNT(CASE WHEN ts."isExpired" = false THEN 1 END)::int as active_subscribers,
        COALESCE(SUM(tr.amount), 0)::float as revenue,
        COALESCE(AVG(s.price), 0)::float as avg_price
      FROM "Telegram" t
      LEFT JOIN "TelegramSubscription" ts ON t.id = ts."telegramId"
      LEFT JOIN "Subscription" s ON ts."subscriptionId" = s.id
      LEFT JOIN "Transaction" tr ON tr."productId" = t.id 
        AND tr."productType" = 'TELEGRAM'
        AND tr.status = 'COMPLETED'
      WHERE t."createdById" = ${user.id}
        AND (ts."createdAt" >= ${startDate} OR ts."createdAt" IS NULL)
      GROUP BY t.id, t.title, t."coverImage"
      ORDER BY revenue DESC
    `;

    // Get recent activity
    const recentActivity = await prisma.$queryRaw`
      SELECT 
        ts.id,
        t.title as telegram_title,
        u.name as subscriber_name,
        s.type as subscription_type,
        s.price,
        ts."createdAt"
      FROM "TelegramSubscription" ts
      JOIN "Telegram" t ON ts."telegramId" = t.id
      JOIN "User" u ON ts."boughtById" = u.id
      JOIN "Subscription" s ON ts."subscriptionId" = s.id
      WHERE t."createdById" = ${user.id}
      ORDER BY ts."createdAt" DESC
      LIMIT 10
    `;

    // Choose appropriate chart data based on period
    let chartData = [];
    switch (period) {
      case 'week':
        chartData = dailyTransactionTrends.map(item => ({
          date: new Date(item.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: item.transaction_date,
          transactions: item.transaction_count,
          revenue: item.daily_revenue,
          earnings: item.daily_earnings,
          buyers: item.unique_buyers
        }));
        break;
      case 'month':
        chartData = weeklyTransactionTrends.map(item => ({
          date: `Week of ${new Date(item.transaction_week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          fullDate: item.transaction_week,
          transactions: item.transaction_count,
          revenue: item.weekly_revenue,
          earnings: item.weekly_earnings,
          buyers: item.unique_buyers
        }));
        break;
      case 'year':
        chartData = monthlyTransactionTrends.map(item => ({
          date: new Date(item.transaction_month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          fullDate: item.transaction_month,
          transactions: item.transaction_count,
          revenue: item.monthly_revenue,
          earnings: item.monthly_earnings,
          buyers: item.unique_buyers
        }));
        break;
      default:
        chartData = weeklyTransactionTrends.map(item => ({
          date: `Week of ${new Date(item.transaction_week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          fullDate: item.transaction_week,
          transactions: item.transaction_count,
          revenue: item.weekly_revenue,
          earnings: item.weekly_earnings,
          buyers: item.unique_buyers
        }));
    }

    return res.status(200).json({
      success: true,
      message: "Dashboard analytics fetched successfully.",
      payload: {
        period,
        dateRange: {
          startDate,
          endDate: now,
        },
        overviewStats: overviewStats[0] || {},
        telegramPerformance: telegramPerformance || [],
        recentActivity: recentActivity || [],
        chartData: chartData || [],
        transactionTrends: {
          daily: dailyTransactionTrends || [],
          weekly: weeklyTransactionTrends || [],
          monthly: monthlyTransactionTrends || []
        }
      },
    });
  } catch (error) {
    console.error("Error in fetching dashboard analytics:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

// ******************* Telegram Bot Related API************************
//subscription record and invitekink  created at walletController

export async function sendOtpToTelegramUser(req, res) {
  try {
    const { phoneNumber } = req.body;
    const user = req.user;
    await sendOtp(phoneNumber);

    return res.status(200).json({
      success: true,
      message:
        "Otp sent successfully, please DM the otp to @TelegramBotSupport",
    });
  } catch (err) {
    console.log("erorr in sending otp", err);
  }
}

// Notify user of subscriptions about to expire
export async function getExpiringSubscriptions(req, res) {
  try {
    const user = req.user;
    const daysBefore = parseInt(req.query.daysBefore, 10) || 3;
    const subs = await prisma.telegramSubscription.findMany({
      where: { boughtById: user.id },
      include: { telegram: true },
    });
    const now = new Date();
    const expiring = subs.filter((sub) => {
      const expireDate = new Date(sub.createdAt);
      expireDate.setDate(expireDate.getDate() + sub.validDays);
      const diffDays = Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24));
      return diffDays <= daysBefore;
    });
    return res.status(200).json({ success: true, payload: expiring });
  } catch (error) {
    console.error("Error fetching expiring subscriptions", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

export async function getOwnedGroups(req, res) {
  let sessionString;
  if (process.env.NODE_ENV === "development") {
    sessionString = req.headers["x-session-string"];
  } else {
    sessionString = req.cookies["telegramSession"];
  }
  if (!sessionString) {
    return res
      .status(401)
      .json({ success: false, message: "Session string missing." });
  }

  try {
    const client = new TelegramClient(
      new StringSession(sessionString),
      apiId,
      apiHash,
      { connectionRetries: 5 }
    );
    await client.connect();

    const dialogs = await client.getDialogs({});
    // Filter groups and map to plain objects
    const groups = dialogs
      .filter((d) => d.isGroup)
      .map((group) => ({
        id: group.id,
        title: group.title,
        username: group.username,
        accessHash: group.accessHash,
        // add other needed fields only
      }));

    await client.disconnect();

    return res.status(200).json({ success: true, payload: { groups } });
  } catch (error) {
    console.error("Error fetching owned groups:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
}

// Send login code to user's phone to obtain phoneCodeHash
export async function sendLoginCode(req, res) {
  try {
    console.log("sendLoginCode body:", req.body);
    if (!req.body || typeof req.body.phoneNumber !== "string") {
      console.error("Invalid or missing phoneNumber in request body");
      return res.status(400).json({
        success: false,
        message: "phoneNumber is required and must be a string",
      });
    }
    const apiId = process.env.API_ID;
    const apiHash = process.env.API_HASH;
    // Ensure API credentials
    if (!apiId || !apiHash) {
      console.error("Missing Telegram API credentials:", { apiId, apiHash });
      return res.status(500).json({
        success: false,
        message:
          "Telegram API ID or Hash is not configured. Please set TELEGRAM_API_ID and TELEGRAM_API_HASH in your environment.",
      });
    }

    const { phoneNumber } = req.body;
    console.log(
      "phoneNumber before sendCode:",
      phoneNumber,
      typeof phoneNumber
    );
    // Sanitize phone number: remove spaces and non-digit/plus characters
    const sanitizedNumber = phoneNumber.replace(/[^\d+]/g, "");
    console.log("Sanitized phoneNumber:", sanitizedNumber);
    const session = new StringSession("");
    const client = new TelegramClient(session, apiId, apiHash, {
      connectionRetries: 3,
    });
    await client.connect();
    // Send login code via client helper
    const sendCodeResult = await client.sendCode(
      { apiId, apiHash },
      sanitizedNumber
    );
    console.log("sendCodeResult:", sendCodeResult);
    const phoneCodeHash =
      sendCodeResult.phoneCodeHash || sendCodeResult.phone_code_hash;
    const sessionString = session.save();
    return res
      .status(200)
      .json({ success: true, payload: { phoneCodeHash, sessionString } });
  } catch (error) {
    console.error("Error sending login code:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send login code",
      error: error.message,
    });
  }
}

// Sign in with phoneNumber, code and phoneCodeHash, then store session string in cookie
export async function signInTelegram(req, res) {
  try {
    console.log("signInTelegram body:", req.body);
    console.log("Request body keys:", Object.keys(req.body));
    console.log("Request body values:", req.body);

    // Support multiple possible field names
    let phoneNumber =
      req.body.phoneNumber || req.body.phone_number || req.body.phone;
    let phoneCodeHash =
      req.body.phoneCodeHash || req.body.phone_code_hash || req.body.phoneHash;
    let code =
      req.body.code || req.body.phone_code || req.body.verificationCode;
    let sessionString = req.body.sessionString;

    console.log("Extracted values:", {
      phoneNumber,
      phoneCodeHash,
      code,
      sessionString,
    });

    if (!phoneNumber || !phoneCodeHash || !code || !sessionString) {
      return res.status(400).json({
        success: false,
        message:
          "phoneNumber, phoneCodeHash, code, and sessionString are required",
        received: { phoneNumber, phoneCodeHash, code, sessionString },
      });
    }

    if (
      typeof phoneNumber !== "string" ||
      typeof phoneCodeHash !== "string" ||
      typeof code !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "phoneNumber, phoneCodeHash, and code must be strings",
        types: {
          phoneNumber: typeof phoneNumber,
          phoneCodeHash: typeof phoneCodeHash,
          code: typeof code,
        },
      });
    }

    const sanitizedNumber = phoneNumber.replace(/[^\d+]/g, "");
    const session = new StringSession(sessionString);
    const client = new TelegramClient(session, apiId, apiHash, {
      connectionRetries: 3,
    });

    await client.connect();

    console.log("Inspecting Api.auth.SignIn constructor:", Api.auth.SignIn);
    console.log("About to call SignIn with:", {
      phoneNumber: sanitizedNumber,
      phoneCodeHash: phoneCodeHash,
      phoneCode: code,
    });

    const signInResult = await client.invoke(
      new Api.auth.SignIn({
        phoneNumber: sanitizedNumber, // Use camelCase
        phoneCodeHash: phoneCodeHash, // Use camelCase
        phoneCode: code, // Use camelCase
      })
    );

    console.log("Sign in successful:", signInResult);

    // Get the session string
    const finalSessionString = session.save();
    console.log("FINAL SESSION", finalSessionString);
    // Set cookie with proper options
    res.cookie("telegramSession", finalSessionString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      success: true,
      sessionString: finalSessionString, // <-- add this
      user: {
        id: signInResult.user?.id,
        firstName: signInResult.user?.first_name,
        lastName: signInResult.user?.last_name,
        username: signInResult.user?.username,
        phone: signInResult.user?.phone,
      },
    });
  } catch (error) {
    console.error("Error signing in Telegram:", error);

    // Handle specific Telegram errors
    if (error.message?.includes("PHONE_CODE_INVALID")) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
        error: "PHONE_CODE_INVALID",
      });
    }

    if (error.message?.includes("PHONE_CODE_EXPIRED")) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired",
        error: "PHONE_CODE_EXPIRED",
      });
    }

    if (error.message?.includes("SESSION_PASSWORD_NEEDED")) {
      return res.status(200).json({
        success: false,
        requiresPassword: true,
        message: "Two-factor authentication is enabled. Password required.",
        error: "SESSION_PASSWORD_NEEDED",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Telegram sign-in failed",
      error: error.message,
    });
  }
}

// ******************* Telegram Bot Related API*******************
