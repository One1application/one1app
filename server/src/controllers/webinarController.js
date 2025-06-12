import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { PhonePayClient } from "../config/phonepay.js";
import prisma from "../db/dbClient.js";
dotenv.config();

export async function createWebinar(req, res) {
  try {
    const {
      title,
      category,
      isOnline,
      venue,
      link,
      discount,
      description,
      isPaid,
      quantity,
      amount,
      startDateTime,
      endDateTime,
      coverImage,
      occurrence,
    } = req.body;
    const user = req.user; 

    console.log(description)
    
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
      d.percent !== undefined &&
        d.percent !== null &&
      (isNaN(parseFloat(d.percent)) ||
        parseFloat(d.percent) < 1 ||
        parseFloat(d.percent) > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid discount percentage '${d.percent}'. Should be between 1 and 100.`,
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
 

    await prisma.webinar.create({
      data: {
        title,
        description,
        category,
        coverImage,
        isOnline,
        venue,
        link,
        discount,
        occurrence,
        isPaid,
        quantity: parseInt(quantity, 10),
        amount: parseFloat(amount),
        startDate: new Date(startDateTime),
        endDate: new Date(endDateTime),
        createdById:user?.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Webinar created successfully.",
    });
  } catch (error) {
    console.log("Error in creating webinar.", error);
    return res.status(500).json({
      success: false,
      message: "Error in creating webinar.",
    });
  }
}

export async function editWebinar(req, res) {
  try {
    const { webinarId } = req.params;

    const {
      title,
      category,
      isOnline,
      description,
      venue,
      link,
      isPaid,
      quantity,
      amount,
      startDateTime,
      endDateTime,
      coverImage,
      occurrence,
      discount
    } = req.body;

    const user = req.user;

    const webinar = await prisma.webinar.findUnique({
      where: {
        id: webinarId,
      },
    });

    if (!webinar)
      return res
        .status(404)
        .json({ success: false, message: "Webinar not found." });

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
      d.percent !== undefined &&
        d.percent !== null &&
      (isNaN(parseFloat(d.percent)) ||
        parseFloat(d.percent) < 1 ||
        parseFloat(d.percent) > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid discount percentage '${d.percent}'. Should be between 1 and 100.`,
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

    const updatedWebinar = await prisma.webinar.update({
      where: {
        id: webinarId,
      },
      data: {
        title,
        category,
        coverImage,
        description,
        isOnline: isOnline,
        venue,
        link,
        discount,
        occurrence,
        isPaid: isPaid,
        quantity: parseInt(quantity, 10),
        amount: parseFloat(amount),
        startDate: new Date(startDateTime),
        endDate: new Date(endDateTime),
        createdById: user.id,
      },
    });
    console.log("webinar.discount", discount);

    return res.status(200).json({
      success: true,
      message: "Webinar edited successfully.",
      payload: {
        webinar: updatedWebinar,
      },
    });
  } catch (error) {
    console.error("Error in editing webinar.", error);
    return res.status(500).json({
      success: false,
      message: "Error in editing webinar.",
    });
  }
}

export async function getCreatorWebinars(req, res) {
  try {
    console.log(req.user, "user");

    const user = req.user;

    // if(!role == "Creator") {

    //     return res.status(404).json({
    //         success: false,
    //         message: "Not accessible."
    //     })
    // }

    const webinars = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        createdWebinars: {
          include: {
            _count: {
              select: {
                tickets: true,
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
      message: "Fetched webinars successfully.",
      payload: webinars,
    });
  } catch (error) {
    console.error("Error in fetching webinars.", error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching webinars.",
    });
  }
}

export async function getWebinarById(req, res) {
  try {
    const { webinarId } = req.params;
    const user = req.user;
    console.log(user, webinarId)

    if (!webinarId) {
      return res.status(403).json({
        success: false,
        message: "No webinar Id provided.",
      });
    }

    const webinar = await prisma.webinar.findUnique({
      where: {
        id: webinarId,
      },
      include: {
        createdBy: {
          select: {
            name: true, // Select the username field from the related User model
          },
        },
        ...(user && {
          tickets: {
            where: {
              boughtById: user.id,
            },
          },
        }),
      },
    });

    if (!webinar) {
      return res.status(401).json({
        success: false,
        message: "No webinar found.",
      });
    }

    const sendLink =
      user && (webinar.createdById === user.id || webinar.tickets.length > 0);

    return res.status(200).json({
      success: true,
      message: "Fetched webinar successfully.",
      payload: {
        webinar: {
          ...webinar,
          ...(sendLink ? { link: webinar.link } : { link: null }),
        },
      },
    });
  } catch (error) {
    console.error("Error in fetching webinar.", error);
    return res.status(500).json({
      success: false,
      message: "Error in fetching webinar.",
    });
  }
}

export async function purchaseWebinar(req, res) {
  try {
    const { webinarId, couponCode, validateOnly } = req.body;
    const user = req.user;

    if (!webinarId) {
      return res.status(400).json({
        success: false,
        message: "Webinar Id required.",
      });
    }

    const webinar = await prisma.webinar.findUnique({
      where: {
        id: webinarId,
      },
      select: {
        id: true,
        isPaid: true,
        amount: true,
        quantity: true,
        discount: true,
        amount: true,
        _count: {
          select: {
            tickets: true,
          },
        },
        tickets: {
          where: {
            boughtById: user.id,
          },
        },
        createdBy: true,
      },
    });

    if (!webinar) {
      return res.status(400).json({
        success: false,
        message: "Webinar not found.",
      });
    }

    if (!validateOnly) {
      if (webinar.createdBy.id === user.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot purchase your own webinar.",
        });
      }

      if (webinar.tickets?.length > 0) {
        return res.status(400).json({
          success: false,
          message: "You have already purchased the tickets.",
        });
      }

      if (webinar._count.tickets.length >= webinar.quantity) {
        return res.status(400).json({
          success: false,
          message: "No tickets available for this webinar.",
        });
      }
    }

    if (!webinar.isPaid) {
      await prisma.webinarTicket.create({
        data: {
          webinarId: webinar.id,
          boughtById: user.id,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Ticket bought successfully for webinar.",
      });
    }

    const discountData = webinar?.discount || null;
    console.log("discountData", discountData);
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

      if (expiryDate < currentDate) {
        return res.status(400).json({
          success: false,
          message: "Coupon code has expired.",
        });
      }

      discountPrice = parseInt(webinar.amount*(Number(matchingDiscount.percent)/100).toFixed(2));
    }

    // const order = await razorpay.orders.create(option);
    let totalAmount = Math.round(webinar.amount - discountPrice);
    if(totalAmount < 0) totalAmount = 0;
    if(validateOnly){
       return res.status(200).json({
          success: true,
          payload: {
            totalAmount,
            discountPrice,
            originalPrice: webinar.amount
          }
       });
    }

    const orderId = randomUUID();
    console.log("orderId", orderId);

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(orderId)
      .amount(totalAmount * 100)
      .redirectUrl(
        `${process.env.FRONTEND_URL}payment/verify?merchantOrderId=${orderId}&webinarId=${webinar.id}&discountedPrice=${totalAmount}`
      )
      .build();

      console.log("request", request)

    const response = await PhonePayClient.pay(request);
    return res.status(200).json({
      success: true,
      payload: {
        redirectUrl: response.redirectUrl,
        webinarId: webinar.id,
        totalAmount,
        discountPrice,
      },
    });
  } catch (error) {
    console.error("Error in puchasing webinar.", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}
