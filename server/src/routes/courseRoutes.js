import express from "express";
import { createCourse,getCreatorCourses, getCourseById, purchaseCourse, editCourseDetails } from "../controllers/courseController.js";
import { authMiddleware, loggedMiddleware } from "../middlewares/authMiddleware.js";
import { SchemaValidator } from "../utils/validator.js";
import { courseSchema } from "../types/courseValidation.js";

export const courseRouter = express.Router();

courseRouter.get('/get-course-by-id/:courseId',loggedMiddleware,getCourseById)
courseRouter.use(authMiddleware);

courseRouter.post('/create-course', SchemaValidator(courseSchema) ,createCourse);
courseRouter.post('/edit-course/:courseId', editCourseDetails);
courseRouter.get('/get-creator-courses', getCreatorCourses);
courseRouter.post('/purchase-course', purchaseCourse)