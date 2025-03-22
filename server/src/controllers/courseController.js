import prisma from "../db/dbClient.js";
import { imagekit } from "../config/imagekit.js";
import multer from "multer";
import { razorpay } from "../config/razorpay.js";




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
}


export const createCourse = async (req, res) => {
    try {
        const user = req.user;
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


        const { startDate, endDate } = getCourseDuration(validity);

        const course = await prisma.course.create({
            data:{
                title,
                price:parseFloat(price),
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
                createdBy: user.id
            }
        })

        if(!course){
            return res.status(400).json({
                success: false,
                message: "Failed to create course."
            })
        }

        const saveCourseProducts = await prisma.courseProduct.createMany({
            data: {
                courseId: course.id,
                isActive: products.isActive,
                title: products.title,
                productMetaData: products.productMetaData
            }
        })

        if(!saveCourseProducts){
            return res.status(400).json({
                success: false,
                message: "Failed to save course products."
            })
        }

        const saveCourseLessons = await prisma.lessons.create({
            data:{
                isActive: lessons.isActive,
                lessonData: lessons.lessonData,
                courseId: course.id
            }
            })

        if(!saveCourseLessons){
            return res.status(400).json({
                success: false,
                message: "Failed to save course lessons."
            })
        }


        const fetchedCourse = await prisma.course.findUnique({
            where: {
                id: course.id
            },
            include:{
                products: true,
                lessons: true
            }
        })

        return res.status(200).json({
            success: true,
            message: "Course created successfully.",
            payload: {
                course:fetchedCourse,
            }
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
                id: user.id
            }
        })

        if (!userExists) {
            return res.status(400).json({ success: false, message: "User not found." })
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

        

        if(!courseId) return res.status(400).json({ success: false, message: "Course Id required." })

        const courseExists = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            include:{
                products: true,
                lessons: true
            }
        })


        if (!courseExists)return  res.status(400).json({ success: false, message: "Course not found." })
        const updatedData = {}

        if(validity){
            const { startDate, endDate } = getCourseDuration(validity);
            updatedData.startDate = startDate;
            updatedData.endDate = endDate;
        }

        if(title) updatedData.title = title;
        if(price) updatedData.price = parseFloat(price);
        if(aboutThisCourse) updatedData.aboutThisCourse = aboutThisCourse;
        if(testimonials) updatedData.testimonials = testimonials;
        if(courseBenefits) updatedData.courseBenefits = courseBenefits;
        if(faQ) updatedData.faqs = faQ;
        if(gallery) updatedData.gallery = gallery;
        if(products) updatedData.products = products;
        if(language) updatedData.language = language;
        if(coverImage) updatedData.coverImage = coverImage;
        if(lessons) updatedData.lessons = lessons;
        if(validity) updatedData.validity = validity;


        const course = await prisma.course.update({
            where: {
                id: courseId
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
                faqs: updatedData.faqs ? updatedData.faqs : courseExists.faqs
            }
        })



        if(!course)return res.status(400).json({ success: false, message: "Failed to update course." })

        if(products){
            console.log("products",products);
            

            const saveCourseProducts = await prisma.courseProduct.updateMany({
                where: { courseId: courseExists.id },
                data: {
                    isActive: updatedData.products.isActive ? updatedData.products.isActive : courseExists.products.isActive,
                    title: updatedData.products.title ? updatedData.products.title : courseExists.products.title,
                    productMetaData: updatedData.products.productMetaData ? updatedData.products.productMetaData : courseExists.products.productMetaData
                }
            });
            
            
            console.log("saveCourseProducts",saveCourseProducts);
            
            if(!saveCourseProducts) return res.status(400).json({ success: false, message: "Failed to update course products." })
            }
                
        if(lessons){

            
            const saveCourseLessons = await prisma.lessons.updateMany({
                where: {
                    courseId: courseExists.id
                },
                data: {
                    isActive: updatedData.lessons.isActive ? updatedData.lessons.isActive : courseExists.lessons.isActive,
                    lessonData: updatedData.lessons.lessonData ? updatedData.lessons.lessonData : courseExists.lessons.lessonData
                }
            })
            
            if(!saveCourseLessons) return res.status(400).json({ success: false, message: "Failed to update course lessons." })
            }

        const fetchedCourse = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            include:{
                products: true,
                lessons: true
            }
        })

        return res.status(200).json({
            success: true,
            message: "Course updated successfully.",
            payload: {
                course:fetchedCourse,
            }
        });


    } catch (error) {
        console.error("Error in editing course details.", error);
        return res.status(500).json({
            success: false,
            message: "Error in editing course details.",
        });
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const user = req.user

        if (user.role !== 'Creator') {
            return res.status(400)
                .json({
                    success: false,
                    message: "Unauthorized Request"
                })
        }

        const course = await prisma.course.findMany({
            where: {
                createdBy: user.id
            },
            include: {
                purchasedBy: true
            }
        })

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "No courses found"
            })
        }

        return res.status(200).json({
            success: true,
            payload: {
                courses: course
            }
        })

    } catch (error) {
        console.error("Error in getting creator courses.", error);
        return res.status(500).json({
            success: false,
            message: "Error in getting creator courses.",
        });
    }
}


export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const user = req.user;
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            include:{
                products: true,
                lessons: true,
                purchasedBy: user ? {
                    where: {
                        purchaserId: user.id
                    }
                }: false
            }
        })

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "No course found"
            })
        }

        const sendFiles = user && (course.createdBy === user.id || course.purchasedBy.length > 0);

        return res.status(200).json({
            success: true,
            payload: {
                course: {
                    ...course,
                    ...(sendFiles ? {
                        products: course.products,
                        lessons: course.lessons
                    } : {
                        products: null,
                        lessons: null
                    })
                }
            }
        })

    } catch {
        console.error("Error in getting course by id.", error);
        return res.status(500).json({
            success: false,
            message: "Error in getting course by id.",
        });
    }
}

export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const user = req.user;


        if(!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course Id is not given."
            })
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            },
            include:{
                products: true,
                lessons: true,
                purchasedBy: user ? {
                    where: {
                        purchaserId: user.id
                    }
                }: false
            }
        })

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "No course found"
            })
        }

        if(course.purchasedBy.length > 0) {
            return res.status(403).json({
                success: false,
                message: "You have already purchased the course."
            })
        }

        if (course.createdBy === user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot purchase your own course."
            })
        }

        const options = {
            amount: course.price * 100,
            currency: "INR",
            payment_capture: 1,
        }

        const order = await razorpay.orders.create(options);
        return res.status(200).json({
            success: true,
            payload: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                courseId: course.id
            }
        })

    } catch (error) {
        console.error("Error in purchasing course.", error);
        return res.status(500).json({
            success: false,
            message: "Error in purchasing course.",
        });

    }

}