import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const token = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${token}`;

const router = express.Router();

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

// New API: kick a user by groupId and userId
router.post('/kick-user', async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    if (!groupId || !userId) {
      return res.status(400).json({ message: 'groupId and userId are required' });
    }
    await axios.post(`${TELEGRAM_API}/kickChatMember`, { chat_id: groupId, user_id: userId });
    await axios.post(`${TELEGRAM_API}/unbanChatMember`, { chat_id: groupId, user_id: userId, only_if_banned: true });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Kick-user error:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to kick the user.' });
  }
});

// Ban a user permanently
router.post('/ban-user', async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    if (!groupId || !userId) {
      return res.status(400).json({ message: 'groupId and userId are required' });
    }
    await axios.post(`${TELEGRAM_API}/kickChatMember`, { chat_id: groupId, user_id: userId });
    // Do not unban, this is a permanent ban
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ban-user error:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to ban the user.' });
  }
});

export default router;
