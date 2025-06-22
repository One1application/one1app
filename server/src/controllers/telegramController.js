import { randomUUID } from "crypto";
import prisma from "../db/dbClient.js";
import { SchemaValidator } from "../utils/validator.js";
import axios from "axios";
import { sendOtp } from "../utils/sendOtp.js";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { Api } from "telegram";
import {
  createTelegramSchema,
  editTelegramSchema,
  createDiscountSchema,
  editDiscountSchema,
  createSubscriptionSchema,
  editSubscriptionSchema,
  getTelegramByIdSchema,
  applyCouponSchema,
  purchaseSubscriptionSchema,
} from "../types/telegramValidation.js"

import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { PhonePayClient } from "../config/phonepay.js";
// API credentials loaded by index.js via dotenv.config()
const apiId = parseInt(process.env.TELEGRAM_API_ID, 10);
const apiHash = process.env.TELEGRAM_API_HASH;


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
    } = req.body;
    const user = req.user;

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
        console.error('Error checking bot admin status:', error);
      }
    }

    // Create Telegram with discounts and subscriptions in a transaction
    const telegram = await prisma.$transaction(async (tx) => {
      const newTelegram = await tx.telegram.create({
        data: {
          coverImage: coverImage || 'https://default-cover.com',
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

      await tx.subscription.createMany({
        data: subscriptions.map((s) => ({
          type: s.type,
          price: s.cost,
          validDays: s.isLifetime ? null : s.days,
          isLifetime: s.isLifetime || false,
          telegramId: newTelegram.id,
        })),
      });

      return newTelegram;
    });

    return res.status(200).json({
      success: true,
      message: 'Telegram created successfully.',
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
    console.error('Error in creating telegram:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('chatId')) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID already exists.',
      });
    }
    if (error.code === 'P2002' && error.meta?.target?.includes('type')) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate subscription type for this Telegram.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
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

    const { coverImage, title, description, genre, gstDetails, courseDetails, inviteLink } = req.body;

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      select: { createdById: true },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: 'Telegram not found.',
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this Telegram.',
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
      message: 'Telegram updated successfully.',
      payload: {
        telegramId: updatedTelegram.id,
      },
    });
  } catch (error) {
    console.error('Error in editing telegram:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('chatId')) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID already exists.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
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
        message: 'Telegram not found.',
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this Telegram.',
      });
    }

    await prisma.telegram.delete({
      where: { id: telegramId },
    });

    return res.status(200).json({
      success: true,
      message: 'Telegram deleted successfully.',
    });
  } catch (error) {
    console.error('Error in deleting telegram:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
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

    if (!telegramId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Telegram ID format.',
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
        message: 'Telegram not found.',
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add discounts to this Telegram.',
      });
    }

    if (plan) {
      const subscription = await prisma.subscription.findFirst({
        where: {
          telegramId,
          type: { equals: plan, mode: 'insensitive' },
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
      message: 'Discount created successfully.',
      payload: { discountId: discount.id },
    });
  } catch (error) {
    console.error('Error in creating discount:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
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
        message: 'Telegram not found.',
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit discounts for this Telegram.',
      });
    }

    const discount = await prisma.discount.findUnique({
      where: { id: discountId, telegramId },
    });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found.',
      });
    }

    if (plan) {
      const subscription = await prisma.subscription.findFirst({
        where: {
          telegramId,
          type: { equals: plan, mode: 'insensitive' },
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
        telegramId, code, id: {
          not: discountId
        }
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
      message: 'Discount updated successfully.',
      payload: { discountId: updatedDiscount.id },
    });
  } catch (error) {
    console.error('Error in editing discount:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
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
        message: 'Telegram not found.',
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete discounts for this Telegram.',
      });
    }

    const discount = await prisma.discount.findUnique({
      where: { id: discountId, telegramId },
    });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found.',
      });
    }

    await prisma.discount.delete({
      where: { id: discountId },
    });

    return res.status(200).json({
      success: true,
      message: 'Discount deleted successfully.',
    });
  } catch (error) {
    console.error('Error in deleting discount:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
}

// Telegram Subcription related Controller 

export async function createSubscription(req, res) {
  try {
    const { telegramId } = req.params;
    const user = req.user;

    const isValid = await SchemaValidator(createSubscriptionSchema, req.body, res);
    if (!isValid) return;

    const { type, cost, days, isLifetime } = req.body;

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      select: { createdById: true },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: 'Telegram not found.',
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add subscriptions to this Telegram.',
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
        price: cost,
        validDays: isLifetime ? null : days,
        isLifetime: isLifetime || false,
        telegramId,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Subscription created successfully.',
      payload: { subscriptionId: subscription.id },
    });
  } catch (error) {
    console.error('Error in creating subscription:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('type')) {
      return res.status(400).json({
        success: false,
        message: `Subscription type '${type}' already exists for this Telegram.`,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
}

export async function editSubscription(req, res) {
  try {
    const { telegramId, subscriptionId } = req.params;
    const user = req.user;

    const isValid = await SchemaValidator(editSubscriptionSchema, req.body, res);
    if (!isValid) return;

    const { type, cost, days, isLifetime } = req.body;

    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      select: { createdById: true },
    });

    if (!telegram) {
      return res.status(404).json({
        success: false,
        message: 'Telegram not found.',
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit subscriptions for this Telegram.',
      });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId, telegramId },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found.',
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
        price: cost !== undefined ? cost : undefined,
        validDays: isLifetime ? null : days !== undefined ? days : undefined,
        isLifetime: isLifetime !== undefined ? isLifetime : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Subscription updated successfully.',
      payload: { subscriptionId: updatedSubscription.id },
    });
  } catch (error) {
    console.error('Error in editing subscription:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('type')) {
      return res.status(400).json({
        success: false,
        message: `Subscription type '${type}' already exists for this Telegram.`,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
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
        message: 'Telegram not found.',
      });
    }

    if (telegram.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete subscriptions for this Telegram.',
      });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId, telegramId },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found.',
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
      message: 'Subscription deleted successfully.',
    });
  } catch (error) {
    console.error('Error in deleting subscription:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
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
        _count: {
          select: {
            telegramSubscriptions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Telegrams fetched successfully.',
      payload: {
        telegrams,
      },
    });
  } catch (error) {
    console.error('Error in fetching creator telegrams:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
}

export async function getTelegramById(req, res) {
  try {
    const { telegramId } = req.params;

    const isValid = await SchemaValidator(getTelegramByIdSchema, { telegramId }, res);
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
        message: 'Telegram not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Telegram fetched successfully.',
      payload: {
        telegram,
      },
    });
  } catch (error) {
    console.error('Error in fetching telegram by ID:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
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
        message: 'Subscription not found.',
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
            { plan: { equals: subscription.type, mode: 'insensitive' } },
          ],
        },
      });

      if (!discount) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired coupon code.',
        });
      }

      discountPrice = Math.round(subscription.price * (discount.percent / 100));
    }

    const totalAmount = Math.max(0, subscription.price - discountPrice);

    return res.status(200).json({
      success: true,
      message: 'Coupon applied successfully.',
      payload: {
        originalPrice: subscription.price,
        discountPrice,
        totalAmount,
        couponCode: discount ? discount.code : null,
      },
    });
  } catch (error) {
    console.log('Error in applyCoupon:', { error: error.message, stack: error.stack });
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
}

const GST_RATE = 0.18; // 18% GST on commission

// Helper: Calculate expiry date
const calculateExpiryDate = (validDays) => {
  if (!validDays) return null;
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + validDays);
  return expireDate;
};

// Helper: Check if subscription is renewable/upgradable
const isSubscriptionRenewable = (subscription) => {
  if (!subscription || subscription.isLifetime || subscription.isExpired) return false;
  const daysRemaining = Math.ceil((new Date(subscription.expireDate) - new Date()) / (1000 * 60 * 60 * 24));
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
  const commissionAmount = Math.round((commissionPercent * amount) / 100 * 100) / 100;
  const gstOnCommission = Math.round(commissionAmount * GST_RATE * 100) / 100;
  const amountAfterFee = Math.round((amount - commissionAmount - gstOnCommission) * 100) / 100;
  return { commissionAmount, gstOnCommission, amountAfterFee };
};

export async function purchaseTelegramSubscription(req, res) {
  try {
    const isValid = await SchemaValidator(purchaseSubscriptionSchema, req.body, res);
    if (!isValid) return;

    const { telegramId, subscriptionId, couponCode, validateOnly } = req.body;
    const user = req.user;

    // Fetch Telegram and Subscription
    const telegram = await prisma.telegram.findUnique({
      where: { id: telegramId },
      select: { createdById: true, createdBy: { select: { creatorComission: true } } },
    });

    const creator = await prisma.telegram.findFirst({
      where: {
        id: telegramId,
      },
      select: {
        createdById: true,
        createdBy: true
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
        message: 'Telegram not found.',
      });
    }

    if (telegram.createdById === user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot purchase your own Telegram subscription.',
      });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId, telegramId },
      select: { price: true, type: true, isLifetime: true, validDays: true },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found.',
      });
    }

    // Check existing subscription
    const existingSubscription = await prisma.telegramSubscription.findFirst({
      where: {
        telegramId,
        boughtById: user.id,
        isExpired: false,
      },
      include: { subscription: { select: { type: true, validDays: true, isLifetime: true } } },
    });
    let CheckExistingSubcriptionTransactionStatus = null;
    if (existingSubscription) {
      CheckExistingSubcriptionTransactionStatus = await prisma.transaction.findUnique({
        where: {
          id: existingSubscription.paymentId
        }
      })


      if (CheckExistingSubcriptionTransactionStatus !== null && CheckExistingSubcriptionTransactionStatus.status === "PENDING") {
        await prisma.telegramSubscription.delete({
          where: {
            id: existingSubscription.id
          },
        })

        await prisma.transaction.update({
          where: {
            id: CheckExistingSubcriptionTransactionStatus.id
          },
          data: {
            status: "FAILED"
          }
        })
      }
    }

    let remainingDays = 0;
    let newValidDays = subscription.validDays;
    let markExistingAsExpired = false;

    if (existingSubscription && CheckExistingSubcriptionTransactionStatus !== null && CheckExistingSubcriptionTransactionStatus?.status === "COMPLETED") {
      if (!isSubscriptionRenewable(existingSubscription)) {
        return res.status(400).json({
          success: false,
          message: 'You already have an active subscription. Renewal or upgrade is only allowed within 5 days of expiry.',
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
            { plan: { equals: subscription.type, mode: 'insensitive' } },
          ],
        },
      });

      if (!discount) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired coupon code.',
        });
      }

      discountPrice = Math.round(subscription.price * (discount.percent / 100) * 100) / 100;
    }

    const totalAmount = Math.max(0, subscription.price - discountPrice);

    // Calculate commission and GST
    const { commissionAmount, gstOnCommission, amountAfterFee } = calculateCommissionAndGST(totalAmount, telegram.createdBy.creatorComission || 8);

    if (validateOnly) {
      return res.status(200).json({
        success: true,
        message: 'Price validated successfully.',
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

    // Create order and initiate payment
    const orderId = randomUUID();
    const paymentId = randomUUID();
    let transactionId = null

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(orderId)
      .amount(totalAmount * 100) // PhonePe expects amount in paise
      .redirectUrl(`${process.env.FRONTEND_URL}/payment/verify?orderId=${orderId}&telegramId=${telegramId}&subscriptionId=${subscriptionId}`)
      .build();

    const paymentResponse = await PhonePayClient.pay(request);

    if (!paymentResponse.redirectUrl) {
      throw new Error('Failed to initiate payment.');
    }



    const creatorWallet = await prisma.wallet.findUnique({
      where: {
        userId: creator.createdById,
      },


    });

    // Create transaction and subscription in a Prisma transaction
    await prisma.$transaction(async (tx) => {
      // Create Transaction
      await tx.transaction.create({
        data: {
          id: paymentId,
          walletId: creatorWallet.id,
          amount: totalAmount,
          amountAfterFee,
          productId: telegramId,
          productType: 'TELEGRAM',
          buyerId: user.id,
          creatorId: telegram.createdById,
          modeOfPayment: 'UPI',
          status: 'PENDING',
          phonePayTransId: paymentResponse.orderId,
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
          expireDate: subscription.isLifetime ? null : calculateExpiryDate(newValidDays),
          isLifetime: subscription.isLifetime,
          isExpired: false,
          paymentId,
          orderId,
        },
      });

      transactionId = paymentResponse.orderId

    });

    return res.status(200).json({
      success: true,
      message: 'Payment initiated successfully.',
      payload: {
        redirectUrl: paymentResponse.redirectUrl,
        orderId,
        transactionId,
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
  } catch (error) {
    console.log('Error in purchaseTelegramSubscription:', { error: error.message, stack: error.stack });
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
}

export async function verifyTelegramPaymentCallback(req, res) {
  try {
    const { paymentId, transactionId } = req.body;

    if (!paymentId || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid callback data.',
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
        message: 'Transaction not found.',
      });
    }

    if (transaction.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Transaction already processed.',
      });
    }

    // Verify payment with PhonePe
    const paymentDetails = await PhonePayClient.getOrderStatus(transaction.phonePayTransId);

    if (!paymentDetails || paymentDetails.state === 'FAILED') {
      // Handle failed payment
      await prisma.$transaction(async (tx) => {
        // Update transaction to FAILED
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: 'FAILED', updatedAt: new Date() },
        });


        // Mark subscription as expired
        await tx.telegramSubscription.update({
          where: { paymentId: transaction.id },
          data: { isExpired: true, updatedAt: new Date() },
        });
      });

      return res.status(200).json({
        success: true,
        message: 'Payment callback processed successfully (failed payment).',
      });
    }

    // Handle successful payment
    await prisma.$transaction(async (tx) => {
      // Update transaction to COMPLETED
      await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: 'COMPLETED', updatedAt: new Date() },
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

    return res.status(200).json({
      success: true,
      message: 'Payment callback processed successfully.',
      payload: {
        telegramId: transaction.productId,

      },
    });
  } catch (error) {
    console.log('Error in verifyTelegramPaymentCallback:', { error: error.message, stack: error.stack });
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
}



// Purchase 
// export async function purchaseTelegram(req, res) {
//   try {
//     const { telegramId, days } = req.body;
//     const user = req.user;

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     if (!telegramId) {
//       return res.status(400).json({
//         success: false,
//         message: "Telegram Id required.",
//       });
//     }

//     const telegram = await prisma.telegram.findUnique({
//       where: {
//         id: telegramId,
//       },
//       select: {
//         createdBy: true,
//         subscription: true,
//         discount: true,
//         isGroupMonitored: true,
//         botHaveAdmin: true,
//       },
//     });

//     if (!telegram) {
//       return res.status(400).json({
//         success: false,
//         message: "Telegram not found.",
//       });
//     }

//     // if (telegram.createdById === user.id) {
//     //     return res.status(400).json({
//     //         success: false,
//     //         message: "You cannot purchase your own channel."
//     //     })
//     // }

//     if (!telegram.isGroupMonitored || !telegram.botHaveAdmin) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "This channel is not available for subscription. Bot doesn't have admin permissions.",
//       });
//     }

//     const subscriptionDetails = telegram.subscription.find(
//       (sub) => sub.days == days
//     );

//     if (!subscriptionDetails) {
//       return res.status(400).json({
//         success: false,
//         message: "No subscription found.",
//       });
//     }
//     // let discountData = telegram?.discount || null;
//     // console.log("discountData", discountData);
//     let totalAmount = subscriptionDetails.cost;

//     const orderId = randomUUID();

//     const request = StandardCheckoutPayRequest.builder()
//       .merchantOrderId(orderId)
//       .amount(totalAmount * 100)
//       .redirectUrl(
//         `${process.env.FRONTEND_URL}payment/verify?merchantOrderId=${orderId}&telegramId=${telegramId}`
//       )
//       .build();

//     const response = await PhonePayClient.pay(request);
//     return res.status(200).json({
//       success: true,
//       payload: {
//         redirectUrl: response.redirectUrl,
//         telegramId: telegramId,
//       },
//     });
//   } catch (error) {
//     console.error("Error while purchasing telegram.", error);
//     res.status(500).json({
//       success: false,
//       message: "Please try again later.",
//     });
//   }
// }



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
  try {
    const { telegramSession: sessionString } = req.cookies;

    if (!sessionString) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please log in to Telegram.' });
    }

    const client = new TelegramClient(
      new StringSession(sessionString),
      apiId,
      apiHash,
      { connectionRetries: 3 }
    );

    await client.connect();

    if (!(await client.isUserAuthorized())) {
      return res.status(401).json({ success: false, message: 'Telegram session invalid. Please log in again.' });
    }

    const dialogs = await client.getDialogs({});
    const ownedChats = new Map();

    for (const dialog of dialogs) {
      // We're interested in groups (basic groups) and supergroups (which are channels with megagroup=true)
      const isGroup = dialog.isGroup;
      const isSupergroup = dialog.isChannel && dialog.entity?.megagroup;

      if (dialog.entity?.creator && (isGroup || isSupergroup)) {
        const title = dialog.title;
        const currentEntry = ownedChats.get(title);

        // If we find a supergroup, it should always replace a basic group with the same title.
        if (!currentEntry || (isSupergroup && !currentEntry.isSupergroup)) {
          ownedChats.set(title, {
            id: String(dialog.id),
            title: title,
            username: dialog.entity.username || null,
            type: 'Group',
            isSupergroup: isSupergroup, // temp flag for deduplication
          });
        }
      }
    }

    // Clean up the temporary flag before sending to the client
    const groups = Array.from(ownedChats.values()).map(({ isSupergroup, ...rest }) => rest);

    return res.status(200).json({ success: true, payload: { groups: groups } });
  } catch (error) {
    console.error('Error fetching owned groups:', error);
    return res.status(500).json({ success: false, message: 'Error fetching owned groups' });
  }
}

// Send login code to user's phone to obtain phoneCodeHash
export async function sendLoginCode(req, res) {
  try {
    console.log('sendLoginCode body:', req.body);
    if (!req.body || typeof req.body.phoneNumber !== 'string') {
      console.error('Invalid or missing phoneNumber in request body');
      return res.status(400).json({ success: false, message: 'phoneNumber is required and must be a string' });
    }
    // Ensure API credentials
    if (!apiId || !apiHash) {
      console.error('Missing Telegram API credentials:', { apiId, apiHash });
      return res.status(500).json({ success: false, message: 'Telegram API ID or Hash is not configured. Please set TELEGRAM_API_ID and TELEGRAM_API_HASH in your environment.' });
    }

    const { phoneNumber } = req.body;
    console.log('phoneNumber before sendCode:', phoneNumber, typeof phoneNumber);
    // Sanitize phone number: remove spaces and non-digit/plus characters
    const sanitizedNumber = phoneNumber.replace(/[^\d+]/g, '');
    console.log('Sanitized phoneNumber:', sanitizedNumber);
    const session = new StringSession("");
    const client = new TelegramClient(
      session,
      apiId,
      apiHash,
      { connectionRetries: 3 }
    );
    await client.connect();
    // Send login code via client helper
    const sendCodeResult = await client.sendCode({ apiId, apiHash }, sanitizedNumber);
    console.log('sendCodeResult:', sendCodeResult);
    const phoneCodeHash = sendCodeResult.phoneCodeHash || sendCodeResult.phone_code_hash;
    const sessionString = session.save();
    return res.status(200).json({ success: true, payload: { phoneCodeHash, sessionString } });
  } catch (error) {
    console.error('Error sending login code:', error);
    return res.status(500).json({ success: false, message: 'Failed to send login code', error: error.message });
  }
}

// Sign in with phoneNumber, code and phoneCodeHash, then store session string in cookie
export async function signInTelegram(req, res) {
  try {
    console.log('signInTelegram body:', req.body);
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request body values:', req.body);

    // Support multiple possible field names
    let phoneNumber = req.body.phoneNumber || req.body.phone_number || req.body.phone;
    let phoneCodeHash = req.body.phoneCodeHash || req.body.phone_code_hash || req.body.phoneHash;
    let code = req.body.code || req.body.phone_code || req.body.verificationCode;
    let sessionString = req.body.sessionString;

    console.log('Extracted values:', { phoneNumber, phoneCodeHash, code, sessionString });

    if (!phoneNumber || !phoneCodeHash || !code || !sessionString) {
      return res.status(400).json({
        success: false,
        message: 'phoneNumber, phoneCodeHash, code, and sessionString are required',
        received: { phoneNumber, phoneCodeHash, code, sessionString }
      });
    }

    if (typeof phoneNumber !== 'string' ||
      typeof phoneCodeHash !== 'string' ||
      typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'phoneNumber, phoneCodeHash, and code must be strings',
        types: {
          phoneNumber: typeof phoneNumber,
          phoneCodeHash: typeof phoneCodeHash,
          code: typeof code
        }
      });
    }

    const sanitizedNumber = phoneNumber.replace(/[^\d+]/g, '');
    const session = new StringSession(sessionString);
    const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 3 });

    await client.connect();

    console.log('Inspecting Api.auth.SignIn constructor:', Api.auth.SignIn);
    console.log('About to call SignIn with:', {
      phoneNumber: sanitizedNumber,
      phoneCodeHash: phoneCodeHash,
      phoneCode: code,
    });

    const signInResult = await client.invoke(
      new Api.auth.SignIn({
        phoneNumber: sanitizedNumber, // Use camelCase
        phoneCodeHash: phoneCodeHash, // Use camelCase
        phoneCode: code,             // Use camelCase
      })
    );

    console.log('Sign in successful:', signInResult);

    // Get the session string
    const finalSessionString = session.save();

    // Set cookie with proper options
    res.cookie('telegramSession', finalSessionString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      success: true,
      user: {
        id: signInResult.user?.id,
        firstName: signInResult.user?.first_name,
        lastName: signInResult.user?.last_name,
        username: signInResult.user?.username,
        phone: signInResult.user?.phone,
      }
    });

  } catch (error) {
    console.error('Error signing in Telegram:', error);

    // Handle specific Telegram errors
    if (error.message?.includes('PHONE_CODE_INVALID')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
        error: 'PHONE_CODE_INVALID'
      });
    }

    if (error.message?.includes('PHONE_CODE_EXPIRED')) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired',
        error: 'PHONE_CODE_EXPIRED'
      });
    }

    if (error.message?.includes('SESSION_PASSWORD_NEEDED')) {
      return res.status(200).json({
        success: false,
        requiresPassword: true,
        message: 'Two-factor authentication is enabled. Password required.',
        error: 'SESSION_PASSWORD_NEEDED'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Telegram sign-in failed',
      error: error.message
    });
  }
}

// ******************* Telegram Bot Related API************************