import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { json } from "stream/consumers";
import { s3 } from "../config/aws.js";
import { PhonePayClient } from "../config/phonepay.js";
import prisma from "../db/dbClient.js";
dotenv.config();

function extractS3Key(url) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  return decodeURIComponent(pathname.substring(1));
}

const getCourseDuration = (validity) => {
  const startDate = new Date();
  let endDate;
  if (validity === "Monthly") {
    endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
  }
  if (validity === "Half-Yearly") {
    endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 6);
  }
  if (validity === "Yearly") {
    endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  if (validity === "Lifetime") {
    endDate = null;
  }
  return { startDate, endDate };
};

export const createCourse = async (req, res) => {
  try {
    const user = req.user;
    const {
      title,
      price,
      discount,
      validity,
      aboutThisCourse,
      testimonials,
      courseBenefits,
      faQ,
      gallery,
      products,
      language,
      coverImage,
      lessons,
    } = req.body;
    console.log("body", req.body);

    const { startDate, endDate } = getCourseDuration(validity);

    const transactionResult = await prisma.$transaction(async (prisma) => {
      const course = await prisma.course.create({
        data: {
          title,
          price: parseFloat(price),
          discount: discount,
          validity,
          aboutThisCourse,
          testimonials,
          courseBenefits,
          faqs: faQ,
          gallery,
          coverImage,
          language,
          startDate,
          endDate,
          createdBy: user.id,
        },
      });

      if (!course) {
        throw new Error("Failed to create course.");
      }

      const saveCourseProducts = await prisma.courseProduct.createMany({
        data: products.map((product) => ({
          courseId: course.id,
          isActive: product.isActive,
          title: product.title,
          productMetaData: product.productMetaData,
        })),
      });

      if (!saveCourseProducts) {
        throw new Error("Failed to save course products.");
      }

      const saveCourseLessons = await prisma.lessons.create({
        data: {
          isActive: lessons.isActive,
          lessonData: lessons.lessonData,
          courseId: course.id,
        },
      });

      if (!saveCourseLessons) {
        throw new Error("Failed to save course lessons.");
      }

      return { course, saveCourseProducts, saveCourseLessons };
    });

    return res.status(200).json({
      success: true,
      message: "Course created successfully.",
      payload: null,
    });
  } catch (error) {
    console.error("Error in creating course.", error);
    return res.status(500).json({
      success: false,
      message: "Error in creating course.",
    });
  }
};

export const editCourseDetails = async (req, res) => {
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

    const {
      title,
      price,
      validity,
      aboutThisCourse,
      testimonials,
      courseBenefits,
      faQ,
      gallery,
      products,
      language,
      coverImage,
      lessons,
    } = req.body;

    const { courseId } = req.params;

    if (!courseId)
      return res
        .status(400)
        .json({ success: false, message: "Course Id required." });

    const courseExists = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        products: true,
        lessons: true,
      },
    });

    if (!courseExists)
      return res
        .status(400)
        .json({ success: false, message: "Course not found." });
    const updatedData = {};

    if (validity) {
      const { startDate, endDate } = getCourseDuration(validity);
      updatedData.startDate = startDate;
      updatedData.endDate = endDate;
    }

    if (title) updatedData.title = title;
    if (price) updatedData.price = parseFloat(price);
    if (aboutThisCourse) updatedData.aboutThisCourse = aboutThisCourse;
    if (testimonials) updatedData.testimonials = testimonials;
    if (courseBenefits) updatedData.courseBenefits = courseBenefits;
    if (faQ) updatedData.faqs = faQ;
    if (gallery) updatedData.gallery = gallery;
    if (products) updatedData.products = products;
    if (language) updatedData.language = language;
    if (coverImage) updatedData.coverImage = coverImage;
    if (lessons) updatedData.lessons = lessons;
    if (validity) updatedData.validity = validity;

    const course = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        title: updatedData.title ? updatedData.title : courseExists.title,
        price: updatedData.price ? updatedData.price : courseExists.price,
        startDate: updatedData.startDate
          ? updatedData.startDate
          : courseExists.startDate,
        endDate: updatedData.endDate
          ? updatedData.endDate
          : courseExists.endDate,
        aboutThisCourse: updatedData.aboutThisCourse
          ? updatedData.aboutThisCourse
          : courseExists.aboutThisCourse,
        testimonials: updatedData.testimonials
          ? updatedData.testimonials
          : courseExists.testimonials,
        courseBenefits: updatedData.courseBenefits
          ? updatedData.courseBenefits
          : courseExists.courseBenefits,
        coverImage: updatedData.coverImage
          ? updatedData.coverImage
          : courseExists.coverImage,
        language: updatedData.language
          ? updatedData.language
          : courseExists.language,
        gallery: updatedData.gallery
          ? updatedData.gallery
          : courseExists.gallery,
        validity: updatedData.validity
          ? updatedData.validity
          : courseExists.validity,
        faqs: updatedData.faqs ? updatedData.faqs : courseExists.faqs,
      },
    });

    if (!course)
      return res
        .status(400)
        .json({ success: false, message: "Failed to update course." });

    if (products) {
      console.log("products", products);

      const saveCourseProducts = await prisma.courseProduct.updateMany({
        where: { courseId: courseExists.id },
        data: {
          isActive: updatedData.products.isActive
            ? updatedData.products.isActive
            : courseExists.products.isActive,
          title: updatedData.products.title
            ? updatedData.products.title
            : courseExists.products.title,
          productMetaData: updatedData.products.productMetaData
            ? updatedData.products.productMetaData
            : courseExists.products.productMetaData,
        },
      });

      console.log("saveCourseProducts", saveCourseProducts);

      if (!saveCourseProducts)
        return res.status(400).json({
          success: false,
          message: "Failed to update course products.",
        });
    }

    if (lessons) {
      const saveCourseLessons = await prisma.lessons.updateMany({
        where: {
          courseId: courseExists.id,
        },
        data: {
          isActive: updatedData.lessons.isActive
            ? updatedData.lessons.isActive
            : courseExists.lessons.isActive,
          lessonData: updatedData.lessons.lessonData
            ? updatedData.lessons.lessonData
            : courseExists.lessons.lessonData,
        },
      });

      if (!saveCourseLessons)
        return res.status(400).json({
          success: false,
          message: "Failed to update course lessons.",
        });
    }

    const fetchedCourse = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        products: true,
        lessons: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      payload: {
        course: fetchedCourse,
      },
    });
  } catch (error) {
    console.error("Error in editing course details.", error);
    return res.status(500).json({
      success: false,
      message: "Error in editing course details.",
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const user = req.user;
    
    if (user.role !== "Creator") {
      return res.status(400).json({
        success: false,
        message: "Unauthorized Request",
      });
    }

    const course = await prisma.course.findMany({
      where: {
        createdBy: user.id,
      },
      include: {
        purchasedBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "No courses found",
      });
    }

    return res.status(200).json({
      success: true,
      payload: {
        courses: course,
      },
    });
  } catch (error) {
    console.error("Error in getting creator courses.", error);
    return res.status(500).json({
      success: false,
      message: "Error in getting creator courses.",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = req.user;
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        products: true,
        lessons: true,
        purchasedBy: user
          ? {
              where: {
                purchaserId: user.id,
              },
            }
          : false,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "No course found",
      });
    }

    const sendFiles =
      user && (course.createdBy === user.id || course.purchasedBy.length > 0);

    return res.status(200).json({
      success: true,
      payload: {
        course: {
          ...course,
          ...(sendFiles
            ? {
                products: course.products,
                lessons: course.lessons,
              }
            : {
                products: null,
                lessons: null,
              }),
        },
      },
    });
  } catch {
    console.error("Error in getting course by id.", error);
    return res.status(500).json({
      success: false,
      message: "Error in getting course by id.",
    });
  }
};

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = req.user;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course Id is not given.",
      });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        products: true,
        lessons: true,
        purchasedBy: user
          ? {
              where: {
                purchaserId: user.id,
              },
            }
          : false,
        creator: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "No course found",
      });
    }

    if (course.purchasedBy.length > 0) {
      return res.status(403).json({
        success: false,
        message: "You have already purchased the course.",
      });
    }

    if (course.createdBy === user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot purchase your own course.",
      });
    }

   
    

    // const options = {
    //   amount: course.price * 100,
    //   currency: "INR",
    //   payment_capture: 1,
    // };
    const orderId = randomUUID();
    // const order = await razorpay.orders.create(options);
   
    let totalAmount = course.price;
    
    

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(orderId)
      .amount(totalAmount * 100)
      .redirectUrl(
        `${process.env.FRONTEND_URL}payment/verify?merchantOrderId=${orderId}&courseId=${courseId}`
      )
      .build();

    const response = await PhonePayClient.pay(request);
    return res.status(200).json({
      success: true,
      payload: {
        redirectUrl: response.redirectUrl,
      },
    });
  } catch (error) {
    console.error("Error in purchasing course.", error);
    return res.status(500).json({
      success: false,
      message: "Error in purchasing course.",
    });
  }
};

export const playVideo = async (req, res) => {
  try {
    const { url } = req.query;

    const key = extractS3Key(url);
    console.log(key, "key");

    if (!key)
      return (
        res.status(400),
        json({
          success: false,
          message: "Invalid url.",
        })
      );

    const command = new GetObjectCommand({
      Bucket: "my-app-bucket-1743423461630",
      Key: key,
    });
    console.log(command, "co");
    console.log(s3, "s3");

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 5 });
    console.log(signedUrl);
    return res.status(200).json({
      success: true,
      signedUrl,
    });
  } catch (error) {
    console.error("Error in generating url.", error);
    res.status(500).json({
      success: false,
      message: "Error in generating url.",
    });
  }
};
