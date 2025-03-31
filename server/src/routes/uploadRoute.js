import express from 'express';
import {  uploadFiles } from "../config/multer.js";
import { uploadUtil, uploadVideo } from '../controllers/uploadController.js';
export const uploadRouter = express.Router();


// uploadRouter.use(authMiddleware);


uploadRouter.post('/file', uploadFiles, uploadUtil);

uploadRouter.post('/video', uploadVideo);


