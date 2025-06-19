import { randomUUID } from "crypto";
import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { PhonePayClient } from "../config/phonepay.js";
import prisma from "../db/dbClient.js";
import { telegramValidation } from "../types/telegramValidation.js";
import { SchemaValidator } from "../utils/validator.js";
import axios from "axios";
import { sendOtp } from "../utils/sendOtp.js";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { Api } from "telegram";

// API credentials loaded by index.js via dotenv.config()
const apiId = parseInt(process.env.TELEGRAM_API_ID, 10);
const apiHash = process.env.TELEGRAM_API_HASH;

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
      chatId,
    } = req.body;
    const user = req.user;

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
