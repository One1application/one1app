import express from 'express';
import { createInviteLink } from '../bot.js';
//import ChannelUser from '../channelUserMap.js';
const router = express.Router();

// Root health endpoint
router.get('/', (req, res) => {
  res.send('Telegram Bot Webhook Server is running!');
});

// Endpoint to generate a private invite link
router.post('/invite-link', async (req, res) => {
  const { chat_id } = req.body;
  if (!chat_id) {
    return res.status(400).json({ message: 'chat_id is required' });
  }
  try {
    const inviteLink = await createInviteLink(chat_id);
    return res.status(200).json({ inviteLink });
  } catch (err) {
    console.error('Invite-link generation error:', err.response?.data || err.message);
    return res.status(500).json({ message: 'Failed to generate invite link.' });
  }
});

export default router;
