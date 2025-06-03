import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { PhonePayClient } from "../config/phonepay.js";
import prisma from "../db/dbClient.js";
import { telegramValidation } from "../types/telegramValidation.js";
import { SchemaValidator } from "../utils/validator.js";
import axios from "axios";
import { sendOtp } from "../utils/sendOtp.js";
import { send } from "process";
dotenv.config();
export async function createTelegram(req, res) {
  try {
    const isValid = await SchemaValidator(telegramValidation, req.body, res);
    if (!isValid) {
      return;
    }
    const {
      coverImage,
      title,
      description,
      discount,
      subscriptions,
      genre,
      ownerPhoneNumber,
    } = req.body;
    const user = req.user;
    const { chatId } = req.body || req.params;
    console.log(req.body);

    if (discount) {
      if (!Array.isArray(discount)) {
        return res.status(400).json({
          success: false,
          message: "Discount must be an array of objects.",
        });
      }

      for (let d of discount) {
        // Validate discount code contains only uppercase letters and numbers
        if (d.code) {
          const codeRegex = /^[A-Z0-9]+$/; // Regex for only uppercase letters and numbers
          if (!codeRegex.test(d.code)) {
            return res.status(400).json({
              success: false,
              message: `Discount code '${d.code}' must contain only uppercase letters and numbers, with no lowercase letters or special characters.`,
            });
          }
        }
        // Validate percentage
        if (
          d.percent &&
          (isNaN(parseFloat(d.percent)) ||
            parseFloat(d.percent) < 1 ||
            parseFloat(d.percent) > 100)
        ) {
          return res.status(400).json({
            success: false,
            message: `Invalid discount percentage '${d.percent}'. Should be between 0 and 100.`,
          });
        }

        // Validate expiry date
        if (d.expiry) {
          const expDate = new Date(d.expiry);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          expDate.setHours(0, 0, 0, 0);

          if (isNaN(expDate.getTime())) {
            return res.status(400).json({
              success: false,
              message: `Invalid expiry date format for discount code '${d.code}'.`,
            });
          }

          if (expDate < today) {
            return res.status(400).json({
              success: false,
              message: `Expiry date for discount code '${d.code}' must be today or later.`,
            });
          }
        }
      }
    }

    let botHaveAdmin = false;
    let isGroupMonitored = false;
    if (chatId) {
      try {
        const adminCheckResponse = await axios.post(
          `${process.env.BOT_SERVER_URL}/check-admin-status`,
          {
            chatId,
          }
        );
        console.log("admin", adminCheckResponse.data);
        if (adminCheckResponse.data.success) {
          botHaveAdmin = adminCheckResponse.data.isAdmin;
          isGroupMonitored = botHaveAdmin;
        }
      } catch (error) {
        console.error("Error checking bot admin status:", error);
        return res.status(500).json({
          success: false,
           warning: !botHaveAdmin
          ? "Bot doesn't have admin permissions. Group will not be monitored until bot is made admin"
          : null,
        });
      }
    }

    await prisma.telegram.create({
      data: {
        coverImage: coverImage || "https://localhost.com",
        title,
        description,
        genre,
        chatId,
        discount: discount ?? {},
        subscription: subscriptions,
        createdById: user.id,
        isGroupMonitored,
        botHaveAdmin,
        ownerPhone: ownerPhoneNumber,
      },
    });

    res.status(200).json({
      success: true,
      message: "Telegram created successfully.",
      payload: {
        isGroupMonitored,
        botHaveAdmin,
       
      },
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
            name: true, // Select the username field from the related User model
          },
        },
      },
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

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

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
      select: {
        createdBy: true,
        subscription: true,
        discount: true,
        isGroupMonitored: true,
        botHaveAdmin: true,
      },
    });

    console.log("telegram", telegram);

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

    if (!telegram.isGroupMonitored || !telegram.botHaveAdmin) {
      return res.status(400).json({
        success: false,
        message:
          "This channel is not available for subscription. Bot doesn't have admin permissions.",
      });
    }

    const subscriptionDetails = telegram.subscription.find(
      (sub) => sub.days == days
    );
    console.log(subscriptionDetails);

    if (!subscriptionDetails) {
      return res.status(400).json({
        success: false,
        message: "No subscription found.",
      });
    }
    // let discountData = telegram?.discount || null;
    // console.log("discountData", discountData);
    let totalAmount = subscriptionDetails.cost;

    const orderId = randomUUID();
    console.log("orderId", orderId);

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

export async function verifyTelegramUser(req, res) {
  try {
     //here call the bot server contact/get-user-by-id
     // update user
     // return res
  } catch (error) {
    console.error("Error while verifying telegram user", error);
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
