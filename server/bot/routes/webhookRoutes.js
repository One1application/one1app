import express from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const ChannelUser = new Map();
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

// Telegram webhook handler
router.post('/', async (req, res) => {
  const update = req.body;
  console.log('Received update:', JSON.stringify(update, null, 2));

  // Handle slash commands early
  const message = update.message;
  if (message && message.text) {
    const command = message.text.split(' ')[0];
    if (command === '/getgroupid') {
      try {
        const chatId = message.chat.id;
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: `This group ID is: ${chatId}` });
      } catch (err) {
        console.error('Error responding to /getgroupid:', err.response?.data || err.message);
      }
      return res.sendStatus(200);
    }
    if (command === '/ping') {
      try {
        const chatId = message.chat.id;
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: 'pong' });
      } catch (err) {
        console.error('Error responding to /ping:', err.response?.data || err.message);
      }
      return res.sendStatus(200);
    }
    if (command === '/setup') {
      try {
        const chatId = message.chat.id;
        // Revoke invite permission from regular members
        await axios.post(`${TELEGRAM_API}/setChatPermissions`, {
          chat_id: chatId,
          permissions: { can_send_messages: true, can_invite_users: false }
        });
        // Confirm setup
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: 'Setup done.' });
      } catch (err) {
        console.error('Error responding to /setup:', err.response?.data || err.message);
      }
      return res.sendStatus(200);
    }
    if (command.startsWith('/myid')) {
      // Split and check for optional username argument
      const parts = message.text.split(' ').filter(Boolean);
      let responseText;
      try {
        if (parts.length > 1) {
          // e.g. /myid @username
          const identifier = parts[1];
          const chatInfo = await axios.get(`${TELEGRAM_API}/getChat`, { params: { chat_id: identifier } });
          const targetId = chatInfo.data.result.id;
          responseText = `User ID for ${identifier} is: ${targetId}`;
        } else {
          // No arg: return caller's ID
          const userId = message.from?.id;
          responseText = `Your Telegram ID is: ${userId}`;
        }
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: message.chat.id, text: responseText });
      } catch (err) {
        console.error('Error responding to /myid:', err.response?.data || err.message);
        // Inform user
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: message.chat.id, text: 'Failed to fetch user ID.' });
      }
      return res.sendStatus(200);
    }
  }

  const chatMemberUpdate = update.chat_member || update.my_chat_member;
  if (!chatMemberUpdate) {
    console.log('No chat_member or my_chat_member field. Skipping.');
    return res.sendStatus(200);
  }

  const { new_chat_member, old_chat_member, invite_link } = chatMemberUpdate;
  if (invite_link &&
      old_chat_member?.status !== 'member' &&
      new_chat_member?.status === 'member') {
    try {
      const userId = ChannelUser.get(invite_link.invite_link);
      console.log('User who joined:', userId);
      if (userId) {
        await prisma.telegramSubscription.update({
          where: { boughtById: userId },
          data: { chatId: new_chat_member.user.id.toString() }
        });
        console.log(`Updated subscription for user ${userId}`);
      }
    } catch (error) {
      console.error('Error processing chat_member update:', error);
    }
  }

  res.sendStatus(200);
});

export default router;
