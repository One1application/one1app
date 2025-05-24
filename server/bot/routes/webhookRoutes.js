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
  if (update.my_chat_member) {
    console.log('my_chat_member event payload:', JSON.stringify(update.my_chat_member, null, 2));
  }

  // Handle bot being added via service message new_chat_members
  if (update.message?.new_chat_members) {
    const botJoined = update.message.new_chat_members.some(m => m.is_bot);
    if (botJoined) {
      const adminId = update.message.from.id;
      const chat = update.message.chat;
      const details = `Bot was added to group:\nName: ${chat.title || 'N/A'}\nID: ${chat.id}\nType: ${chat.type}\nI don't have admin permissions yet, please grant them.\nThis group is not registered on one1app yet. Please register here: https://example.com/form.html?chatid=${chat.id}`;
      try {
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: adminId, text: details });
        console.log(`Sent service-message DM to user ${adminId} for group ${chat.id}`);
      } catch (err) {
        console.error(`Failed to send service-message DM to ${adminId}:`, err.response?.data || err.message);
      }
    }
  }

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
    if (command === '/start') {
      const chatId = message.chat.id;
      const chatType = message.chat.type;
      if (chatType !== 'private') {
        // Group chat: prompt registration and /setup
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: `Please register this group on https://example.com/form.html?chatid=${chatId} and run the /setup command` });
      } else {
        // Private chat: welcome user
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: 'Hey, welcome to one1app bot! Please add the bot in your group and run the /start command again.' });
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

  // Notify user when bot is added to a group with details
  if (update.my_chat_member) {
    const { chat, new_chat_member, from } = update.my_chat_member;
    if (new_chat_member.user.is_bot && new_chat_member.status === 'member') {
      const details = `Bot was added to group:\nName: ${chat.title || 'N/A'}\nID: ${chat.id}\nType: ${chat.type}\nI don't have admin permissions yet, please grant them.\nThis group is not registered on one1app yet. Please register here: https://example.com/form.html?chatid=${chat.id}`;
      try {
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: from.id, text: details });
        console.log(`Sent group addition DM to user ${from.id} for group ${chat.id}`);
      } catch (err) {
        console.error(`Failed to send group addition DM to ${from.id}:`, err.response?.data || err.message);
      }
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
