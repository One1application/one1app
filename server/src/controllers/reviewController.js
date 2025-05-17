import prisma from "../db/dbClient.js";
 
 
export const createReview = async (req, res) => {
  try {
    const { userId, username, userimage, rating, review , role } = req.body;

    if (!userId || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: "User ID, rating, and review text are required.",
      });
    }

    const newReview = await prisma.review.create({
      data: {
        userId,
        username,
        userimage,
        rating,
        review,
        role
      },
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully.",
      review: newReview,
    });
  } catch (error) {
    console.error("Error in creating review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

 
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error in fetching reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};

 
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
   
    await prisma.review.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleting review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};
