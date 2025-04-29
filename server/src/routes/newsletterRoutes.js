import express from "express";
import {
  unsubscribeNewsletter,
  updateNewsletterSubscription,
  getNewsletterSubscription,
  getAllNewsletterSubscriptions,
  subscribeNewsletter,
} from "../controllers/newsLetterController.js";

const router = express.Router();

// @route   POST /api/newsletter/subscribe
router.post("/subscribe", subscribeNewsletter);

// @route   PUT /api/newsletter/unsubscribe
router.put("/unsubscribe", unsubscribeNewsletter);

// @route   PUT /api/newsletter
router.put("/", updateNewsletterSubscription);

// @route   GET /api/newsletter/:email
router.get("/:email", getNewsletterSubscription);

// @route   GET /api/newsletter
router.get("/", getAllNewsletterSubscriptions);

export default router;
