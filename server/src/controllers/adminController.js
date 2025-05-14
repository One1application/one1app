import prisma from "../db/dbClient.js";

export const adminSelfIdentification = async (req, res) => {
  try {
    const user = req.user;

    const userDetails = await prisma.user.findFirst({
      where: {
        id: user.id,
        role: {
          in: ["Admin", "SuperAdmin"],
        },
      },
      select: {
        email: true,
        phone: true,
        name: true,
        verified: true,
        role: true,
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

// ADMIN CRUD ROUTES
export const createAdmin = async (req, res) => {
  try {
    const { email, phoneNumber, name, role } = req.body;

    if (!["Admin", "SuperAdmin"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Must be Admin or SuperAdmin." });
    }

    const existingUserByEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists." });
    }

    const existingUserByPhone = await prisma.user.findFirst({
      where: { phone: phoneNumber },
    });

    if (existingUserByPhone) {
      return res
        .status(400)
        .json({ message: "A user with this phone number already exists." });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        phone: phoneNumber,
        name,
        role,
        verified: false,
        goals: [],
        heardAboutUs: "",
        socialMedia: "",
        wallet: { create: {} },
      },
    });

    return res
      .status(201)
      .json({ message: "User created successfully", newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [admins, total] = await Promise.all([
      prisma.user.findMany({
        where: { role: { in: ["Admin", "SuperAdmin"] } },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          phone: true,
          name: true,
          role: true,
        },
      }),
      prisma.user.count({ where: { role: { in: ["Admin", "SuperAdmin"] } } }),
    ]);

    return res.status(200).json({
      data: admins,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error getting admins:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phoneNumber, name, role } = req.body;

    if (role && !["Admin", "SuperAdmin"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Must be Admin or SuperAdmin." });
    }

    const updatedAdmin = await prisma.user.update({
      where: { id },
      data: {
        email,
        phone: phoneNumber,
        name,
        ...(role && { role }),
      },
    });

    return res
      .status(200)
      .json({ message: "Admin updated successfully", updatedAdmin });
  } catch (error) {
    console.error("Error updating admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await prisma.user.findUnique({
      where: { id },
      select: { role: true, wallet: true },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.role === "SuperAdmin") {
      return res.status(403).json({ message: "SuperAdmin cannot be deleted" });
    }

    // Delete the associated wallet if it exists
    if (admin.wallet) {
      await prisma.wallet.delete({
        where: { userId: id },
      });
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// ADMIN CRUD ROUTES END

// USER / CREATOR Routes
export const createUser = async (req, res) => {
  try {
    const { email, phoneNumber, name, goals, heardAboutUs, socialMedia, role } =
      req.body;

    // Validate role
    if (!["User", "Creator"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Only User or Creator allowed." });
    }

    const goalsData = goals ? goals.split(",").map((goal) => goal.trim()) : [];

    const existingUserByEmail = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists." });
    }

    const existingUserByPhone = await prisma.user.findFirst({
      where: { phone: phoneNumber },
    });

    if (existingUserByPhone) {
      return res
        .status(400)
        .json({ message: "A user with this phone number already exists." });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        phone: phoneNumber,
        name,
        role,
        verified: false,
        goals: goalsData,
        heardAboutUs,
        socialMedia,
        wallet: { create: {} },
      },
    });

    return res
      .status(201)
      .json({ message: "User created successfully", newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phoneNumber, name, goals, heardAboutUs, socialMedia, role } =
      req.body;

    // Validate role
    if (!["User", "Creator"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Invalid role. Only User or Creator allowed." });
    }

    const goalsData = goals ? goals.split(",").map((goal) => goal.trim()) : [];

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        phone: phoneNumber,
        name,
        role,
        goals: goalsData,
        heardAboutUs,
        socialMedia,
      },
    });

    return res
      .status(200)
      .json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const roleFilter = req.query.role
      ? { role: req.query.role }
      : { role: { in: ["User", "Creator"] } };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        where: roleFilter,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          socialMedia: true,
          goals: true,
          role: true,
          heardAboutUs: true,
          wallet: {
            select: { totalEarnings: true },
          },
        },
      }),
      prisma.user.count({ where: roleFilter }),
    ]);

    return res.status(200).json({
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error getting users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// USER / CREATOR Routes

// products RELATED CONTROLLER
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const productType = req.query.productType;

    const courseFilter =
      productType && productType !== "Course" ? { id: "" } : {};
    const webinarFilter =
      productType && productType !== "Webinar" ? { id: "" } : {};
    const telegramFilter =
      productType && productType !== "Telegram" ? { id: "" } : {};
    const payingUpFilter =
      productType && productType !== "PayingUp" ? { id: "" } : {};
    const premiumContentFilter =
      productType && productType !== "PremiumContent" ? { id: "" } : {};

    const [
      [courses, coursesCount],
      [webinars, webinarsCount],
      [telegrams, telegramsCount],
      [payingUps, payingUpsCount],
      [premiumContents, premiumContentsCount],
    ] = await Promise.all([
      Promise.all([
        prisma.course.findMany({
          where: courseFilter,
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            price: true,
            discount: true,
            validity: true,
            aboutThisCourse: true,
            testimonials: true,
            courseBenefits: true,
            faqs: true,
            gallery: true,
            coverImage: true,
            language: true,
            startDate: true,
            endDate: true,
            isVerified: true,
            creator: {
              select: {
                id: true,
                phone: true,
                email: true,
                name: true,
              },
            },
            products: {
              select: {
                productMetaData: true,
              },
            },
          },
        }),
        prisma.course.count({ where: courseFilter }),
      ]),
      Promise.all([
        prisma.webinar.findMany({
          where: webinarFilter,
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            category: true,
            coverImage: true,
            occurrence: true,
            startDate: true,
            endDate: true,
            isOnline: true,
            venue: true,
            link: true,
            discount: true,
            isPaid: true,
            quantity: true,
            amount: true,
            isVerified: true, // Added
            createdBy: {
              select: {
                id: true,
                phone: true,
                email: true,
                name: true,
              },
            },
          },
        }),
        prisma.webinar.count({ where: webinarFilter }),
      ]),
      Promise.all([
        prisma.telegram.findMany({
          where: telegramFilter,
          skip,
          take: limit,
          select: {
            id: true,
            coverImage: true,
            channelLink: true,
            title: true,
            description: true,
            genre: true,
            discount: true,
            subscription: true,
            isVerified: true, // Added
            createdBy: {
              select: {
                id: true,
                phone: true,
                email: true,
                name: true,
              },
            },
          },
        }),
        prisma.telegram.count({ where: telegramFilter }),
      ]),
      Promise.all([
        prisma.payingUp.findMany({
          where: payingUpFilter,
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            description: true,
            discount: true,
            paymentDetails: true,
            category: true,
            testimonials: true,
            faqs: true,
            refundPolicies: true,
            tacs: true,
            coverImage: true,
            files: true,
            isVerified: true, // Added
            createdBy: {
              select: {
                id: true,
                phone: true,
                email: true,
                name: true,
              },
            },
          },
        }),
        prisma.payingUp.count({ where: payingUpFilter }),
      ]),
      Promise.all([
        prisma.premiumContent.findMany({
          where: premiumContentFilter,
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            category: true,
            unlockPrice: true,
            content: true,
            discount: true,
            isVerified: true, // Added
            createdBy: {
              select: {
                id: true,
                phone: true,
                email: true,
                name: true,
              },
            },
          },
        }),
        prisma.premiumContent.count({ where: premiumContentFilter }),
      ]),
    ]);

    const products = [
      ...courses.map((course) => ({
        ProductID: course.id,
        ProductType: "Course",
        Title: course.title,
        Creator: {
          ID: course.creator.id,
          Name: course.creator.name,
          Phone: course.creator.phone,
          Email: course.creator.email,
        },
        Integrations: {
          Telegram: course.products[0]?.productMetaData?.telegram || false,
          WhatsApp: course.products[0]?.productMetaData?.whatsapp || false,
          Discord: course.products[0]?.productMetaData?.discord || false,
        },
        PaymentPage: true,
        Details: {
          Price: course.price,
          Discount: course.discount,
          Validity: course.validity,
          About: course.aboutThisCourse,
          Testimonials: course.testimonials,
          Benefits: course.courseBenefits,
          FAQs: course.faqs,
          Gallery: course.gallery,
          CoverImage: course.coverImage,
          Language: course.language,
          StartDate: course.startDate,
          EndDate: course.endDate,
          CommunityName:
            course.products[0]?.productMetaData?.communityName || null,
          FreeGroupName: course.products[0]?.productMetaData?.freeGroup || null,
          PaidGroupName: course.products[0]?.productMetaData?.paidGroup || null,
          Verified: course.isVerified, // Use isVerified from Course model
        },
      })),
      ...webinars.map((webinar) => ({
        ProductID: webinar.id,
        ProductType: "Webinar",
        Title: webinar.title,
        Creator: {
          ID: webinar.createdBy.id,
          Name: webinar.createdBy.name,
          Phone: webinar.createdBy.phone,
          Email: webinar.createdBy.email,
        },
        Integrations: {
          Telegram: webinar.link?.telegram || false,
          WhatsApp: webinar.link?.whatsapp || false,
          Discord: webinar.link?.discord || false,
        },
        PaymentPage: webinar.isPaid,
        Details: {
          Category: webinar.category,
          CoverImage: webinar.coverImage,
          Occurrence: webinar.occurrence,
          StartDate: webinar.startDate,
          EndDate: webinar.endDate,
          IsOnline: webinar.isOnline,
          Venue: webinar.venue,
          Link: webinar.link,
          Discount: webinar.discount,
          IsPaid: webinar.isPaid,
          Quantity: webinar.quantity,
          Amount: webinar.amount,
          Verified: webinar.isVerified, // Added
        },
      })),
      ...telegrams.map((telegram) => ({
        ProductID: telegram.id,
        ProductType: "Telegram",
        Title: telegram.title,
        Creator: {
          ID: telegram.createdBy.id,
          Name: telegram.createdBy.name,
          Phone: telegram.createdBy.phone,
          Email: telegram.createdBy.email,
        },
        Integrations: {
          Telegram: true,
          WhatsApp: false,
          Discord: false,
        },
        PaymentPage: true,
        Details: {
          CoverImage: telegram.coverImage,
          ChannelLink: telegram.channelLink,
          Description: telegram.description,
          Genre: telegram.genre,
          Discount: telegram.discount,
          Subscription: telegram.subscription,
          Verified: telegram.isVerified, // Added
        },
      })),
      ...payingUps.map((payingUp) => ({
        ProductID: payingUp.id,
        ProductType: "PayingUp",
        Title: payingUp.title,
        Creator: {
          ID: payingUp.createdBy.id,
          Name: payingUp.createdBy.name,
          Phone: payingUp.createdBy.phone,
          Email: payingUp.createdBy.email,
        },
        Integrations: {
          Telegram: false,
          WhatsApp: false,
          Discord: false,
        },
        PaymentPage: true,
        Details: {
          Description: payingUp.description,
          Discount: payingUp.discount,
          PaymentDetails: payingUp.paymentDetails,
          Category: payingUp.category,
          Testimonials: payingUp.testimonials,
          FAQs: payingUp.faqs,
          RefundPolicies: payingUp.refundPolicies,
          TermsAndConditions: payingUp.tacs,
          CoverImage: payingUp.coverImage,
          Files: payingUp.files,
          Verified: payingUp.isVerified, // Added
        },
      })),
      ...premiumContents.map((premiumContent) => ({
        ProductID: premiumContent.id,
        ProductType: "PremiumContent",
        Title: premiumContent.title,
        Creator: {
          ID: premiumContent.createdBy.id,
          Name: premiumContent.createdBy.name,
          Phone: premiumContent.createdBy.phone,
          Email: premiumContent.createdBy.email,
        },
        Integrations: {
          Telegram: false,
          WhatsApp: false,
          Discord: false,
        },
        PaymentPage: true,
        Details: {
          Category: premiumContent.category,
          UnlockPrice: premiumContent.unlockPrice,
          Content: premiumContent.content,
          Discount: premiumContent.discount,
          Verified: premiumContent.isVerified, // Added
        },
      })),
    ];

    const total = productType
      ? productType === "Course"
        ? coursesCount
        : productType === "Webinar"
        ? webinarsCount
        : productType === "Telegram"
        ? telegramsCount
        : productType === "PayingUp"
        ? payingUpsCount
        : premiumContentsCount
      : coursesCount +
        webinarsCount +
        telegramsCount +
        payingUpsCount +
        premiumContentsCount;

    return res.status(200).json({
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const toggleProductVerification = async (req, res) => {
  try {
    const { id, productType } = req.body;
    console.log(productType, id);

    if (!id || !productType) {
      return res
        .status(400)
        .json({ message: "Product ID and type are required" });
    }

    let updatedProduct;
    switch (productType) {
      case "Course":
        const course = await prisma.course.findUnique({
          where: { id },
          select: { isVerified: true },
        });
        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }
        updatedProduct = await prisma.course.update({
          where: { id },
          data: { isVerified: !course.isVerified },
          select: { id: true, isVerified: true },
        });
        break;
      case "Webinar":
        const webinar = await prisma.webinar.findUnique({
          where: { id },
          select: { isVerified: true },
        });
        if (!webinar) {
          return res.status(404).json({ message: "Webinar not found" });
        }
        updatedProduct = await prisma.webinar.update({
          where: { id },
          data: { isVerified: !webinar.isVerified },
          select: { id: true, isVerified: true },
        });
        break;
      case "Telegram":
        const telegram = await prisma.telegram.findUnique({
          where: { id },
          select: { isVerified: true },
        });
        if (!telegram) {
          return res.status(404).json({ message: "Telegram not found" });
        }
        updatedProduct = await prisma.telegram.update({
          where: { id },
          data: { isVerified: !telegram.isVerified },
          select: { id: true, isVerified: true },
        });
        break;
      case "PayingUp":
        const payingUp = await prisma.payingUp.findUnique({
          where: { id },
          select: { isVerified: true },
        });
        if (!payingUp) {
          return res.status(404).json({ message: "PayingUp not found" });
        }
        updatedProduct = await prisma.payingUp.update({
          where: { id },
          data: { isVerified: !payingUp.isVerified },
          select: { id: true, isVerified: true },
        });
        break;
      case "PremiumContent":
        const premiumContent = await prisma.premiumContent.findUnique({
          where: { id },
          select: { isVerified: true },
        });
        if (!premiumContent) {
          return res.status(404).json({ message: "PremiumContent not found" });
        }
        updatedProduct = await prisma.premiumContent.update({
          where: { id },
          data: { isVerified: !premiumContent.isVerified },
          select: { id: true, isVerified: true },
        });
        break;
      default:
        return res.status(400).json({ message: "Invalid product type" });
    }

    return res.status(200).json({
      message: "Verification status toggled successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error toggling product verification:", error);
    return res
      .status(500)
      .json({ message: "Failed to toggle verification status" });
  }
};

// PRODUCTS RELETED CONTROLLER END

export const getDashboardData = async (req, res) => {
  try {
    const { period = "today" } = req.query; // Filter by period: today, thisWeek, thisMonth, thisYear

    // Define the time range for the current period
    const now = new Date();
    let startDate,
      endDate = now;
    let prevStartDate, prevEndDate;

    switch (period.toLowerCase()) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        prevEndDate = new Date(startDate);
        prevStartDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1
        );
        break;
      case "thisweek":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - now.getDay()
        );
        prevEndDate = new Date(startDate);
        prevStartDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - now.getDay() - 7
        );
        break;
      case "thismonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        prevEndDate = new Date(startDate);
        prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case "thisyear":
        startDate = new Date(now.getFullYear(), 0, 1);
        prevEndDate = new Date(startDate);
        prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        prevEndDate = new Date(startDate);
        prevStartDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1
        );
    }

    // Fetch creators (Role: Creator)
    const creators = await prisma.user.findMany({
      where: { role: "Creator" },
      include: {
        wallet: {
          include: {
            transactions: true,
          },
        },
      },
    });

    // Fetch transactions for creators within the current period
    const creatorIds = creators.map((creator) => creator.id);
    const transactions = await prisma.transaction.findMany({
      where: {
        wallet: {
          userId: { in: creatorIds },
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "COMPLETED",
      },
      include: {
        wallet: {
          include: {
            user: true,
          },
        },
      },
    });

    // Fetch transactions for creators within the previous period
    const prevTransactions = await prisma.transaction.findMany({
      where: {
        wallet: {
          userId: { in: creatorIds },
        },
        createdAt: {
          gte: prevStartDate,
          lte: prevEndDate,
        },
        status: "COMPLETED",
      },
      include: {
        wallet: {
          include: {
            user: true,
          },
        },
      },
    });

    // Calculate Today's Revenue
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const todayTransactions = transactions.filter(
      (tx) => new Date(tx.createdAt) >= todayStart
    );
    const todaysRevenue = todayTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    // Calculate Total Revenue, Spend, and Saving (Current Period)
    const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const transactionChargeRate = 0.0195; // 1.95%
    const totalSpend = transactions.reduce(
      (sum, tx) => sum + tx.amount * transactionChargeRate,
      0
    );

    // Calculate creator commissions and total saving
    let totalCommission = 0;
    for (const creator of creators) {
      const creatorTransactions = transactions.filter(
        (tx) => tx.wallet.userId === creator.id
      );
      const creatorRevenue = creatorTransactions.reduce(
        (sum, tx) => sum + tx.amount,
        0
      );
      const commissionRate = (creator.creatorComission || 8) / 100; // Default to 8%
      totalCommission += creatorRevenue * commissionRate;
    }
    const totalSaving = totalCommission - totalSpend;

    // Calculate Total Revenue, Spend, and Saving (Previous Period)
    const prevTotalRevenue = prevTransactions.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );
    const prevTotalSpend = prevTransactions.reduce(
      (sum, tx) => sum + tx.amount * transactionChargeRate,
      0
    );
    let prevTotalCommission = 0;
    for (const creator of creators) {
      const creatorTransactions = prevTransactions.filter(
        (tx) => tx.wallet.userId === creator.id
      );
      const creatorRevenue = creatorTransactions.reduce(
        (sum, tx) => sum + tx.amount,
        0
      );
      const commissionRate = (creator.creatorComission || 8) / 100;
      prevTotalCommission += creatorRevenue * commissionRate;
    }
    const prevTotalSaving = prevTotalCommission - prevTotalSpend;

    // Calculate Creator Metrics (Current Period)
    const totalCreators = creators.length;
    const newCreators = creators.filter((creator) => {
      const createdAt = new Date(creator.createdAt || creator.updatedAt);
      return createdAt >= startDate && createdAt <= endDate;
    }).length;
    const activeCreatorIds = new Set(
      transactions.map((tx) => tx.wallet.userId)
    );
    const deactiveCreators = creators.filter(
      (creator) => !activeCreatorIds.has(creator.id)
    ).length;

    // Calculate Creator Metrics (Previous Period)
    const prevNewCreators = creators.filter((creator) => {
      const createdAt = new Date(creator.createdAt || creator.updatedAt);
      return createdAt >= prevStartDate && createdAt <= prevEndDate;
    }).length;
    const prevActiveCreatorIds = new Set(
      prevTransactions.map((tx) => tx.wallet.userId)
    );
    const prevDeactiveCreators = creators.filter(
      (creator) => !prevActiveCreatorIds.has(creator.id)
    ).length;

    // Calculate Percentage Changes
    const calculatePercentageChange = (current, previous) => {
      if (previous === 0 && current === 0) return 0;
      if (previous === 0) return current > 0 ? 100 : -100;
      return ((current - previous) / previous) * 100;
    };

    const revenuePercentage = calculatePercentageChange(
      totalRevenue,
      prevTotalRevenue
    );
    const spendPercentage = calculatePercentageChange(
      totalSpend,
      prevTotalSpend
    );
    const savingPercentage = calculatePercentageChange(
      totalSaving,
      prevTotalSaving
    );
    const newCreatorsPercentage = calculatePercentageChange(
      newCreators,
      prevNewCreators
    );
    const deactiveCreatorsPercentage = calculatePercentageChange(
      deactiveCreators,
      prevDeactiveCreators
    );

    // Creators Leaderboard
    const leaderboardData = creators
      .map((creator) => {
        const creatorTransactions = transactions.filter(
          (tx) => tx.wallet.userId === creator.id
        );
        const earnings = creatorTransactions.reduce(
          (sum, tx) => sum + tx.amount,
          0
        );
        return {
          name: creator.name,
          earnings: earnings.toFixed(2),
        };
      })
      .filter((creator) => creator.earnings > 0)
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5); // Top 5 creators

    // Pie Chart Data: Spending Distribution
    const spendingData = [
      { name: "Transaction Charges", value: totalSpend },
      { name: "Creator Commissions", value: totalCommission },
    ];

    // Pie Chart Data: Creator Distribution
    const creatorDistribution = [
      { name: "Active Creators", value: totalCreators - deactiveCreators },
      { name: "Inactive Creators", value: deactiveCreators },
    ];

    // Last Updated
    const lastUpdated = now.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return res.status(200).json({
      todaysRevenue: todaysRevenue.toFixed(2),
      lastUpdated,
      stats: [
        {
          title: "Total Revenue",
          value: `₹${totalRevenue.toFixed(2)}`,
          trend: revenuePercentage >= 0 ? "positive" : "negative",
          percentage: `${
            revenuePercentage >= 0 ? "+" : ""
          }${revenuePercentage.toFixed(2)}%`,
        },
        {
          title: "Total Spend",
          value: `₹${totalSpend.toFixed(2)}`,
          trend: spendPercentage >= 0 ? "positive" : "negative",
          percentage: `${
            spendPercentage >= 0 ? "+" : ""
          }${spendPercentage.toFixed(2)}%`,
        },
        {
          title: "Total Saving",
          value: `₹${totalSaving.toFixed(2)}`,
          trend: savingPercentage >= 0 ? "positive" : "negative",
          percentage: `${
            savingPercentage >= 0 ? "+" : ""
          }${savingPercentage.toFixed(2)}%`,
        },
        {
          title: "Total Creators",
          value: totalCreators.toString(),
          trend: "positive", // Total creators is always positive as it's a count
          percentage: "+0%", // Total creators doesn't change period-to-period
        },
        {
          title: "New Creators",
          value: newCreators.toString(),
          trend: newCreatorsPercentage >= 0 ? "positive" : "negative",
          percentage: `${
            newCreatorsPercentage >= 0 ? "+" : ""
          }${newCreatorsPercentage.toFixed(2)}%`,
        },
        {
          title: "Deactive Creators",
          value: deactiveCreators.toString(),
          trend: deactiveCreatorsPercentage >= 0 ? "negative" : "positive",
          percentage: `${
            deactiveCreatorsPercentage >= 0 ? "+" : ""
          }${deactiveCreatorsPercentage.toFixed(2)}%`,
        },
      ],
      leaderboard: {
        today: leaderboardData,
        thisWeek: leaderboardData, // Unchanged as per original logic
        thisMonth: leaderboardData,
        thisYear: leaderboardData,
      },
      spendingPieChart: spendingData,
      creatorPieChart: creatorDistribution,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

// Creator Report

export const getCreatorReport = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || "";
    const kycStatus = req.query.kycStatus || "";
    const verifiedStatus = req.query.verifiedStatus || "";

    // Build where clause for filtering
    const where = {
      role: "Creator",
      OR: searchTerm
        ? [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
            { phone: { contains: searchTerm, mode: "insensitive" } },
          ]
        : undefined,
      kycRecords: kycStatus ? { status: kycStatus.toUpperCase() } : undefined,
      verified: verifiedStatus ? verifiedStatus === "true" : undefined,
    };

    // Get statistics
    const [totalCreators, verifiedCreators, unverifiedCreators] =
      await Promise.all([
        prisma.user.count({ where: { role: "Creator" } }),
        prisma.user.count({ where: { role: "Creator", verified: true } }),
        prisma.user.count({ where: { role: "Creator", verified: false } }),
      ]);

    // Get paginated creators
    const [creators, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          verified: true,
          kycRecords: { select: { status: true } },
        },
        orderBy: { name: "asc" },
      }),
      prisma.user.count({ where }),
    ]);

    // Format creator data
    const formattedCreators = creators.map((creator) => ({
      id: creator.id,
      name: creator.name,
      email: creator.email,
      phone: creator.phone,
      verified: creator.verified,
      kycStatus: creator.kycRecords?.status || "PENDING",
    }));

    res.status(200).json({
      statistics: {
        totalCreators,
        verifiedCreators,
        unverifiedCreators,
      },
      creators: {
        data: formattedCreators,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching creator report:", error);
    res.status(500).json({ message: "Failed to fetch creator report" });
  }
};

export const getCreatorDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const creator = await prisma.user.findUnique({
      where: { id, role: "Creator" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        socialMedia: true,
        goals: true,
        heardAboutUs: true,
        verified: true,
        creatorComission: true,
        kycRecords: {
          select: {
            status: true,
            aadhaarNumber: true,
            panCard: true,
            selfie: true,
            aadhaarBack: true,
            aadhaarFront: true,

            socialMedia: true,
            rejectionReason: true,
          },
        },
        businessInfo: {
          select: {
            firstName: true,
            lastName: true,
            businessStructure: true,
            gstNumber: true,
            sebiNumber: true,
          },
        },
        BankAccounts: {
          select: {
            id: true,
            accountHolderName: true,
            accountNumber: true,
            ifscCode: true,
            primary: true,
          },
        },
        upiIds: {
          select: {
            id: true,
            upiId: true,
          },
        },
      },
    });

    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    // Add availability flags
    const response = {
      ...creator,
      hasKyc: !!creator.kycRecords,
      hasBusinessInfo: !!creator.businessInfo,
      hasBankDetails:
        creator.BankAccounts.length > 0 || creator.upiIds.length > 0,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching creator details:", error);
    res.status(500).json({ message: "Failed to fetch creator details" });
  }
};

export const toggleCreatorKycStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["PENDING", "VERIFIED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid KYC status" });
    }

    const updatedKyc = await prisma.kycRecords.update({
      where: { userId: id },
      data: {
        status,
        rejectionReason: status === "REJECTED" ? rejectionReason : null,
      },
    });

    //
    await prisma.wallet.update({
      where: {
        userId: updatedKyc.userId,
      },
      data: {
        isKycVerified: status === "VERIFIED",
      },
    });

    await prisma.user.update({
      where: { id },
      data: { verified: status === "VERIFIED" },
    });

    res
      .status(200)
      .json({ message: "KYC status updated", kycStatus: updatedKyc.status });
  } catch (error) {
    console.error("Error updating KYC status:", error);
    res.status(500).json({ message: "Failed to update KYC status" });
  }
};

export const updateCreatorPersonalDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      socialMedia,
      goals,
      heardAboutUs,
      creatorComission = 8,
    } = req.body;

    // Validate inputs
    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ message: "Name, email, and phone are required" });
    }

    const updatedCreator = await prisma.user.update({
      where: { id, role: "Creator" },
      data: {
        name,
        email,
        phone,
        socialMedia,
        goals,
        heardAboutUs,
        creatorComission: parseInt(creatorComission),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        socialMedia: true,
        goals: true,
        heardAboutUs: true,
        creatorComission: true,
      },
    });

    res
      .status(200)
      .json({ message: "Personal details updated", creator: updatedCreator });
  } catch (error) {
    console.error("Error updating personal details:", error);
    res.status(500).json({ message: "Failed to update personal details" });
  }
};

export const getCreatoreWithDrawls = async (req, res) => {
  try {
    const { creatorId } = req.params;

    if (!creatorId) {
      return res.status(400).send({
        success: false,
        message: "Creator Id Required",
      });
    }

    const withdrawalsDetails = await prisma.withdrawal.findMany({
      where: {
        wallet: {
          userId: creatorId,
          user: {
            role: "Creator",
          },
        },
      },
      select: {
        id: true,
        amount: true,
        status: true,
        failedReason: true,
        modeOfWithdrawal: true,
        bankDetails: {
          select: {
            accountHolderName: true,
            accountNumber: true,
            ifscCode: true,
          },
        },
        upi: {
          select: {
            upiId: true,
          },
        },
        createdAt: true,
        wallet: {
          select: {
            balance: true,
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).send({
      success: true,
      message: "Creator WithDrawls True",
      withdrawalsDetails,
    });
  } catch (error) {
    console.log("ERROR: GetWithDrawls Fails", error);
    return res.status(500).send({
      success: false,
      message: "Error in Getting WithDrawls",
      error: "Internal Server Error",
    });
  }
};

export const updateWithDrawlsStatus = async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { status, failedReason } = req.body;

    if (!withdrawalId || !status) {
      return res.status(400).json({
        success: false,
        message: "Withdrawal ID and status are required",
      });
    }

    if (!["PENDING", "SUCCESS", "FAILED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { wallet: true },
    });

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: "Withdrawal not found",
      });
    }

    if (withdrawal.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only pending withdrawals can be updated",
      });
    }

    let updateData = { status };

    if (status === "FAILED") {
      updateData.failedReason = failedReason || "No reason provided";
    }

    if (status === "SUCCESS") {
      if (withdrawal.wallet.balance < withdrawal.amount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient wallet balance",
        });
      }

      await prisma.$transaction([
        prisma.withdrawal.update({
          where: { id: withdrawalId },
          data: {
            status,
            wallet: {
              update: {
                balance: {
                  decrement: withdrawal.amount,
                },
                totalWithdrawals: {
                  increment: withdrawal.amount,
                },
              },
            },
          },
        }),
      ]);
    } else {
      await prisma.withdrawal.update({
        where: { id: withdrawalId },
        data: updateData,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Withdrawal status updated successfully",
    });
  } catch (error) {
    console.error("ERROR: Update Withdrawal Status Failed", error);
    return res.status(500).json({
      success: false,
      message: "Error updating withdrawal status",
      error: "Internal Server Error",
    });
  }
};
//User Payment Transaction Report
export const getPayments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      productType,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (search) {
      where.OR = [
        { id: { contains: search, mode: "insensitive" } },
        { productId: { contains: search, mode: "insensitive" } },
        { buyer: { name: { contains: search, mode: "insensitive" } } },
        { buyer: { email: { contains: search, mode: "insensitive" } } },
        { creator: { name: { contains: search, mode: "insensitive" } } },
        { creator: { email: { contains: search, mode: "insensitive" } } },
      ];
    }
    if (status) {
      where.status = status;
    }
    if (productType) {
      where.productType = productType;
    }

    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [payments, total] = await Promise.all([
      prisma.transaction.findMany({
        skip,
        take: limitNum,
        where,
        orderBy,
        select: {
          id: true,
          amount: true,
          productId: true,
          productType: true,
          status: true,
          modeOfPayment: true,
          createdAt: true,
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    const formattedPayments = payments.map((payment) => ({
      ...payment,
      buyerName: payment.buyer.name,
      buyerEmail: payment.buyer.email,
      creatorName: payment.creator.name,
      creatorEmail: payment.creator.email,
    }));

    return res.status(200).json({
      success: true,
      data: formattedPayments,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: "Internal Server Error",
    });
  }
};
