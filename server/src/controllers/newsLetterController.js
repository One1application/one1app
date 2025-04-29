import prisma from "../db/dbClient.js";

/**
 * Subscribe a user to the newsletter
 * @route POST /api/newsletter/subscribe
 */
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Check if the email already exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      // If already exists but unsubscribed, update to subscribed
      if (!existingSubscription.isSubscribed) {
        const updatedSubscription = await prisma.newsletter.update({
          where: { email },
          data: { isSubscribed: true },
        });

        return res.status(200).json({
          success: true,
          message: "Successfully re-subscribed to the newsletter.",
          subscription: updatedSubscription,
        });
      }

      return res.status(400).json({
        success: false,
        message: "Email is already subscribed to the newsletter.",
      });
    }

    // Create new subscription
    const newSubscription = await prisma.newsletter.create({
      data: {
        email,
        isSubscribed: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Successfully subscribed to the newsletter.",
      subscription: newSubscription,
    });
  } catch (error) {
    console.error("Error in subscribing to newsletter:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

/**
 * Unsubscribe a user from the newsletter
 * @route PUT /api/newsletter/unsubscribe
 */
export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Check if the email exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!existingSubscription) {
      return res.status(404).json({
        success: false,
        message: "Email not found in newsletter subscribers.",
      });
    }

    // If already unsubscribed
    if (!existingSubscription.isSubscribed) {
      return res.status(400).json({
        success: false,
        message: "Email is already unsubscribed from the newsletter.",
      });
    }

    // Update subscription status
    const updatedSubscription = await prisma.newsletter.update({
      where: { email },
      data: { isSubscribed: false },
    });

    return res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from the newsletter.",
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error("Error in unsubscribing from newsletter:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

/**
 * Update newsletter subscription
 * @route PUT /api/newsletter
 */
export const updateNewsletterSubscription = async (req, res) => {
  try {
    const { email, isSubscribed } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (isSubscribed === undefined) {
      return res.status(400).json({
        success: false,
        message: "Subscription status is required.",
      });
    }

    // Check if the email exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!existingSubscription) {
      return res.status(404).json({
        success: false,
        message: "Email not found in newsletter subscribers.",
      });
    }

    // Update subscription
    const updatedSubscription = await prisma.newsletter.update({
      where: { email },
      data: { isSubscribed },
    });

    return res.status(200).json({
      success: true,
      message: ` Successfully ${
        isSubscribed ? "subscribed to" : "unsubscribed from"
      }`,
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error("Error in updating newsletter subscription:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

/**
 * Get a specific newsletter subscription by email
 * @route GET /api/newsletter/:email
 */
export const getNewsletterSubscription = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email parameter is required.",
      });
    }

    const subscription = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Newsletter subscription not found.",
      });
    }

    return res.status(200).json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error("Error in fetching newsletter subscription:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

/**
 * Get all newsletter subscriptions with pagination and filtering
 * @route GET /api/newsletter
 */
export const getAllNewsletterSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 20, subscribed } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    // Build where condition
    const whereCondition = {};
    if (subscribed !== undefined) {
      whereCondition.isSubscribed = subscribed === "true";
    }

    // Get total count for pagination
    const totalCount = await prisma.newsletter.count({
      where: whereCondition,
    });

    // Get subscriptions with pagination
    const subscriptions = await prisma.newsletter.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: "desc",
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    return res.status(200).json({
      success: true,
      subscriptions,
      pagination: {
        total: totalCount,
        page: pageNumber,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error("Error in fetching all newsletter subscriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};
