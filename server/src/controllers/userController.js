import prisma from "../db/dbClient.js";

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

export const userCustomers = async (req, res) => {
  try {
    const user = req.user;
    const { param } = req.params;
    const page = param || 1;
    const pageSize = 20;

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
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
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
          skip: (page - 1) * pageSize,
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
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
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
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
        },
      },
    });

    const customers = [];

    userDetails.createdPayingUps.forEach((val) => {
      val.payingUpTickets.forEach((ticket) => {
        customers.push({
          ...ticket.boughtBy,
          product: "Paying Up",
        });
      });
    });
    userDetails.createdWebinars.forEach((val) => {
      val.tickets.forEach((ticket) => {
        customers.push({
          ...ticket.boughtBy,
          product: "Webinar",
        });
      });
    });
    userDetails.createdCourses.forEach((val) => {
      val.purchasedBy.forEach((ticket) => {
        customers.push({
          ...ticket.purchaser,
          product: "Course",
        });
      });
    });
    userDetails.createdTelegrams.forEach((val) => {
      val.boughtBy.forEach((ticket) => {
        customers.push({
          ...ticket.boughtBy,
          product: "Telegram",
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
            language: true,
            aboutThisCourse: true,
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
