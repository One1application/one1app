import express from "express";
import { createCourse,getCreatorCourses, getCourseById, purchaseCourse, editCourseDetails } from "../controllers/courseController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const courseRouter = express.Router();

courseRouter.use(authMiddleware);

courseRouter.post('/create-course', createCourse);
courseRouter.post('/edit-course/:courseId', editCourseDetails);
courseRouter.get('/get-creator-courses', getCreatorCourses);
courseRouter.get('/get-course-by-id/:courseId',getCourseById)
courseRouter.post('/purchase-course', purchaseCourse)