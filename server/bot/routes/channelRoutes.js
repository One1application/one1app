// Replace empty file with channel-related routes
import express from 'express';
import axios from 'axios';
import { getChannelId, createInviteLink } from '../bot.js';

// Base Telegram Bot API URL
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

const router = express.Router();

// Kick and immediately unban for membership reset
router.post('/kick', async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    await axios.post(`${TELEGRAM_API}/kickChatMember`, { chat_id: chatId, user_id: userId });
    await axios.post(`${TELEGRAM_API}/unbanChatMember`, { chat_id: chatId, user_id: userId, only_if_banned: true });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: 'Failed to kick/unban member.' });
  }
});

// Verify invite link and fetch channel info
router.post('/verify-channel', async (req, res) => {
  const { inviteLink } = req.body;
  if (!inviteLink) {
    return res.status(400).json({ message: 'inviteLink is required' });
  }
  try {
    const info = await getChannelId(inviteLink);
    res.status(200).json({ success: true, payload: info });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify channel.' });
  }
});

// Generate one-time invite link for payment flow
router.get('/generate-invite', async (req, res) => {
  try {
    const { channelId, group, boughtById } = req.query;
    const chatId = channelId || group;
    if (!chatId || !boughtById) {
      return res.status(400).json({ message: 'channelId (or group) and boughtById are required' });
    }
    // Ensure bot is member of the group
    const meRes = await axios.get(`${TELEGRAM_API_URL}/getMe`);
    const botId = meRes.data.result.id;
    const memberRes = await axios.get(`${TELEGRAM_API}/getChatMember`, {
      params: { chat_id: chatId, user_id: botId },
    });
    const status = memberRes.data.result.status;
    if (!['creator', 'administrator', 'member'].includes(status)) {
      return res.status(400).json({ message: 'Bot is not a member of the specified group.' });
    }
    const link = await createInviteLink(chatId);
    res.status(200).json({ success: true, payload: { inviteLink: link } });
  } catch (error) {
    console.error('Invite link generation error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch invite link.' });
  }
});

// DM a user via the bot using groupId, username, and message
router.post('/dm', async (req, res) => {
  const { groupId, username, message } = req.body;
  if (!groupId || !username || !message) {
    return res.status(400).json({ message: 'groupId, username and message are required' });
  }
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: username,
      text: message,
    });
    res.status(200).json({ success: true, message: 'Message sent.' });
  } catch (error) {
    console.error('DM error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to send DM.' });
  }
});

// Get user IDs of group administrators
router.post('/group-members', async (req, res) => {
  const { groupId } = req.body;
  if (!groupId) {
    return res.status(400).json({ message: 'groupId is required' });
  }
  try {
    console.log('Fetching group administrators for groupId:', groupId);
    const resp = await axios.get(`${TELEGRAM_API}/getChatAdministrators`, {
      params: { chat_id: groupId }
    });
    const userIds = resp.data.result.map(member => member.user.id);
    return res.status(200).json({ userIds });
  } catch (error) {
    console.error('Error fetching group members:', error.response?.data || error.message);
    return res.status(500).json({
      message: 'Failed to fetch group members.',
      detail: error.response?.data || error.message
    });
  }
});

export default router;