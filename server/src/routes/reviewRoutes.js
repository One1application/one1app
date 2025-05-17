import express from "express"
import { createReview , deleteReview , getAllReviews } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/write", createReview);
router.delete("/delete/:id", deleteReview);
router.get("/allreviews", getAllReviews);

export default router;