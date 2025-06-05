import prisma from "../db/dbClient.js";
import { verification_otp_Email } from "../utils/EmailTemplates/sendemail.js";
import { otpforemailchange } from "../utils/otpforemailchange.js";

export const selfIdentification = async (req, res) => {
  try {
    const user = req.user;

    const userDetails = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        email: true,
        phone: true,
        name: true,
        verified: true,
        role: true,
        id: true,
      },
    });

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "USer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      userDetails,
    });
  } catch (error) {
    console.error("Error in self identifying.", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

// sumen sir

export const updateUserProfile = async (req, res) => {
  try {
    const user = req?.user;
    const { email, name, otp } = req.body;
    console.log(email);

    const existingUser = await prisma.user.findUnique({
      where: { id: user?.id },
      include: { otpStore: true },
    });

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (!email && !name) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update (email or name).",
      });
    }

    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use.",
        });
      }

      if (!otp) {
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const verification_otp = otpforemailchange();

        await prisma.oTPStore.upsert({
          where: { userId: existingUser.id },
          update: { otp: verification_otp, expiresAt },
          create: { otp: verification_otp, expiresAt, userId: existingUser.id },
        });

        verification_otp_Email(existingUser?.email, verification_otp);

        return res.status(200).json({
          success: true,
          message: "Email verification OTP sent successfully.",
          requiresOtp: true,
        });
      }

      if (otp) {
        if (!existingUser.otpStore || existingUser.otpStore.otp !== otp) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid OTP." });
        }

        if (existingUser.otpStore.expiresAt < new Date()) {
          return res
            .status(400)
            .json({ success: false, message: "OTP expired." });
        }

        await prisma.oTPStore.delete({ where: { userId: existingUser.id } });

        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            ...(email && { email }),
            ...(name && { name }),
          },
          select: { id: true, name: true, email: true },
        });

        return res.status(200).json({
          success: true,
          message: "Email updated successfully.",
          user: updatedUser,
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(email && { email }),
        ...(name && { name }),
      },
      select: { id: true, name: true, email: true, verified: true, role: true },
    });

    console.log(updatedUser);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const userCustomers = async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 20;
    const skip = page > 1 ? (page - 1) * pageSize : 0;

    const userDetails = await prisma.user.findFirst({
      where: { id: user.id },
      select: {
        createdWebinars: {
          include: {
            tickets: {
              select: {
                boughtBy: {
                  select: {
                    email: true,
                    phone: true,
                    name: true,
                  },
                },
                webinar: {
                  select: {
                    amount: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: pageSize,
          skip: skip,
        },

        premiumContent: {
          include: {
            access: {
              select: {
                expiryDate: true,
                user: {
                  select: {
                    email: true,
                    phone: true,
                    name: true,
                  },
                },
                premiumContent: {
                  select: {
                    unlockPrice: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: pageSize,
          skip: skip,
        },
        createdTelegrams: {
          select: {
            telegramSubscriptions: {
              select: {
                boughtBy: {
                  select: {
                    email: true,
                    phone: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: pageSize,
          skip: skip,
        },
        createdCourses: {
          select: {
            purchasedBy: {
              select: {
                purchaser: {
                  select: {
                    email: true,
                    phone: true,
                    name: true,
                  },
                },
                course: {
                  select: {
                    price: true,
                    endDate: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: pageSize,
          skip: skip,
        },
        createdPayingUps: {
          select: {
            payingUpTickets: {
              select: {
                boughtBy: {
                  select: {
                    email: true,
                    phone: true,
                    name: true,
                  },
                },
                payingUp: {
                  select: {
                    paymentDetails: {
                      select: {
                        totalAmount: {
                          json: "totalAmount",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: pageSize,
          skip: skip,
        },
      },
    });

    const customers = [];

    userDetails.createdPayingUps?.forEach((val) => {
      val.payingUpTickets?.forEach((ticket) => {
        customers.push({
          ...ticket.boughtBy,
          product: "Paying Up",
          amountSpent: ticket.payingUp?.paymentDetails?.totalAmount || 0,
          activeSubscriptions: true,
        });
      });
    });
    userDetails.premiumContent?.forEach((val) => {
      val.access?.forEach((ticket) => {
        customers.push({
          ...ticket.user,
          product: "Premium Content",
          amountSpent: ticket.premiumContent?.unlockPrice || 0,
          activeSubscriptions: ticket.expiryDate >= new Date(),
        });
      });
    });
    userDetails.createdWebinars?.forEach((val) => {
      val.tickets?.forEach((ticket) => {
        customers.push({
          ...ticket.boughtBy,
          product: "Webinar",
          amountSpent: ticket.webinar?.amount || 0,
          activeSubscriptions: true,
        });
      });
    });
    userDetails.createdCourses?.forEach((val) => {
      val.purchasedBy?.forEach((ticket) => {
        customers.push({
          ...ticket.purchaser,
          product: "Course",
          amountSpent: ticket.course?.price || 0,
          activeSubscriptions: ticket.course.endDate >= new Date(),
        });
      });
    });
    userDetails?.createdTelegrams?.forEach((val) => {
      console.log("telegram", userDetails.createdTelegrams , val)
      val.boughtBy?.forEach((ticket) => {
        customers.push({
          ...ticket.boughtBy,
          product: "Telegram",
           amountSpent: ticket.telegram?.subscription.cost || 0,
          activeSubscriptions: true
          //need to add amountspent and activeSubs
        });
      });
    });

    return res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("Error in fetching user customers.", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

export const getWebinarPurchases = async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const webinarPurchases = await prisma.webinarTicket.findMany({
      where: {
        boughtById: user.id,
      },
      include: {
        webinar: {
          select: {
            title: true,
            category: true,
            startDate: true,
            endDate: true,
            amount: true,
            coverImage: true,
            link: true,
            isOnline: true,
            venue: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                socialMedia: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalItems = await prisma.webinarTicket.count({
      where: {
        boughtById: user.id,
      },
    });

    return res.status(200).json({
      success: true,
      data: webinarPurchases,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    console.error("Error in fetching webinar purchases:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

export const getCoursePurchases = async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const coursePurchases = await prisma.coursePurchasers.findMany({
      where: {
        purchaserId: user.id,
      },
      include: {
        course: {
          select: {
            title: true,
            price: true,
            startDate: true,
            coverImage: true,
            endDate: true,
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                socialMedia: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalItems = await prisma.coursePurchasers.count({
      where: {
        purchaserId: user.id,
      },
    });

    return res.status(200).json({
      success: true,
      data: coursePurchases,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    console.error("Error in fetching course purchases:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

export const getPremiumContentAccess = async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const premiumAccess = await prisma.premiumContentAccess.findMany({
      where: {
        userId: user.id,
      },
      include: {
        premiumContent: {
          select: {
            title: true,
            category: true,
            unlockPrice: true,
            createdAt: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                socialMedia: true,
              },
            },
          },
        },
      },
      orderBy: {
        purchasedAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalItems = await prisma.premiumContentAccess.count({
      where: {
        userId: user.id,
      },
    });

    return res.status(200).json({
      success: true,
      data: premiumAccess,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    console.error("Error in fetching premium content access:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

export const getPayingUpPurchases = async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const payingUpPurchases = await prisma.payingUpTicket.findMany({
      where: {
        boughtById: user.id,
      },
      include: {
        payingUp: {
          select: {
            title: true,
            description: true,
            category: true,
            files: true,
            coverImage: true,
            createdAt: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                socialMedia: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalItems = await prisma.payingUpTicket.count({
      where: {
        boughtById: user.id,
      },
    });

    return res.status(200).json({
      success: true,
      data: payingUpPurchases,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    console.error("Error in fetching paying up purchases:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

export const getTelegramSubscriptions = async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const telegramSubscriptions = await prisma.telegramSubscription.findMany({
      where: {
        boughtById: user.id,
      },
      include: {
        telegram: {
          select: {
            title: true,
            description: true,
            genre: true,
            coverImage: true,
            createdAt: true,
            subscription: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                socialMedia: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalItems = await prisma.telegramSubscription.count({
      where: {
        boughtById: user.id,
      },
    });

    return res.status(200).json({
      success: true,
      data: telegramSubscriptions,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    console.error("Error in fetching telegram subscriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};
