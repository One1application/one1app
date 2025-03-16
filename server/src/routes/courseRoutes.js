import express from "express";
import { createCourse,getCreatorCourses, getCourseById, purchaseCourse, editCourseDetails } from "../controllers/courseController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const courseRouter = express.Router();


courseRouter.post('/create-course', 
    authMiddleware,            
    createCourse            
);


courseRouter.post('/edit-course/:courseId',authMiddleware,editCourseDetails);

courseRouter.get('/get-creator-courses',authMiddleware,getCreatorCourses);
courseRouter.get('/get-course-by-id/:courseId',getCourseById)

courseRouter.post('/purchase-course',authMiddleware,purchaseCourse)