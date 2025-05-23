import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { PhonePayClient } from "../config/phonepay.js";
import prisma from "../db/dbClient.js";
import { telegramValidation } from "../types/telegramValidation.js";
import { SchemaValidator } from "../utils/validator.js";
dotenv.config();
export async function createTelegram(req, res) {
  try {
    const isValid = await SchemaValidator(telegramValidation, req.body, res);
    if (!isValid) {
      return;
    }
    const {
      coverImage,
      channelLink: cl,
      chatId,
      title,
      description,
      discount,
      subscriptions,
      genre,
    } = req.body;
    const user = req.user;

    console.log(req.body);

    // Provide a default discount if none supplied
    await prisma.telegram.create({
      data: {
        coverImage: coverImage || "https://localhost.com",
        channelLink: cl || chatId,
        title,
        description,
        genre,
        discount: discount ?? {},
        subscription: subscriptions,
        createdById: user.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Telegram created successfully.",
    });
  } catch (error) {
    console.error("Error in creating telegram.", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getCreatorTelegram(req, res) {
  try {
    const user = req.user;

    const telegram = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        createdTelegrams: {
          include: {
            _count: {
              select: {
                telegramSubscriptions: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Fetched telegrams successfully.",
      payload: {
        telegrams: telegram?.createdTelegrams || [],
      },
    });
  } catch (error) {
    console.error("Error in fetching Telegrams.", error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching Telegrams.",
    });
  }
}
export async function getTelegramById(req, res) {
  try {
    const { telegramId } = req.params;
    console.log(req.params);

    if (!telegramId) {
      return res.status(403).json({
        success: false,
        message: "No telegramId Id provided.",
      });
    }

    const telegram = await prisma.telegram.findUnique({
      where: {
        id: telegramId,
      },
       include: {
    createdBy: {
      select: {
        name: true,  // Select the username field from the related User model
      },
    }},
    });

    return res.status(200).json({
      success: true,
      message: "Fetched telegram successfully.",
      payload: {
        telegram,
      },
    });
  } catch (error) {
    console.error("Error in fetching telegram.", error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching telegram.",
    });
  }
}

export async function purchaseTelegram(req, res) {
  try {
    const { telegramId, days } = req.body;
    const user = req.user;
    if (!telegramId) {
      return res.status(400).json({
        success: false,
        message: "Telegram Id required.",
      });
    }

    const telegram = await prisma.telegram.findUnique({
      where: {
        id: telegramId,
      },
      include: {
        createdBy: true,
      },
    });

    if (!telegram) {
      return res.status(400).json({
        success: false,
        message: "Telegram not found.",
      });
    }

    // if (telegram.createdById === user.id) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "You cannot purchase your own channel."
    //     })
    // }

    const subscriptionDetails = telegram.subscription.find(
      (sub) => sub.days === days
    );

    if (!subscriptionDetails) {
      return res.status(400).json({
        success: false,
        message: "No subscription found.",
      });
    }
    let totalAmount = subscriptionDetails.cost;

    const orderId = randomUUID();

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(orderId)
      .amount(totalAmount * 100)
      .redirectUrl(
        `${process.env.FRONTEND_URL}payment/verify?merchantOrderId=${orderId}&telegramId=${telegramId}`
      )
      .build();

    const response = await PhonePayClient.pay(request);
    return res.status(200).json({
      success: true,
      payload: {
        redirectUrl: response.redirectUrl,
        telegramId: telegramId,
      },
    });
  } catch (error) {
    console.error("Error while purchasing telegram.", error);
    res.status(500).json({
      success: false,
      message: "Please try again later.",
    });
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
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}
