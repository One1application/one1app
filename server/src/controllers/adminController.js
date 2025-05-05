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

    // Define the time range based on the period
    const now = new Date();
    let startDate;
    let endDate = now;

    switch (period.toLowerCase()) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "thisweek":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - now.getDay()
        );
        break;
      case "thismonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "thisyear":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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

    // Fetch transactions for creators within the period
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
        status: "SUCCESS", // Assuming only successful transactions count
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

    // Calculate Total Revenue, Spend, and Saving
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
      const commissionRate = (creator.creatorComission || 8) / 100; // Default to 8% if not set
      totalCommission += creatorRevenue * commissionRate;
    }
    const totalSaving = totalCommission - totalSpend;

    // Calculate Creator Metrics
    const totalCreators = creators.length;

    // New Creators: Joined within the period
    const newCreators = creators.filter((creator) => {
      const createdAt = new Date(creator.createdAt || creator.updatedAt);
      return createdAt >= startDate && createdAt <= endDate;
    }).length;

    // Deactive Creators: No transactions in the period
    const activeCreatorIds = new Set(
      transactions.map((tx) => tx.wallet.userId)
    );
    const deactiveCreators = creators.filter(
      (creator) => !activeCreatorIds.has(creator.id)
    ).length;

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
          trend: totalRevenue >= 0 ? "positive" : "negative",
          percentage: totalRevenue >= 0 ? "+0%" : "-0%", // Simplified for now
        },
        {
          title: "Total Spend",
          value: `₹${totalSpend.toFixed(2)}`,
          trend: "negative",
          percentage: "-0%", // Simplified for now
        },
        {
          title: "Total Saving",
          value: `₹${totalSaving.toFixed(2)}`,
          trend: totalSaving >= 0 ? "positive" : "negative",
          percentage: totalSaving >= 0 ? "+0%" : "-0%", // Simplified for now
        },
        {
          title: "Total Creators",
          value: totalCreators.toString(),
          trend: "positive",
          percentage: "+0%", // Simplified for now
        },
        {
          title: "New Creators",
          value: newCreators.toString(),
          trend: newCreators >= 0 ? "positive" : "negative",
          percentage: newCreators >= 0 ? "+0%" : "-0%", // Simplified for now
        },
        {
          title: "Deactive Creators",
          value: deactiveCreators.toString(),
          trend: "negative",
          percentage: "-0%", // Simplified for now
        },
      ],
      leaderboard: {
        today: leaderboardData,
        thisWeek: leaderboardData, // Simplified: Use the same data for all periods
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

export const getUserReport = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get statistics
    const [
      totalUsers,
      verifiedUsers,
      activeVerifiedUsers,
      inactiveVerifiedUsers,
      pendingUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          verified: true,
        },
      }),
      prisma.user.count({
        where: {
          verified: true,
          wallet: {
            transactions: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
              },
            },
          },
        },
      }),
      prisma.user.count({
        where: {
          verified: true,
          wallet: {
            transactions: {
              none: {
                createdAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
              },
            },
          },
        },
      }),
      prisma.user.count({
        where: {
          verified: false,
        },
      }),
    ]);

    // Get paginated user details
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          verified: true,
          wallet: {
            select: {
              transactions: {
                select: {
                  createdAt: true,
                },
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
              },
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.user.count(),
    ]);

    // Format user data with activity status
    const formattedUsers = users.map((user) => ({
      initial: user.name.charAt(0).toUpperCase(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      verificationStatus: user.verified ? "Verified" : "Pending",
      activityStatus:
        user.wallet?.transactions[0]?.createdAt >=
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ? "Active"
          : "Inactive",
    }));

    return res.status(200).json({
      statistics: {
        totalUsers,
        verifiedUsers,
        pendingVerification: pendingUsers,
        activeUsers: activeVerifiedUsers,
        inactiveUsers: inactiveVerifiedUsers,
      },
      users: {
        data: formattedUsers,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user report:", error);
    return res.status(500).json({ message: "Failed to fetch user report" });
  }
};

export const getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.transaction.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          amount: true,
          modeOfPayment: true,
          product: true,
          wallet: {
            select: {
              user: {
                select: {
                  id: true,
                  phone: true,
                  email: true,
                },
              },
            },
          },
          status: true,
        },
      }),
      prisma.transaction.count(),
    ]);

    const formattedPayments = await Promise.all(
      payments.map(async (payment) => {
        let creatorId = null;
        let productId = null;

        if (payment.wallet?.user?.id) {
          const userId = payment.wallet.user.id;

          const webinarTickets = await prisma.webinarTicket.findMany({
            where: {
              boughtById: userId,
              paymentId: payment.id,
            },
            select: {
              webinar: {
                select: {
                  id: true,
                  createdById: true,
                },
              },
            },
          });

          const coursePurchases = await prisma.coursePurchasers.findMany({
            where: {
              purchaserId: userId,
              paymentId: payment.id,
            },
            select: {
              course: {
                select: {
                  id: true,
                  createdBy: true,
                },
              },
            },
          });

          if (webinarTickets.length > 0) {
            creatorId = webinarTickets[0].webinar.createdById;
            productId = webinarTickets[0].webinar.id;
          } else if (coursePurchases.length > 0) {
            creatorId = coursePurchases[0].course.createdBy;
            productId = coursePurchases[0].course.id;
          }
        }

        return {
          AmountPaid: payment.amount,
          PaymentMethod: payment.modeOfPayment,
          CreatorsID: creatorId,
          ProductID: productId,
          ProductType: payment.product,
          UserNumber: payment.wallet?.user?.phone,
          UserEmailID: payment.wallet?.user?.email,
          Status: payment.status,
        };
      })
    );

    return res.status(200).json({
      data: formattedPayments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return res.status(500).json({ message: "Failed to fetch payments" });
  }
};
