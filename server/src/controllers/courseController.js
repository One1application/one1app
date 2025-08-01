import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import { StandardCheckoutPayRequest } from 'pg-sdk-node';
import { json } from 'stream/consumers';
import { s3 } from '../config/aws.js';
import { PhonePayClient } from '../config/phonepay.js';
import { razorpay } from '../config/razorpay.js';
import prisma from '../db/dbClient.js';
dotenv.config();

function extractS3Key(url) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  return decodeURIComponent(pathname.substring(1));
}

const getCourseDuration = (validity) => {
  const startDate = new Date();
  let endDate;
  if (validity === 'Monthly') {
    endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
  }
  if (validity === 'Half-Yearly') {
    endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 6);
  }
  if (validity === 'Yearly') {
    endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  if (validity === 'Lifetime') {
    endDate = null;
  }
  return { startDate, endDate };
};

export const createCourse = async (req, res) => {
  try {
    const user = req.user;
    const { title, price, discount, validity, aboutThisCourse, testimonials, courseBenefits, faQ, gallery, products, language, coverImage, lessons } =
      req.body;
    console.log('body', req.body);

    const { startDate, endDate } = getCourseDuration(validity);

    if (discount) {
      if (!Array.isArray(discount)) {
        return res.status(400).json({
          success: false,
          message: 'Discount must be an array of objects.',
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
          (isNaN(parseFloat(d.percent)) || parseFloat(d.percent) < 1 || parseFloat(d.percent) > 100)
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
        throw new Error('Failed to create course.');
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
        throw new Error('Failed to save course products.');
      }

      const saveCourseLessons = await prisma.lessons.create({
        data: {
          isActive: lessons.isActive,
          lessonData: lessons.lessonData,
          courseId: course.id,
        },
      });

      console.log('discount', course.discount);

      if (!saveCourseLessons) {
        throw new Error('Failed to save course lessons.');
      }

      return { course, saveCourseProducts, saveCourseLessons };
    });

    return res.status(200).json({
      success: true,
      message: 'Course created successfully.',
      payload: null,
    });
  } catch (error) {
    console.error('Error in creating course.', error);
    return res.status(500).json({
      success: false,
      message: error.message,
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
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    const { title, price, validity, aboutThisCourse, testimonials, courseBenefits, faQ, gallery, products, language, coverImage, lessons, discount } =
      req.body;

    const { courseId } = req.params;

    if (!courseId) return res.status(400).json({ success: false, message: 'Course Id required.' });

    const courseExists = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        products: true,
        lessons: true,
      },
    });

    if (!courseExists) return res.status(400).json({ success: false, message: 'Course not found.' });
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
    if (discount) updatedData.discount = discount;

    if (discount) {
      if (!Array.isArray(discount)) {
        return res.status(400).json({
          success: false,
          message: 'Discount must be an array of objects.',
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
          (isNaN(parseFloat(d.percent)) || parseFloat(d.percent) < 1 || parseFloat(d.percent) > 100)
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

    const course = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        title: updatedData.title ? updatedData.title : courseExists.title,
        price: updatedData.price ? updatedData.price : courseExists.price,
        startDate: updatedData.startDate ? updatedData.startDate : courseExists.startDate,
        endDate: updatedData.endDate ? updatedData.endDate : courseExists.endDate,
        aboutThisCourse: updatedData.aboutThisCourse ? updatedData.aboutThisCourse : courseExists.aboutThisCourse,
        testimonials: updatedData.testimonials ? updatedData.testimonials : courseExists.testimonials,
        courseBenefits: updatedData.courseBenefits ? updatedData.courseBenefits : courseExists.courseBenefits,
        coverImage: updatedData.coverImage ? updatedData.coverImage : courseExists.coverImage,
        language: updatedData.language ? updatedData.language : courseExists.language,
        gallery: updatedData.gallery ? updatedData.gallery : courseExists.gallery,
        validity: updatedData.validity ? updatedData.validity : courseExists.validity,
        faqs: updatedData.faqs ? updatedData.faqs : courseExists.faqs,
        discount: updatedData.discount ? updatedData.discount : courseExists.discount,
      },
    });

    if (!course) return res.status(400).json({ success: false, message: 'Failed to update course.' });

    if (products) {
      console.log('products', products);

      const saveCourseProducts = await prisma.courseProduct.updateMany({
        where: { courseId: courseExists.id },
        data: {
          isActive: updatedData.products.isActive ? updatedData.products.isActive : courseExists.products.isActive,
          title: updatedData.products.title ? updatedData.products.title : courseExists.products.title,
          productMetaData: updatedData.products.productMetaData ? updatedData.products.productMetaData : courseExists.products.productMetaData,
        },
      });

      console.log('saveCourseProducts', saveCourseProducts);
      console.log('discount', course.discount?.code);

      if (!saveCourseProducts)
        return res.status(400).json({
          success: false,
          message: 'Failed to update course products.',
        });
    }

    if (lessons) {
      const saveCourseLessons = await prisma.lessons.updateMany({
        where: {
          courseId: courseExists.id,
        },
        data: {
          isActive: updatedData.lessons.isActive ? updatedData.lessons.isActive : courseExists.lessons.isActive,
          lessonData: updatedData.lessons.lessonData ? updatedData.lessons.lessonData : courseExists.lessons.lessonData,
        },
      });

      if (!saveCourseLessons)
        return res.status(400).json({
          success: false,
          message: 'Failed to update course lessons.',
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
      message: 'Course updated successfully.',
      payload: {
        course: fetchedCourse,
      },
    });
  } catch (error) {
    console.error('Error in editing course details.', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'Creator') {
      return res.status(400).json({
        success: false,
        message: 'Unauthorized Request',
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
        createdAt: 'desc',
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'No courses found',
      });
    }

    return res.status(200).json({
      success: true,
      payload: {
        courses: course,
      },
    });
  } catch (error) {
    console.error('Error in getting creator courses.', error);
    return res.status(500).json({
      success: false,
      message: 'Error in getting creator courses.',
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
        creator: {
          select: {
            name: true,
            userImage: true,
          },
        },
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
        message: 'No course found',
      });
    }

    const sendFiles = user && (course.createdBy === user.id || course.purchasedBy.length > 0);

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
  } catch (error) {
    console.error('Error in getting course by id.', error);
    return res.status(500).json({
      success: false,
      message: 'Error in getting course by id.',
    });
  }
};

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId, couponCode, validateOnly } = req.body;
    const user = req.user;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course Id is not given.',
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
        message: 'No course found',
      });
    }

    console.log('course', course);

    const existingPurchase = await prisma.coursePurchasers.findFirst({
      where: {
        purchaserId: user.id,
        courseId,
        isActive: true,
        expiryDate: { gt: new Date() },
      },
    });

    console.log('existingPurchase courseController', existingPurchase);

    if (!validateOnly) {
      if (existingPurchase) {
        return res.status(400).json({
          success: false,
          message: 'You already have an active subscription for this course',
        });
      }

      if (course.createdBy === user.id) {
        return res.status(400).json({
          success: false,
          message: 'You cannot purchase your own course.',
        });
      }
    }

    let discountData = course?.discount || null;
    console.log('discountData', discountData);
    let discountPrice = 0;
    if (couponCode && discountData && discountData.length > 0) {
      const matchingDiscount = discountData.find((discount) => discount.code === couponCode);
      if (!matchingDiscount) {
        return res.status(400).json({
          success: false,
          message: 'Invalid discount code.',
        });
      }

      const expiryDate = new Date(matchingDiscount.expiry);
      const currentDate = new Date();
      if (currentDate > expiryDate) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code has expired.',
        });
      }
      discountPrice = parseInt(course.price * (Number(matchingDiscount.percent) / 100).toFixed(2));
    }
    let totalAmount = Math.round(course.price - discountPrice);
    if (totalAmount < 0) totalAmount = 0;
    console.log('totalAmount', totalAmount);
    console.log('discountPrice', discountPrice);
    if (validateOnly) {
      return res.status(200).json({
        success: true,
        payload: {
          totalAmount,
          discountPrice,
          originalPrice: course.price,
        },
      });
    }

    if (course.createdBy.paymentProvider === 'PhonePay') {
      const orderId = randomUUID();
      console.log('orderId', orderId);
      const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(orderId)
        .amount(totalAmount * 100)
        .redirectUrl(`${process.env.FRONTEND_URL}payment/verify?merchantOrderId=${orderId}&courseId=${course.id}&discountedPrice=${totalAmount}`)
        .build();

      const response = await PhonePayClient.pay(request);

      return res.status(200).json({
        success: true,
        payload: {
          redirectUrl: response.redirectUrl,
          paymentProvider: 'PhonePay',
          course: course.id,
          totalAmount,
          discountPrice,
        },
      });
    } else if (content.createdBy.paymentProvider === 'Razorpay') {
      console.log('INSISE razorPay', process.env.RAZORPAY_KEY_ID);

      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: 'INR',

        notes: {
          course: courseId,
          userId: user.id,
          discountedPrice: totalAmount,
        },
      });

      console.log('Razorpay order created', razorpayOrder);

      return res.status(200).json({
        success: true,
        payload: {
          razorpayOrderId: razorpayOrder.id,
          redirectUrl: `${process.env.FRONTEND_URL}payment/verify`,
          amount: totalAmount * 100, // Amount in paise for frontend
          currency: 'INR',
          paymentProvider: 'Razorpay',
          courseId: course.id,
          totalAmount,
          discountPrice,
          key: process.env.RAZORPAY_KEY_ID,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment provider.',
      });
    }
  } catch (error) {
    console.error('Error in purchasing course.', error);
    return res.status(500).json({
      success: false,
      message: 'Error in purchasing course.',
    });
  }
};

//TODO:inActive course or expired subscription of coursePurchasers need to track and monitor by cronjob or something.
export const renewalCourse = async (req, res) => {
  try {
    const { courseId, couponCode, validateOnly } = req.body;
    const { purchaseId } = req.params;
    const user = req.user;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course Id is not given.',
      });
    }

    if (!purchaseId) {
      return res.status(400).json({
        success: false,
        message: 'No Purchase Found',
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
        message: 'No course found',
      });
    }

    console.log('course', course);

    const existingPurchase = await prisma.coursePurchasers.findFirst({
      where: {
        purchaserId: user.id,
        courseId,
        id: purchaseId,
      },
    });

    if (!existingPurchase) {
      return res.status(400).json({
        success: false,
        message: 'No Previous Purchase Found',
      });
    }

    console.log('existingPurchase courseController', existingPurchase);

    if (!validateOnly) {
      if (course.createdBy === user.id) {
        return res.status(400).json({
          success: false,
          message: 'You cannot purchase your own course.',
        });
      }
    }

    let discountData = course?.discount || null;
    console.log('discountData', discountData);
    let discountPrice = 0;
    if (couponCode && discountData && discountData.length > 0) {
      const matchingDiscount = discountData.find((discount) => discount.code === couponCode);
      if (!matchingDiscount) {
        return res.status(400).json({
          success: false,
          message: 'Invalid discount code.',
        });
      }

      const expiryDate = new Date(matchingDiscount.expiry);
      const currentDate = new Date();
      if (currentDate > expiryDate) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code has expired.',
        });
      }
      discountPrice = parseInt(course.price * (Number(matchingDiscount.percent) / 100).toFixed(2));
    }
    let totalAmount = Math.round(course.price - discountPrice);
    if (totalAmount < 0) totalAmount = 0;
    console.log('totalAmount', totalAmount);
    console.log('discountPrice', discountPrice);
    if (validateOnly) {
      return res.status(200).json({
        success: true,
        payload: {
          totalAmount,
          discountPrice,
          originalPrice: course.price,
        },
      });
    }

    const orderId = randomUUID();

    console.log('orderId', orderId);

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(orderId)
      .amount(totalAmount * 100)
      .redirectUrl(`${process.env.FRONTEND_URL}payment/verify?merchantOrderId=${orderId}&courseId=${courseId}&discountedPrice=${totalAmount}`)
      .build();

    const response = await PhonePayClient.pay(request);

    return res.status(200).json({
      success: true,
      payload: {
        redirectUrl: response.redirectUrl,
        totalAmount,
        discountPrice,
      },
    });
  } catch (error) {
    console.error('Error in purchasing course.', error);
    return res.status(500).json({
      success: false,
      message: 'Error in purchasing course.',
    });
  }
};

export const playVideo = async (req, res) => {
  try {
    const { url } = req.query;

    const key = extractS3Key(url);
    console.log(key, 'key');

    if (!key)
      return (
        res.status(400),
        json({
          success: false,
          message: 'Invalid url.',
        })
      );

    const command = new GetObjectCommand({
      Bucket: 'my-app-bucket-1743423461630',
      Key: key,
    });
    console.log(command, 'co');
    console.log(s3, 's3');

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 5 });
    console.log(signedUrl);
    return res.status(200).json({
      success: true,
      signedUrl,
    });
  } catch (error) {
    console.error('Error in generating url.', error);
    res.status(500).json({
      success: false,
      message: 'Error in generating url.',
    });
  }
};
