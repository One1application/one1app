import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { PhonePayClient } from "../config/phonepay.js";
import prisma from "../db/dbClient.js";
dotenv.config();
export async function createPayingUp(req, res) {
  try {
    const {
      title,
      description,
      discount,
      paymentDetails,
      category,
      testimonials,
      faqs,
      refundPolicies,
      tacs,
      coverImage,
      files,
    } = req.body;
    console.log("req body", req.body);

    const user = req.user;
    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }
    const discountData = Array.isArray(discount)
      ? discount
      : discount
      ? [discount]
      : [];
    await prisma.payingUp.create({
      data: {
        title,
        description,
        discount: discountData,
        paymentDetails,
        category,
        testimonials,
        faqs,
        refundPolicies,
        coverImage,
        tacs,
        files,
        createdById: user.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Paying up created successfully.",
    });
  } catch (error) {
    console.error("Error while creating paying Up.", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}

export async function editPayingUpDetails(req, res) {
  try {
    const { payingUpId } = req.params;
    const {
      title,
      description,
      paymentDetails,
      category,
      testimonials,
      faqs,
      refundPolicies,
      tacs,
      coverImage,
      files,
      discount,
    } = req.body;

    const user = req.user;

    const discountData = Array.isArray(discount)
      ? discount
      : discount
      ? [discount]
      : [];

    const payingUp = await prisma.payingUp.findUnique({
      where: {
        id: payingUpId,
      },
    });

    if (payingUp.createdById !== user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this payingUp.",
      });
    }

    await prisma.payingUp.update({
      where: {
        id: payingUpId,
      },
      data: {
        title,
        description,
        paymentDetails,
        category,
        testimonials,
        faqs,
        refundPolicies,
        coverImage,
        tacs,
        files,
        discount: discountData,
      },
    });

    const updatedPayingUp = await prisma.payingUp.findUnique({
      where: {
        id: payingUpId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Paying up updated successfully.",
      paylaod: {
        payingUp: updatedPayingUp,
      },
    });
  } catch (error) {
    console.error("Error while updating paying Up.", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}

export async function getCreatorPayingUps(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User not found.",
      });
    }

    const payingUps = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        createdPayingUps: {
          include: {
            _count: {
              select: {
                payingUpTickets: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!payingUps) {
      return res.status(400).json({
        success: false,
        message: "No Paying Ups found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched paying Ups successfully.",
      payload: {
        payingUps: payingUps?.createdPayingUps || [],
      },
    });
  } catch (error) {
    console.error("Error in fetching Paying Ups.", error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching Paying Ups.",
    });
  }
}

export async function getPayingUpById(req, res) {
  try {
    const { payingUpId } = req.params;
    const user = req.user;

    if (!payingUpId) {
      return res.status(403).json({
        success: false,
        message: "No paying up Id provided.",
      });
    }

    const payingUp = await prisma.payingUp.findUnique({
      where: {
        id: payingUpId,
      },
      include: {
        createdBy: {
          select: {
            name: true, // Select the username field from the related User model
          },
        },
        payingUpTickets: user
          ? {
              where: {
                boughtById: user.id,
              },
            }
          : false,
      },
    });

    if (!payingUp) {
      return res.status(401).json({
        success: false,
        message: "No paying found.",
      });
    }

    const sendFiles =
      user &&
      (payingUp.createdById === user.id || payingUp.payingUpTickets.length > 0);

    const payload = {
      payingUp: {
        ...payingUp,
        ...(sendFiles ? { files: payingUp.files } : { files: null }),
      },
    };

    return res.status(200).json({
      success: true,
      message: "Fetched payingUp successfully.",
      payload,
    });
  } catch (error) {
    console.error("Error in fetching paying up.", error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching paying up.",
    });
  }
}

export async function purchasePayingUp(req, res) {
  try {
    const { payingUpId, couponCode, validateOnly } = req.body;
    const user = req.user;

    if (!payingUpId) {
      return res.status(400).json({
        success: false,
        message: "PayingUp Id required.",
      });
    }

    const payingUp = await prisma.payingUp.findUnique({
      where: {
        id: payingUpId,
      },
      select: {
        paymentDetails: true,
        discount: true,
        payingUpTickets: {
          where: {
            boughtById: user.id,
          },
        },
        createdBy: true,
      },
    });
    console.log("payingUp", payingUp);
    console.log("discountData", payingUp.discount);
    if (!payingUp) {
      return res.status(400).json({
        success: false,
        message: "PayingUp not found.",
      });
    }

    if (!validateOnly) {
      if (payingUp.createdById === user.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot purchase your own paying up.",
        });
      }

      if (payingUp.payingUpTickets?.length > 0) {
        return res.status(400).json({
          success: false,
          message: "You have already purchased the tickets.",
        });
      }
    }

    if (!payingUp.paymentDetails.paymentEnabled) {
      await prisma.payingUpTicket.create({
        data: {
          payingUpId,
          boughtById: user.id,
        },
      });
      return res.status(200).json({
        success: true,
        message: "Ticket bought successfully for payingUp.",
      });
    }

    let discountData = payingUp.discount || null;
    let discountPrice = 0;
    if (couponCode && discountData && discountData.length > 0) {
      const matchingDiscount = discountData.find(
        (discount) => discount.code === couponCode
      );

      if (!matchingDiscount) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code.",
        });
      }

      const expiryDate = new Date(matchingDiscount.expiry);
      const currentDate = new Date();
      if (currentDate > expiryDate) {
        return res.status(400).json({
          success: false,
          message: "Coupon code has expired.",
        });
      }

      discountPrice = parseInt(
        payingUp.paymentDetails.totalAmount *
          (Number(matchingDiscount.percent) / 100).toFixed(2)
      );
    }

    let totalAmount = Math.round(
      payingUp.paymentDetails.totalAmount - discountPrice
    );
    if(totalAmount < 0) totalAmount = 0;
    console.log("totalAmount", totalAmount);
    if(validateOnly){
         return res.status(200).json({
            success: true,
            payload: {
              totalAmount,
              discountPrice,
              originalPrice: payingUp.paymentDetails.totalAmount
            },
          });
       }
    const orderId = randomUUID();
    console.log("orderId", orderId);
    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(orderId)
      .amount(totalAmount * 100)
      .redirectUrl(
        `${process.env.FRONTEND_URL}payment/verify?merchantOrderId=${orderId}&payingUpId=${payingUpId}&discountedPrice=${totalAmount}`
      )
      .build();

    const response = await PhonePayClient.pay(request);
    console.log("response from paying up", response);
    return res.status(200).json({
      success: true,
      payload: {
        redirectUrl: response.redirectUrl,
        payingUpId: payingUp.id,
        totalAmount,
        discountPrice,
       
      },
    });
  } catch (error) {
    console.error("Error while purchasing paying up.", error);
    return res.status(500).json({
      success: false,
      message: "Please try again later.",
    });
  }
}
