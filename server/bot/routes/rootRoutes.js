import express from 'express';
const router = express.Router();

// Root health endpoint
router.get('/', (req, res) => {
  res.send('Telegram Bot Webhook Server is running!');
});

export default router;
