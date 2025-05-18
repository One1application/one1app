import express from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const ChannelUser = new Map();

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
        await axios.post(`${process.env.TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: `This group ID is: ${chatId}` });
      } catch (err) {
        console.error('Error responding to /getgroupid:', err.response?.data || err.message);
      }
      return res.sendStatus(200);
    }
    if (command === '/ping') {
      try {
        const chatId = message.chat.id;
        await axios.post(`${process.env.TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: 'pong' });
      } catch (err) {
        console.error('Error responding to /ping:', err.response?.data || err.message);
      }
      return res.sendStatus(200);
    }
    if (command === '/setup') {
      try {
        const chatId = message.chat.id;
        // Revoke invite permission from regular members
        await axios.post(`${process.env.TELEGRAM_API}/setChatPermissions`, {
          chat_id: chatId,
          permissions: { can_send_messages: true, can_invite_users: false }
        });
        // Confirm setup
        await axios.post(`${process.env.TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: 'Setup done.' });
      } catch (err) {
        console.error('Error responding to /setup:', err.response?.data || err.message);
      }
      return res.sendStatus(200);
    }
    if (command === '/myid') {
      try {
        const chatId = message.chat.id;
        const userId = message.from?.id;
        await axios.post(`${process.env.TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: `Your Telegram ID is: ${userId}` });
      } catch (err) {
        console.error('Error responding to /myid:', err.response?.data || err.message);
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
