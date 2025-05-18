import express from 'express';
import axios from 'axios';
import prisma from '../../src/db/dbClient.js';

const router = express.Router();
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

// Alias route: POST /notify to send a direct message (same as /notify-user)
// Root notify route
router.post('/', async (req, res) => {
  const { chatId, text } = req.body;
  if (!chatId || !text) {
    return res.status(400).json({ message: 'chatId and text are required' });
  }
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to send message' });
  }
});

// Send a direct message to a user via Bot API
router.post('/notify-user', async (req, res) => {
  const { chatId, text } = req.body;
  if (!chatId || !text) {
    return res.status(400).json({ message: 'chatId and text are required' });
  }
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Notify users of expiring subscriptions
router.post('/notify-expiring-subscriptions', async (req, res) => {
  const daysBefore = parseInt(req.body.daysBefore, 10) || 3;
  try {
    const subs = await prisma.telegramSubscription.findMany({
      include: { telegram: true },
    });
    const now = new Date();
    let notified = 0;
    for (const sub of subs) {
      const expireDate = new Date(sub.createdAt);
      expireDate.setDate(expireDate.getDate() + sub.validDays);
      const diffDays = Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24));
      if (diffDays <= daysBefore) {
        const text = `Your subscription to "${sub.telegram.title}" expires in ${diffDays} day(s).`;
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: sub.boughtById, text });
        notified++;
      }
    }
    return res.status(200).json({ success: true, notified });
  } catch (error) {
    console.error('Error notifying expiring subs:', error);
    return res.status(500).json({ success: false, message: 'Failed to notify users.' });
  }
});

export default router;
