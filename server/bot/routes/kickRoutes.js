import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const token = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${token}`;

const router = express.Router();

// Kick and unban member
router.post('/kick', async (req, res) => {
  try {
    const { chat_id: chatId, user_id: userId } = req.body;
    await axios.post(`${TELEGRAM_API}/kickChatMember`, { chat_id: chatId, user_id: userId });
    await axios.post(`${TELEGRAM_API}/unbanChatMember`, { chat_id: chatId, user_id: userId, only_if_banned: true });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: 'Failed to kick/unban member.' });
  }
});

export default router;
