import axios from "axios";
import dotenv from "dotenv";
import { generateSignedUrl } from "../config/imagekit.js";
import { PhonePayClient } from "../config/phonepay.js";
import {
  createContact,
  createFundAccount,
  createPayout,
} from "../config/razorpay.js";
import prisma from "../db/dbClient.js";
import { sendOtp } from "../utils/sendOtp.js";
import bcrypt from "bcrypt";

dotenv.config();

export async function getWalletDetails(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!wallet) {
      return res.status(400).send({
        success: false,
        message: "Wallet Not Found",
      });
    }
    const accountNumbers = await prisma.bankDetails.findMany({
      where: {
        userId: user.id,
      },
      select: {
        accountNumber: true,
      },
    });

    const upiIds = await prisma.uPI.findMany({
      where: {
        userId: user.id,
      },
      select: {
        upiId: true,
      },
    });

    const accountNumberResponse = accountNumbers.map(
      (account) => account.accountNumber
    );
    const upiIdResponse = upiIds.map((upi) => upi.upiId);

    const withdrawals = await prisma.withdrawal.findMany({
      where: {
        walletId: wallet.id,
        status: "SUCCESS",
      },
      select: {
        amount: true,
      },
    });

    const totalWithdrawals = withdrawals.reduce(
      (total, withdrawal) => total + withdrawal.amount,
      0
    );

    console.log(wallet);

    console.log(wallet);
    return res.status(200).json({
      success: true,
      message: "Fetched wallet details successfully.",
      payload: {
        balance: wallet.balance === null ? 0 : wallet.balance,
        totalEarnings: wallet.totalEarnings === null ? 0 : wallet.totalEarnings,
        totalWithdrawals: totalWithdrawals,
        lastModified: wallet.updatedAt,
        walletId: wallet.id,
        mpin: wallet.mpin !== null,
        accountNumbers: accountNumberResponse,
        upiIds: upiIdResponse,
      },
    });
  } catch (error) {
    console.error("Error while fetching balance.", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}

export async function verifyPayment(req, res) {
  try {
    const {
      webinarId,
      courseId,
      payingUpId,
      telegramId,
      premiumContentId,
      days,
      channelId,
      phonePayOrderId,
      discountedPrice,
    } = req.body;

    const user = req.user;
    const GST_RATE = 0.18;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    if (
      !courseId &&
      !webinarId &&
      !payingUpId &&
      !telegramId &&
      !premiumContentId
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request.",
      });
    }

    // const generatedSignature = crypto
    //   .createHmac("sha256", process.env.RAZORPAY_SECRET)
    //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    //   .digest("hex");

    // if (generatedSignature !== razorpay_signature) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid payment signature.",
    //   });
    // }

    // const paymentDetails = await fetchPaymentDetails(razorpay_payment_id);

    const PhonePayPaymentDetails = await PhonePayClient.getOrderStatus(
      phonePayOrderId
    );

    if (PhonePayPaymentDetails.state === "FAILED") {
      return res
        .status(400)
        .json({ success: false, message: "Payment failed" });
    }

    await prisma.$transaction(async (prisma) => {
      if (webinarId) {
        const creator = await prisma.webinar.findUnique({
          where: {
            id: webinarId,
          },
          include: {
            createdBy: true,
          },
        });

        if (!creator) {
          return res
            .status(400)
            .json({ success: false, message: "Creator not found." });
        }

        let amountToBeAdded = discountedPrice
          ? parseFloat(discountedPrice)
          : creator.amount;
        if (creator.createdBy.creatorComission) {
          const commissionAmount =
            Math.round(
              ((creator.createdBy.creatorComission * amountToBeAdded) / 100) *
                100
            ) / 100;
          const gstOnCommission =
            Math.round(commissionAmount * GST_RATE * 100) / 100;
          amountToBeAdded =
            Math.round(
              (amountToBeAdded - commissionAmount - gstOnCommission) * 100
            ) / 100;
        }

        const creatorWallet = await prisma.wallet.update({
          where: {
            userId: creator.createdById,
          },
          data: {
            totalEarnings: { increment: parseFloat(amountToBeAdded) },
            balance: { increment: parseFloat(amountToBeAdded) },
          },
        });

        const webinar = await prisma.webinarTicket.create({
          data: {
            webinarId,
            boughtById: existingUser.id,
            paymentId: PhonePayPaymentDetails.paymentDetails[0].transactionId,
            orderId: phonePayOrderId,
          },
        });

        if (!webinar) {
          return res.status(400).json({
            success: false,
            message: "Failed to buy ticket for webinar.",
          });
        }

        const transaction = await prisma.transaction.create({
          data: {
            amount: parseFloat(discountedPrice || creator.amount),
            amountAfterFee: parseFloat(amountToBeAdded),
            modeOfPayment: PhonePayPaymentDetails.paymentDetails[0].paymentMode,
            productId: webinarId,
            buyerId: existingUser.id,
            creatorId: creator.createdById,
            productType: "WEBINAR",
            status: PhonePayPaymentDetails.paymentDetails[0].state,
            phonePayTransId:
              PhonePayPaymentDetails.paymentDetails[0].transactionId,
            walletId: creatorWallet.id,
          },
        });
        console.log("transaction", transaction);
        if (!transaction) {
          return res.status(400).json({
            success: false,
            message: "Failed to create transaction.",
          });
        }
      }

      if (courseId) {
        const creator = await prisma.course.findFirst({
          where: {
            id: courseId,
          },
          include: {
            creator: true,
          },
        });

        if (!creator) {
          return res
            .status(400)
            .json({ success: false, message: "Creator not found." });
        }
        let amountToBeAdded = discountedPrice
          ? parseFloat(discountedPrice)
          : creator.price;
        console.log("amount", amountToBeAdded);
        if (creator.creator.creatorComission) {
          const commissionAmount =
            Math.round(
              ((creator.creator.creatorComission * amountToBeAdded) / 100) * 100
            ) / 100;
          const gstOnCommission =
            Math.round(commissionAmount * GST_RATE * 100) / 100;
          amountToBeAdded =
            Math.round(
              (amountToBeAdded - commissionAmount - gstOnCommission) * 100
            ) / 100;
        }
        const creatorWallet = await prisma.wallet.update({
          where: {
            userId: creator.createdBy,
          },
          data: {
            totalEarnings: { increment: parseFloat(amountToBeAdded) },
            balance: { increment: parseFloat(amountToBeAdded) },
          },
        });

        const course = await prisma.coursePurchasers.create({
          data: {
            courseId,
            purchaserId: existingUser.id,
            paymentId: PhonePayPaymentDetails.paymentDetails[0].transactionId,
            orderId: phonePayOrderId,
          },
        });

        if (!course) {
          return res
            .status(400)
            .json({ success: false, message: "Failed to buy course." });
        }

        const transaction = await prisma.transaction.create({
          data: {
            amount: parseFloat(discountedPrice || creator.price),
            amountAfterFee: parseFloat(amountToBeAdded),
            buyerId: existingUser.id,
            modeOfPayment: PhonePayPaymentDetails.paymentDetails[0].paymentMode,
            productId: courseId,
            productType: "COURSE",
            creatorId: creator.createdBy,
            status: PhonePayPaymentDetails.paymentDetails[0].state,
            phonePayTransId:
              PhonePayPaymentDetails.paymentDetails[0].transactionId,
            walletId: creatorWallet.id,
          },
        });

        if (!transaction) {
          return res.status(400).json({
            success: false,
            message: "Failed to create transaction.",
          });
        }
      }

      if (payingUpId) {
        console.log("payingUpId", payingUpId);
        const creator = await prisma.payingUp.findFirst({
          where: {
            id: payingUpId,
          },
          select: {
            createdById: true,
            paymentDetails: true,
            createdBy: true,
          },
        });

        console.log("cre", creator);

        if (!creator) {
          return res
            .status(400)
            .json({ success: false, message: "Creator not found." });
        }
        let amount = discountedPrice
          ? parseFloat(discountedPrice)
          : creator.paymentDetails.totalAmount;

        let amountToBeAdded = parseFloat(amount);

        if (creator.createdBy.creatorComission) {
          const commissionAmount =
            Math.round(
              ((creator.createdBy.creatorComission * amountToBeAdded) / 100) *
                100
            ) / 100;
          const gstOnCommission =
            Math.round(commissionAmount * GST_RATE * 100) / 100;
          amountToBeAdded =
            Math.round(
              (amountToBeAdded - commissionAmount - gstOnCommission) * 100
            ) / 100;
        }

        const creatorWallet = await prisma.wallet.update({
          where: {
            userId: creator.createdById,
          },
          data: {
            totalEarnings: {
              increment: parseFloat(amountToBeAdded),
            },
            balance: {
              increment: parseFloat(amountToBeAdded),
            },
          },
        });

        const payingUpTicket = await prisma.payingUpTicket.create({
          data: {
            payingUpId,
            boughtById: existingUser.id,
            paymentId: PhonePayPaymentDetails.paymentDetails[0].transactionId,
            orderId: phonePayOrderId,
          },
        });

        if (!payingUpTicket) {
          return res
            .status(400)
            .json({ success: false, message: "Failed to buy course." });
        }

        const transaction = await prisma.transaction.create({
          data: {
            amount: parseFloat(
              discountedPrice || creator.paymentDetails.totalAmount
            ),
            amountAfterFee: parseFloat(amountToBeAdded),
            buyerId: existingUser.id,
            modeOfPayment: PhonePayPaymentDetails.paymentDetails[0].paymentMode,
            productId: payingUpId,
            productType: "PAYINGUP",
            creatorId: creator.createdById,
            status: PhonePayPaymentDetails.paymentDetails[0].state,
            phonePayTransId:
              PhonePayPaymentDetails.paymentDetails[0].transactionId,
            walletId: creatorWallet.id,
          },
        });

        if (!transaction) {
          return res.status(400).json({
            success: false,
            message: "Failed to create transaction.",
          });
        }
      }

      if (premiumContentId) {
        const creator = await prisma.premiumContent.findFirst({
          where: {
            id: premiumContentId,
          },
          include: {
            createdBy: true,
          },
        });

        if (!creator) {
          return res
            .status(400)
            .json({ success: false, message: "Creator not found." });
        }
        let amountToBeAdded = discountedPrice
          ? parseFloat(discountedPrice)
          : creator.unlockPrice;
        if (creator.createdBy.creatorComission) {
          const commissionAmount =
            Math.round(
              ((creator.createdBy.creatorComission * amountToBeAdded) / 100) *
                100
            ) / 100;
          const gstOnCommission =
            Math.round(commissionAmount * GST_RATE * 100) / 100;
          amountToBeAdded =
            Math.round(
              (amountToBeAdded - commissionAmount - gstOnCommission) * 100
            ) / 100;
        }

        const creatorWallet = await prisma.wallet.update({
          where: {
            userId: creator.createdById,
          },
          data: {
            totalEarnings: {
              increment: parseFloat(amountToBeAdded),
            },
            balance: {
              increment: parseFloat(amountToBeAdded),
            },
          },
        });

        const premiumContent = await prisma.premiumContentAccess.create({
          data: {
            userId: user.id,
            contentId: premiumContentId,
            paymentId: PhonePayPaymentDetails.paymentDetails[0].transactionId,
            orderId: phonePayOrderId,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //currently for 30 days
          },
        });

        if (!premiumContent) {
          return res.status(400).json({
            success: false,
            message: "Failed to create premium content access.",
          });
        }

        const transaction = await prisma.transaction.create({
          data: {
            amount: parseFloat(discountedPrice || creator.unlockPrice),
            amountAfterFee: parseFloat(amountToBeAdded),
            buyerId: existingUser.id,
            modeOfPayment: PhonePayPaymentDetails.paymentDetails[0].paymentMode,
            productId: premiumContentId,
            productType: "PREMIUMCONTENT",
            creatorId: creator.createdById,
            status: PhonePayPaymentDetails.paymentDetails[0].state,
            phonePayTransId:
              PhonePayPaymentDetails.paymentDetails[0].transactionId,
            walletId: creatorWallet.id,
          },
        });

        if (!transaction) {
          return res.status(400).json({
            success: false,
            message: "Failed to create transaction.",
          });
        }
      }

      if (telegramId && days) {
        const creator = await prisma.telegram.findFirst({
          where: {
            id: payingUpId,
          },
          select: {
            createdById: true,
            subscription: true,
            createdBy: true,
          },
        });

        if (!creator) {
          return res
            .status(400)
            .json({ success: false, message: "Creator not found." });
        }

        const subscriptionDetails = creator.subscription.find(
          (sub) => sub.days === days
        );
        let amountToBeAdded = subscriptionDetails.cost;
        if (creator.createdBy.creatorComission) {
          const commissionAmount =
            Math.round(
              ((creator.createdBy.creatorComission * amountToBeAdded) / 100) *
                100
            ) / 100;
          const gstOnCommission =
            Math.round(commissionAmount * GST_RATE * 100) / 100;
          amountToBeAdded =
            Math.round(
              (amountToBeAdded - commissionAmount - gstOnCommission) * 100
            ) / 100;
        }
        const creatorWallet = await prisma.wallet.update({
          where: {
            userId: creator.createdById,
          },
          data: {
            totalEarnings: {
              increment: parseFloat(amountToBeAdded),
            },
            balance: { increment: parseFloat(amountToBeAdded) },
          },
        });

        const telegramSubs = await prisma.telegramSubscription.create({
          data: {
            telegramId,
            boughtById: existingUser.id,
            validDays: days,
            paymentId: PhonePayPaymentDetails.paymentDetails[0].transactionId,
            orderId: phonePayOrderId,
          },
        });

        if (!telegramSubs) {
          return res
            .status(400)
            .json({ success: false, message: "Failed to buy course." });
        }

        const transaction = await prisma.transaction.create({
          data: {
            amount: parseFloat(subscriptionDetails.cost),
            amountAfterFee: parseFloat(amountToBeAdded),
            buyerId: existingUser.id,
            modeOfPayment: PhonePayPaymentDetails.paymentDetails[0].paymentMode,
            productId: telegramId,
            productType: "TELEGRAM",
            creatorId: creator.createdById,
            status: PhonePayPaymentDetails.paymentDetails[0].state,
            phonePayTransId:
              PhonePayPaymentDetails.paymentDetails[0].transactionId,
            walletId: creatorWallet.id,
          },
        });

        if (!transaction) {
          return res.status(400).json({
            success: false,
            message: "Failed to create transaction.",
          });
        }
      }
    });

    if (webinarId) {
      const response = await prisma.webinar.findUnique({
        where: {
          id: webinarId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Webinar purchased successfully.",
        payload: {
          webinarDetail: response.link,
          venue: response.venue,
        },
      });
    }

    if (courseId) {
      return res.status(200).json({
        success: true,
        message: "Course purchased successfully.",
        payload: null,
      });
    }

    if (premiumContentId) {
      return res.status(200).json({
        success: true,
        message: "Premium content purchased successfully.",
        payload: null,
      });
    }

    if (payingUpId) {
      const response = await prisma.payingUp.findUnique({
        where: {
          id: payingUpId,
        },
      });

      const signedUrls = response.files.value.map((file) => {
        const filePath = new URL(file.url).pathname.replace(
          /^.*\/images/,
          "/images"
        );
        return generateSignedUrl(filePath);
      });

      return res.status(200).json({
        success: true,
        message: "Paying up purchased successfully.",
        payload: {
          urls: signedUrls,
        },
      });
    }

    if (telegramId && days) {
      const response = await axios.get(
        `${process.env.BOT_SERVER_URL}/generate-invitelink?channelId=${channelId}&boughtById=${user.id}`
      );
      return res.status(200).json({
        success: true,
        message: "Telegram purchased successfully.",
        payload: {
          telegramInvitelink: response.data.payload.inviteLink,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Purchase successfully.",
    });
  } catch (error) {
    console.error("Error in verifying payment.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function addBusinessInfo(req, res) {
  try {
    const user = req.user;
    const {
      firstName,
      lastName,
      businessStructure,
      gstNumber,
      sebiNumber,
      sebiCertificate,
    } = req.body;

    if (!firstName || !lastName || !businessStructure) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }
    if (businessStructure != "Others" && !gstNumber && !sebiNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }
    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const businessExists = await prisma.businessInfo.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (businessExists) {
      return res.status(400).json({
        success: false,
        message: "Business Information already exists.",
      });
    }

    const businessInfo = await prisma.businessInfo.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        businessStructure,
        gstNumber,
        sebiNumber,
        sebiCertificate,
      },
    });

    if (!businessInfo) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to add business info." });
    }

    return res.status(200).json({
      success: true,
      message: "Business info added successfully.",
    });
  } catch (error) {
    console.error("Error in adding business info.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function updateBusinessInfo(req, res) {
  try {
    const user = req.user;
    const {
      firstName,
      lastName,
      businessStructure,
      gstNumber,
      sebiNumber,
      sebiCertificate,
    } = req.body;

    if (
      !firstName &&
      !lastName &&
      !businessStructure &&
      !gstNumber &&
      !sebiNumber &&
      !sebiCertificate
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field to update is required.",
      });
    }

    if (
      businessStructure &&
      businessStructure !== "Others" &&
      !gstNumber &&
      !sebiNumber
    ) {
      return res.status(400).json({
        success: false,
        message:
          "GST number or SEBI number is required for this business structure.",
      });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userExists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const businessExists = await prisma.businessInfo.findFirst({
      where: { userId: user.id },
    });

    if (!businessExists) {
      return res.status(404).json({
        success: false,
        message: "Business information not found. Please create it first.",
      });
    }

    const updatedBusinessInfo = await prisma.businessInfo.update({
      where: {
        id: businessExists.id,
      },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(businessStructure && { businessStructure }),
        ...(gstNumber !== undefined && { gstNumber }),
        ...(sebiNumber !== undefined && { sebiNumber }),
        ...(sebiCertificate && { sebiCertificate }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Business information updated successfully.",
      data: updatedBusinessInfo,
    });
  } catch (error) {
    console.error("Error in updating business info:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
}

export async function deleteBusinessInfo(req, res) {
  try {
    const user = req.user;

    const userExists = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userExists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const businessExists = await prisma.businessInfo.findFirst({
      where: { userId: user.id },
    });

    if (!businessExists) {
      return res
        .status(404)
        .json({ success: false, message: "Business information not found." });
    }

    await prisma.businessInfo.delete({
      where: {
        id: businessExists.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Business information deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleting business info:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
}

export async function getBusinessInfo(req, res) {
  try {
    const user = req.user;

    const businessInfo = await prisma.businessInfo.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!businessInfo) {
      return res
        .status(400)
        .json({ success: false, message: "Business info not found." });
    }

    return res.status(200).json({
      success: true,
      payload: businessInfo,
      message: "Fetched business info successfully.",
    });
  } catch (error) {
    console.error("Error in fetching business info.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function addKycDetails(req, res) {
  try {
    const user = req.user;
    const { socialMedia, idVerification } = req.body;
    const { aadhaarNumber, aadhaarFront, aadhaarBack, panCard, selfie } =
      idVerification;

    if (
      !socialMedia ||
      !idVerification ||
      !aadhaarNumber ||
      !aadhaarFront ||
      !aadhaarBack ||
      !panCard ||
      !selfie
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    if (aadhaarNumber.trim().length != 12) {
      return res
        .status(400)
        .json({ success: false, message: "AadhaarNumber must be 12 digit." });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const kycExists = await prisma.kycRecords.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (kycExists) {
      return res
        .status(400)
        .json({ success: false, message: "KYC details already exists." });
    }

    const kyc = await prisma.kycRecords.create({
      data: {
        aadhaarBack,
        aadhaarFront,
        aadhaarNumber,
        panCard,
        selfie,
        socialMedia,
        userId: user.id,
      },
    });

    if (!kyc) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to add KYC details." });
    }

    return res.status(200).json({
      success: true,
      message: "KYC details added successfully.",
    });
  } catch (error) {
    console.error("Error in adding KYC details.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function updateKycDetails(req, res) {
  try {
    const user = req.user;
    const { socialMedia, idVerification } = req.body;

    if (idVerification) {
      const { aadhaarNumber, aadhaarFront, aadhaarBack, panCard, selfie } =
        idVerification;
      if (aadhaarNumber && aadhaarNumber.trim().length !== 12) {
        return res.status(400).json({
          success: false,
          message: "Aadhaar Number must be 12 digits.",
        });
      }
    }

    const userExists = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userExists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const kycExists = await prisma.kycRecords.findFirst({
      where: { userId: user.id },
    });

    if (!kycExists) {
      return res.status(404).json({
        success: false,
        message: "KYC details not found. Please create KYC details first.",
      });
    }

    // Extract only the fields that are provided
    const updateData = {};

    if (socialMedia !== undefined) {
      updateData.socialMedia = socialMedia;
    }

    if (idVerification) {
      if (idVerification.aadhaarNumber !== undefined) {
        updateData.aadhaarNumber = idVerification.aadhaarNumber;
      }
      if (idVerification.aadhaarFront !== undefined) {
        updateData.aadhaarFront = idVerification.aadhaarFront;
      }
      if (idVerification.aadhaarBack !== undefined) {
        updateData.aadhaarBack = idVerification.aadhaarBack;
      }
      if (idVerification.panCard !== undefined) {
        updateData.panCard = idVerification.panCard;
      }
      if (idVerification.selfie !== undefined) {
        updateData.selfie = idVerification.selfie;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields provided for update." });
    }

    const updatedKyc = await prisma.kycRecords.update({
      where: {
        id: kycExists.id,
      },
      data: updateData,
    });

    const containsDocumentUpdates =
      idVerification?.aadhaarFront !== undefined ||
      idVerification?.aadhaarBack !== undefined ||
      idVerification?.panCard !== undefined ||
      idVerification?.selfie !== undefined;

    if (containsDocumentUpdates) {
      await prisma.kycRecords.update({
        where: { id: kycExists.id },
        data: {
          status: "PENDING",
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "KYC details updated successfully.",
      data: updatedKyc,
    });
  } catch (error) {
    console.error("Error in updating KYC details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
}

export async function deleteKycDetails(req, res) {
  try {
    const user = req.user;

    const userExists = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userExists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const kycExists = await prisma.kycRecords.findFirst({
      where: { userId: user.id },
    });

    if (!kycExists) {
      return res
        .status(404)
        .json({ success: false, message: "KYC details not found." });
    }

    const hasActiveServices = await prisma.wallet.findFirst({
      where: {
        userId: user.id,
        isKycVerified: true,
      },
    });

    if (hasActiveServices) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete KYC details while you have active services.",
      });
    }

    await prisma.kycRecords.delete({
      where: {
        id: kycExists.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "KYC details deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleting KYC details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
}

export async function getKycDetails(req, res) {
  try {
    const user = req.user;

    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const kyc = await prisma.kycRecords.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!kyc) {
      return res
        .status(400)
        .json({ success: false, message: "KYC details not found." });
    }

    return res.status(200).json({
      success: true,
      payload: kyc,
      message: "Fetched KYC details successfully.",
    });
  } catch (error) {
    console.error("Error in fetching KYC details.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function addBankDetails(req, res) {
  try {
    const user = req.user;
    const { bankingInfo } = req.body;
    const { ifscCode, accountHolderName, accountNumber, bankDocument, upiId } =
      bankingInfo;

    if (
      !ifscCode ||
      !accountHolderName ||
      !accountNumber ||
      !bankDocument ||
      !upiId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const userWallet = await prisma.wallet.findUnique({
      where: {
        userId: userExists.id,
      },
    });

    if (!userWallet) {
      return res
        .status(400)
        .json({ success: false, message: "User wallet not found." });
    }

    const existingBankDetails = await prisma.bankDetails.findFirst({
      where: {
        userId: userExists.id,
        primary: true,
      },
    });
    const totalBankAccounts = await prisma.bankDetails.count({
      where: {
        userId: user.id,
      },
    });
    if (totalBankAccounts >= 4) {
      return res.status(400).json({
        success: false,
        message: "You can add only maximum 4 bank accounts or UPIs",
      });
    }
    if (existingBankDetails) {
      return res.status(400).json({
        success: false,
        message: "Primary Bank details already exist.",
      });
    }

    const bankDetails = await prisma.bankDetails.create({
      data: {
        ifscCode: ifscCode,
        accountHolderName,
        accountNumber,
        bankDocument,
        userId: user.id,
        primary: true,
      },
    });

    if (!bankDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to add bank details." });
    }

    const updateUpiId = await prisma.uPI.create({
      data: {
        upiId: upiId,
        bankDetailsId: bankDetails.id,
        userId: user.id,
      },
    });

    if (!updateUpiId) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to add UPI ID." });
    }

    return res.status(200).json({
      success: true,
      message: "KYC updated and bank details added successfully.",
    });
  } catch (error) {
    console.error("Error in adding bank details.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

//primary default bank and upi updation
export async function updateBankDetails(req, res) {
  try {
    const user = req.user;
    const { bankDetailsId } = req.params;
    const { bankingInfo } = req.body;
    const { ifscCode, accountHolderName, accountNumber, bankDocument, upiId } =
      bankingInfo;

    if (!bankDetailsId) {
      return res
        .status(400)
        .json({ success: false, message: "Bank details id required." });
    }
    console.log("bankDetailsId", bankDetailsId);

    if (
      !ifscCode &&
      !accountHolderName &&
      !accountNumber &&
      !bankDocument &&
      !upiId
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field to update is required.",
      });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const existingBankDetails = await prisma.bankDetails.findFirst({
      where: {
        id: bankDetailsId,
        userId: user.id,
      },
    });
    console.log("existingBankDetails", existingBankDetails);

    if (!existingBankDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Bank details not found." });
    }

    //update bank details
    const updatedBankDetails = await prisma.bankDetails.update({
      where: {
        id: bankDetailsId,
      },
      data: {
        ...(ifscCode && { ifscCode }),
        ...(accountHolderName && { accountHolderName }),
        ...(accountNumber && { accountNumber }),
        ...(bankDocument && { bankDocument }),
        primary: true,
      },
    });

    //update UPI if provided
    let updatedUpi = null;
    if (upiId) {
      if (existingBankDetails.upiId && existingBankDetails.upiId.length > 0) {
        updatedUpi = await prisma.uPI.update({
          where: {
            id: existingBankDetails.upiId[0].id,
          },
          data: {
            upiId,
          },
        });
      } else {
        updatedUpi = await prisma.uPI.create({
          data: {
            upiId: upiId,
            bankDetailsId: bankDetailsId,
            userId: user.id,
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Bank details updated successfully.",
      data: {
        bankDetails: updatedBankDetails,
        upi: updatedUpi,
      },
    });
  } catch (error) {
    console.error("Error in updating bank details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
}

export async function getBankDetails(req, res) {
  try {
    const user = req.user;

    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const bankDetails = await prisma.bankDetails.findFirst({
      where: {
        userId: userExists.id,
        primary: true,
      },
    });

    const kycRecord = await prisma.kycRecords.findFirst({
      where: {
        userId: userExists.id,
      },
    });

    if (!bankDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Bank details not found." });
    }

    if (!kycRecord) {
      return res
        .status(400)
        .json({ success: false, message: "kyc Record not found." });
    }

    if (bankDetails.userId != kycRecord.userId) {
      return res
        .status(400)
        .json({ success: false, message: "kyc Record not found." });
    }

    return res.status(200).json({
      success: true,
      payload: {
        bankDetails: bankDetails,
        kycRecord: kycRecord,
      },
      message: "Fetched bank details successfully.",
    });
  } catch (error) {
    console.error("Error in fetching bank details.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function withdrawAmount(req, res) {
  try {
    const user = req.user;
    const { withdrawAmount, withdrawalMethod, withdrawFrom, mpin } = req.body;
    //TODO
    if (!withdrawAmount || !withdrawalMethod || !withdrawFrom || !mpin) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const wallet = await prisma.wallet.findFirst({
      where: {
        userId: userExists.id,
      },
    });

    if (!wallet) {
      return res
        .status(400)
        .json({ success: false, message: "Wallet not found." });
    }

    if (wallet.isKycVerified === false) {
      return res
        .status(400)
        .json({ success: false, message: "KYC not completed." });
    }

    if (wallet.mpin == null) {
      return res.status(400).json({
        success: false,
        message: "MPIN not set. Please set MPIN first.",
      });
    }

    const isMatchMpin = await bcrypt.compare(mpin, wallet.mpin);
    if (!isMatchMpin) {
      return res.status(400).json({ success: false, message: "Invalid MPIN." });
    }

    if (wallet.balance < +withdrawAmount || wallet.balance <= 50) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance or wallet balance is less than 50rs.",
      });
    }

    if (withdrawalMethod == "bank") {
      const bankDetails = await prisma.bankDetails.findFirst({
        where: {
          userId: userExists.id,
          accountNumber: withdrawFrom,
        },
      });

      if (!bankDetails) {
        return res
          .status(400)
          .json({ success: false, message: "Bank details not found." });
      }

      await prisma.withdrawal.create({
        data: {
          walletId: wallet.id,
          amount: parseInt(withdrawAmount),
          bankDetailsId: bankDetails.id,
          modeOfWithdrawal: withdrawalMethod,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Amount withdrawn processed successfully. ",
      });
    } else if (withdrawalMethod === "upi") {
      const upiDetails = await prisma.uPI.findFirst({
        where: {
          userId: userExists.id,
          upiId: withdrawFrom,
        },
      });

      if (!upiDetails) {
        return res
          .status(400)
          .json({ success: false, message: "UPI not found." });
      }

      await prisma.withdrawal.create({
        data: {
          amount: +withdrawAmount,
          upiId: upiDetails.id,
          walletId: wallet.id,
          modeOfWithdrawal: withdrawalMethod,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Amount withdrawn processed successfully.",
        amount: withdrawAmount,
      });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid withdrawal method." });
  } catch (error) {
    console.error("Error in withdrawing amount.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getTransactions(req, res) {
  try {
    const user = req.user;
    const { page = 1, status, buyerId, limit=10, sortBy="createdAt", sortOrder='desc' } = req.query;

    const pageNumber = parseInt(page);
    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid page Number",
      });
    }

    const pageSize = parseInt(limit);

    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const wallet = await prisma.wallet.findFirst({
      where: {
        userId: userExists.id,
      },
    });

    if (!wallet) {
      return res
        .status(400)
        .json({ success: false, message: "Wallet not found." });
    }

    // Build the where clause with filters
    const whereClause = {
      walletId: wallet.id,
    };

    // Add status filter if provided
    if (status) {
      whereClause.status = status;
    }

    // Add buyerId filter if provided
    if (buyerId) {
      whereClause.buyerId = buyerId;
    }

    const totalTransactions = await prisma.transaction.count({
      where: whereClause,
    });

    const totalPages = Math.max(1, Math.ceil(totalTransactions / pageSize));
    const effectivePage = Math.min(pageNumber, totalPages);
     const validSortFields = ['createdAt', 'amount', 'status', 'productType'];
    const actualSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const actualSortOrder = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';
   

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        buyer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
       skip: (effectivePage - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [actualSortBy]: actualSortOrder
      }
    });

    return res.status(200).json({
      success: true,
      payload: {
        transactions: transactions.length === 0 ? [] : transactions,
        totalPages,
        currentPage: effectivePage,
        totalItems: totalTransactions
      },
      message: "Fetched transactions successfully.",
    });
  } catch (error) {
    console.error("Error in getting transactions.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getWithdrawals(req, res) {
  try {
    const user = req.user;

    const {
      page = 1,
      limit=10,
      upiId,
      bankDetailsId,
      status,
      modeOfWithdrawal,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageSize = parseInt(limit);
    const pageNumber = parseInt(page);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid page Number",
      });
    }

    const userExist = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const wallet = await prisma.wallet.findFirst({
      where: {
        userId: userExist.id,
      },
    });

    if (!wallet) {
      return res
        .status(400)
        .json({ success: false, message: "Wallet not found." });
    }

    //build whereClause for filters
    const whereClause = {
      walletId: wallet.id,
    };

    if (upiId) {
      whereClause.upiId = upiId;
    }
    if (bankDetailsId) {
      whereClause.bankDetailsId = bankDetailsId;
    }
    if (status) {
      if (Array.isArray(status)) {
        whereClause.status = {
          in: status,
        };
      } else {
        whereClause.status = status;
      }
    }

    if (modeOfWithdrawal) {
      if (Array.isArray(modeOfWithdrawal)) {
        whereClause.modeOfWithdrawal = {
          in: modeOfWithdrawal,
        };
      } else {
        whereClause.modeOfWithdrawal = modeOfWithdrawal;
      }
    }

    //Date range filter
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        whereClause.createdAt.lte = endDateObj;
      }
    }

    //Amount range filters
    if (minAmount || maxAmount) {
      whereClause.amount = {};

      if (minAmount) {
        whereClause.amount.gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        whereClause.amount.lte = parseFloat(maxAmount);
      }
    }

    const totalWithdrawals = await prisma.withdrawal.count({
      where: whereClause,
    });

    const totalPages = Math.max(1, Math.ceil(totalWithdrawals / pageSize));
    const effectivePage = Math.min(pageNumber, totalPages);

    if (pageNumber > totalPages && totalPages !== 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid page number" });
    }

    //validate sorting parameters
    const allowedSortFields = ["createdAt", "amount", "status"];
    const actualSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";
    const actualSortOrder = sortOrder === "asc" ? "asc" : "desc";

    //Get withdrawals with applied filters, pagination and sorting

    const withdrawals = await prisma.withdrawal.findMany({
      where: whereClause,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [actualSortBy]: actualSortOrder,
      },
      // include: {
      //   bankDetails: Boolean(bankDetailsId) || true,
      //   upi: Boolean(upiId) || true,
      // },
    });

    //calculate total withdrawal amount for the filtered result
    const totalWithdrawalAmount = await prisma.withdrawal.aggregate({
      where: whereClause,
      _sum: {
        amount: true,
      },
    });

    // Get available filter options for dropdowns
    const filterOptions = await getFilterOptions(wallet.id);

    if (!withdrawals) {
      return res
        .status(400)
        .json({ success: false, message: "Unable to fetch withdrawals" });
    }

    return res.status(200).json({
      success: true,
      payload: {
        withdrawals: withdrawals.length === 0 ? [] : withdrawals,
        totalPages,
        currentPage: effectivePage,
        totalWithdrawals,
        totalWithdrawalAmount: totalWithdrawalAmount._sum.amount || 0,
        filterOptions,
      },
      message: "Fetched withdrawals successfully.",
    });
  } catch (error) {
    console.error("Error in getting withdrawals.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

// Helper function to get available filter options
async function getFilterOptions(walletId) {
  try {
    // Get unique UPIs
    const upis = await prisma.withdrawal.findMany({
      where: { walletId },
      select: {
        upiId: true,
        upi: {
          select: {
            upiId: true,
          },
        },
      },
      distinct: ["upiId"],
    });

    // Get unique bank details
    const bankDetails = await prisma.withdrawal.findMany({
      where: { walletId },
      select: {
        bankDetailsId: true,
        bankDetails: {
          select: {
            accountNumber: true,
            accountHolderName: true,
          },
        },
      },
      distinct: ["bankDetailsId"],
    });

    // Get unique withdrawal modes
    const modesOfWithdrawal = await prisma.withdrawal.findMany({
      where: { walletId },
      select: { modeOfWithdrawal: true },
      distinct: ["modeOfWithdrawal"],
    });

    // Get unique statuses
    const statuses = await prisma.withdrawal.findMany({
      where: { walletId },
      select: { status: true },
      distinct: ["status"],
    });

    return {
      upis: upis.filter((item) => item.upiId), // Filter out null values
      bankDetails: bankDetails.filter((item) => item.bankDetailsId), // Filter out null values
      modesOfWithdrawal: modesOfWithdrawal.map((item) => item.modeOfWithdrawal),
      statuses: statuses.map((item) => item.status),
    };
  } catch (error) {
    console.error("Error getting filter options:", error);
    return {
      upis: [],
      bankDetails: [],
      modesOfWithdrawal: [],
      statuses: [],
    };
  }
}

export async function addBankOrUpi(req, res) {
  try {
    const {
      accountNumber,
      ifscCode,
      accountHolderName,
      upiId,
      type = "bank",
    } = req.body;

    const user = req.user;

    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const existingBankAccounts = await prisma.bankDetails.count({
      where: {
        userId: user.id,
        primary: false,
      },
    });

    const existingUpis = await prisma.uPI.count({
      where: {
        userId: user.id,
      },
    });

    if (existingBankAccounts + existingUpis >= 4) {
      return res.status(400).json({
        success: false,
        message: "You can add only maximum 4 bank accounts or UPIs",
      });
    }

    const primaryAccount = await prisma.bankDetails.findFirst({
      where: {
        userId: user.id,
        primary: true,
      },
    });

    if (!primaryAccount) {
      return res.status(400).json({
        success: false,
        message: "Please add a primary account first",
      });
    }

    if (type === "bank") {
      if (!accountHolderName || !accountNumber || !ifscCode) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields." });
      }

      const bankExists = await prisma.bankDetails.findFirst({
        where: {
          accountNumber: accountNumber,
        },
      });

      if (bankExists) {
        return res
          .status(400)
          .json({ success: false, message: "Account number already exists." });
      }

      const bankDetails = await prisma.bankDetails.create({
        data: {
          accountNumber,
          accountHolderName,
          ifscCode,
          userId: user.id,
        },
      });

      if (!bankDetails) {
        return res
          .status(400)
          .json({ success: false, message: "Failed to add bank details." });
      }

      return res.status(200).json({
        success: true,
        message: "Bank details added successfully.",
      });
    } else if (type === "upi") {
      if (!upiId) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields." });
      }

      const upiExists = await prisma.uPI.findFirst({
        where: {
          upiId: upiId,
        },
      });

      if (upiExists) {
        return res
          .status(400)
          .json({ success: false, message: "UPI ID already exists." });
      }

      const upiDetails = await prisma.uPI.create({
        data: {
          upiId,
          userId: user.id,
          bankDetailsId: primaryAccount.id,
        },
      });

      if (!upiDetails) {
        return res
          .status(400)
          .json({ success: false, message: "Failed to add UPI ID." });
      }

      return res.status(200).json({
        success: true,
        message: "UPI ID added successfully.",
      });
    }
  } catch (error) {
    console.error("Error in adding bank or upi details.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function updateBankOrUpi(req, res) {
  try {
    const {
      id,
      accountNumber,
      ifscCode,
      accountHolderName,
      upiId,
      type = "bank",
      primary = false,
    } = req.body;

    const user = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    if (type === "bank") {
      const bankAccount = await prisma.bankDetails.findFirst({
        where: {
          id: id,
          userId: user.id,
        },
      });

      if (!bankAccount) {
        return res
          .status(404)
          .json({ success: false, message: "Bank account not found." });
      }

      // If setting as primary
      if (primary === true) {
        await prisma.bankDetails.updateMany({
          where: {
            userId: user.id,
            primary: true,
          },
          data: {
            primary: false,
          },
        });
      } else if (bankAccount.primary === true) {
        const primaryAccountCount = await prisma.bankDetails.count({
          where: {
            userId: user.id,
            primary: true,
          },
        });

        if (primaryAccountCount <= 1) {
          return res.status(400).json({
            success: false,
            message: "You must have at least one primary bank account.",
          });
        }
      }

      // Check if account number already exists but with different ID
      if (accountNumber && accountNumber !== bankAccount.accountNumber) {
        const accountExists = await prisma.bankDetails.findFirst({
          where: {
            accountNumber: accountNumber,
            NOT: {
              id: id,
            },
          },
        });

        if (accountExists) {
          return res.status(400).json({
            success: false,
            message: "Account number already exists.",
          });
        }
      }

      // Update bank account
      const updatedBank = await prisma.bankDetails.update({
        where: {
          id: id,
        },
        data: {
          accountNumber: accountNumber || bankAccount.accountNumber,
          ifscCode: ifscCode || bankAccount.ifscCode,
          accountHolderName: accountHolderName || bankAccount.accountHolderName,
          primary,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Bank details updated successfully.",
        data: updatedBank,
      });
    } else if (type === "upi") {
      const upiAccount = await prisma.uPI.findFirst({
        where: {
          id: id,
          userId: user.id,
        },
      });

      if (!upiAccount) {
        return res
          .status(404)
          .json({ success: false, message: "UPI ID not found." });
      }

      // Check if UPI ID already exists but with different ID
      if (upiId && upiId !== upiAccount.upiId) {
        const upiExists = await prisma.uPI.findFirst({
          where: {
            upiId: upiId,
            NOT: {
              id: id,
            },
          },
        });

        if (upiExists) {
          return res
            .status(400)
            .json({ success: false, message: "UPI ID already exists." });
        }
      }

      // Update UPI
      const updatedUpi = await prisma.uPI.update({
        where: {
          id: id,
        },
        data: {
          upiId: upiId || upiAccount.upiId,
        },
      });

      return res.status(200).json({
        success: true,
        message: "UPI details updated successfully.",
        data: updatedUpi,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Use 'bank' or 'upi'.",
      });
    }
  } catch (error) {
    console.error("Error in updating bank or upi details.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function deleteBankOrUpi(req, res) {
  try {
    const { id, type = "bank" } = req.body;
    const user = req.user;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    if (type === "bank") {
      // Find the bank account
      const bankAccount = await prisma.bankDetails.findFirst({
        where: {
          id: id,
          userId: user.id,
        },
      });

      if (!bankAccount) {
        return res
          .status(404)
          .json({ success: false, message: "Bank account not found." });
      }

      // Check if it's a primary account
      if (bankAccount.primary) {
        // Count total bank accounts for this user
        const bankAccountsCount = await prisma.bankDetails.count({
          where: {
            userId: user.id,
          },
        });

        if (bankAccountsCount <= 1) {
          return res.status(400).json({
            success: false,
            message: "Cannot delete the primary bank account.",
          });
        }

        // Find another bank account to set as primary
        const anotherBank = await prisma.bankDetails.findFirst({
          where: {
            userId: user.id,
            NOT: {
              id: id,
            },
          },
        });

        if (anotherBank) {
          await prisma.bankDetails.update({
            where: {
              id: anotherBank.id,
            },
            data: {
              primary: true,
            },
          });
        }
      }

      // Delete the bank account
      await prisma.bankDetails.delete({
        where: {
          id: id,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Bank account deleted successfully.",
      });
    } else if (type === "upi") {
      const upiAccount = await prisma.uPI.findFirst({
        where: {
          id: id,
          userId: user.id,
        },
      });

      if (!upiAccount) {
        return res
          .status(404)
          .json({ success: false, message: "UPI ID not found." });
      }

      // Delete the UPI
      await prisma.uPI.delete({
        where: {
          id: id,
        },
      });

      return res.status(200).json({
        success: true,
        message: "UPI ID deleted successfully.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Use 'bank' or 'upi'.",
      });
    }
  } catch (error) {
    console.error("Error in deleting bank or upi details.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function getBankAndUpis(req, res) {
  try {
    const user = req.user;

    const userExist = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const bankAccountNumbers = await prisma.bankDetails.findMany({
      where: {
        userId: userExist.id,
      },
      select: {
        accountNumber: true,
      },
    });

    const upiIds = await prisma.uPI.findMany({
      where: {
        userId: userExist.id,
      },
      select: {
        upiId: true,
      },
    });

    if (!bankAccountNumbers || !upiIds) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch bank and upi details.",
      });
    }
    const responseData = {
      bankAccountNumbers: bankAccountNumbers.map((item) => item.accountNumber),
      upiIds: upiIds.map((item) => item.upiId),
    };

    return res.status(200).json({
      success: true,
      payload: {
        bankAccountNumbers: responseData.bankAccountNumbers,
        upiIds: responseData.upiIds,
      },
      message: "Fetched bank and upi details successfully.",
    });
  } catch (error) {
    console.error("Error in fetching bank and upi details.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

//const mpinOtpMap = {};

export async function setMPIN(req, res) {
  try {
    const user = req.user;

    //phone with countrycode
    const { mpin, phone } = req.body;

    if (!mpin || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    if (mpin.trim().length !== 4) {
      return res
        .status(400)
        .json({ success: false, message: "MPIN should be 4 digits." });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const wallet = await prisma.wallet.findFirst({
      where: {
        userId: userExists.id,
      },
    });

    if (!wallet) {
      return res
        .status(400)
        .json({ success: false, message: "Wallet not found." });
    }

    // const otp = Math.floor(1000 + Math.random() * 9000);
    // mpinOtpMap[user.id] = { mpin, otp };
    const otp = await sendOtp(phone);
    console.log("mpin setup otp --", otp);

    //send otp to user using twilio, yet to implement

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("Error in setting MPIN.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

export async function verifyMpinOtp(req, res) {
  try {
    const user = req.user;

    const { otp, phone, mpin } = req.body;

    if (!otp || !phone || !mpin) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }

    const wallet = await prisma.wallet.findFirst({
      where: {
        userId: userExists.id,
      },
    });

    if (!wallet) {
      return res
        .status(400)
        .json({ success: false, message: "Wallet not found." });
    }

    // const mpinOtp = mpinOtpMap[user.id];

    const hashMpin = await bcrypt.hash(mpin, 10);
    const otpStored = await prisma.otp.findFirst({
      where: {
        phoneNumber: phone,
      },
    });

    if (!otpStored) {
      return res.status(404).json({ message: "No otp found" });
    }
    const otpValid = await bcrypt.compare(otp, otpStored.phoneCodeHash);
    if (!otpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (otpValid) {
      console.log("otp validate", otpValid);
    }

    // if (otp !== "000000") {
    //   return res.status(400).json({ success: false, message: "Invalid OTP" });
    // }

    await prisma.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        mpin: hashMpin,
      },
    });

    return res.status(200).json({
      success: true,
      message: "MPIN set successfully.",
    });
  } catch (error) {
    console.error("Error in verifying MPIN OTP.", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}

// Get monthly earnings with filtering by product type
export async function getAllTimeEarnings(req, res) {
  const user = req.user;
  const { year = new Date().getFullYear(), productType } = req.query;

  try {
    const userExists = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    const wallet = await prisma.wallet.findFirst({
      where: {
        userId: userExists.id,
      },
    });

    if (!wallet) {
      return res.status(400).json({
        success: false,
        message: "Wallet not found.",
      });
    }

    // Create date range for the specified year
    const startDate = new Date(year, 0, 1); // January 1st
    const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st

    // Base query conditions
    const whereConditions = {
      creatorId: user.id,
      walletId: wallet.id,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: "COMPLETED",
    };

    if (productType) {
      whereConditions.productType = productType;
    }

    // Query transactions
    const transactions = await prisma.transaction.findMany({
      where: whereConditions,
      select: {
        amountAfterFee: true,
        createdAt: true,
        productType: true,
      },
    });

    const defaultEr = [
      { month: "Jan", earnings: 0 },
      { month: "Feb", earnings: 0 },
      { month: "Mar", earnings: 0 },
      { month: "Apr", earnings: 0 },
      { month: "May", earnings: 0 },
      { month: "Jun", earnings: 0 },
      { month: "Jul", earnings: 0 },
      { month: "Aug", earnings: 0 },
      { month: "Sep", earnings: 0 },
      { month: "Oct", earnings: 0 },
      { month: "Nov", earnings: 0 },
      { month: "Dec", earnings: 0 },
    ];

    // Create a copy to avoid modifying the original
    const monthlyEarnings = JSON.parse(JSON.stringify(defaultEr));

    // Process transactions to calculate monthly earnings
    transactions.forEach((transaction) => {
      const month = transaction.createdAt.getMonth(); // 0-11 for Jan-Dec
      monthlyEarnings[month].earnings += Number(transaction.amountAfterFee);
    });

    // Get product type breakdown
    const productBreakdown = {};

    transactions.forEach((transaction) => {
      const prodType = transaction.productType;
      const month = transaction.createdAt.getMonth();

      if (!productBreakdown[prodType]) {
        productBreakdown[prodType] = JSON.parse(JSON.stringify(defaultEr));
      }

      productBreakdown[prodType][month].earnings += Number(transaction.amountAfterFee);
    });

    // Get available product types for filtering UI
    const availableProductTypes = await prisma.transaction.findMany({
      where: {
        creatorId: user.id,
      },
      select: {
        productType: true,
      },
      distinct: ["productType"],
    });

    // Calculate total earnings for the year
    const totalEarnings = monthlyEarnings.reduce(
      (total, month) => total + month.earnings,
      0
    );

    return res.status(200).json({
      success: true,
      payload: {
        monthlyEarnings,
        productBreakdown,
        totalEarnings,
        year: Number(year),
        filter: productType || "All",
        availableFilters: availableProductTypes.map((item) => item.productType),
      },
      message: "Monthly earnings fetched successfully.",
    });
  } catch (error) {
    console.error("Error in getting all time earnings:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
