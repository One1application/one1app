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
      isPaid,
      quantity,
      amount,
      startDateTime,
      endDateTime,
      coverImage,
      occurrence,
    } = req.body;
    const user = req.user;

    await prisma.webinar.create({
      data: {
        title,
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
        createdById: user.id,
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
      venue,
      link,
      isPaid,
      quantity,
      amount,
      startDateTime,
      endDateTime,
      coverImage,
      occurrence,
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

    const updatedWebinar = await prisma.webinar.update({
      where: {
        id: webinarId,
      },
      data: {
        title,
        category,
        coverImage,
        isOnline: isOnline,
        venue,
        link,
        occurrence,
        isPaid: isPaid,
        quantity: parseInt(quantity, 10),
        amount: parseFloat(amount),
        startDate: new Date(startDateTime),
        endDate: new Date(endDateTime),
        createdById: user.id,
      },
    });

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
        tickets: user
          ? {
              where: {
                boughtById: user.id,
              },
            }
          : false,
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
    const { webinarId } = req.body;
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
      },
    });

    if (webinar.createdById === user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot purchase your own webinar.",
      });
    }

    if (!webinar) {
      return res.status(400).json({
        success: false,
        message: "Webinar not found.",
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

    // const option = {
    //     amount: webinar.amount * 100,
    //     currency: "INR",
    //     payment_capture: 1
    // }

    // const order = await razorpay.orders.create(option);
    const orderId = randomUUID();

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(orderId)
      .amount(webinar.amount * 100)
      .redirectUrl(
        `${process.env.FRONTEND_URL}payment/verify?merchantOrderId=${orderId}&webinarId=${webinar.id}`
      )
      .build();

    const response = await PhonePayClient.pay(request);
    return res.status(200).json({
      success: true,
      payload: {
        redirectUrl: response.redirectUrl,
        webinarId: webinar.id,
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
