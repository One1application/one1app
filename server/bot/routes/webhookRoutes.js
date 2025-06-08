import express from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { createInviteLink } from '../bot.js';

const router = express.Router();
const prisma = new PrismaClient();
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
      const details = `hey creators ${update.message.from.first_name}, setup your premium group click on the link fill all the necessary data\n\nLink :- https://one1app.com/app/create-telegram?chatid=${chat.id}`;
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
    // disable commands in DMs and restrict to group owner
    if (message.chat.type === 'private') {
      return res.sendStatus(200);
    }
    const chatId = message.chat.id;
    const userId = message.from.id;
    let isOwner = false;
    try {
      const memberRes = await axios.get(`${TELEGRAM_API}/getChatMember`, { params: { chat_id: chatId, user_id: userId } });
      if (memberRes.data.result.status === 'creator') isOwner = true;
    } catch (err) {
      console.error('Failed to fetch chat member status:', err.response?.data || err.message);
    }
    if (!isOwner) {
      await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: userId, text: 'Only the group owner can run commands.' });
      return res.sendStatus(200);
    }
    const command = message.text.split(' ')[0];
    const baseCmd = command.split('@')[0];
    if (baseCmd === '/invite') {
      const chatId = message.chat.id;
      const userId = message.from.id;
      try {
        const link = await createInviteLink(chatId);
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: userId, text: `Your private invite link: ${link}` });
      } catch (err) {
        console.error('Error generating invite link:', err.response?.data || err.message);
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: userId, text: 'Failed to generate invite link.' });
      }
      return res.sendStatus(200);
    }
    if (baseCmd === '/getgroupid') {
      try {
        const chatId = message.chat.id;
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: `This group ID is: ${chatId}` });
      } catch (err) {
        console.error('Error responding to /getgroupid:', err.response?.data || err.message);
      }
      return res.sendStatus(200);
    }
    if (baseCmd === '/ping') {
      try {
        const chatId = message.chat.id;
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: 'pong' });
      } catch (err) {
        console.error('Error responding to /ping:', err.response?.data || err.message);
      }
      return res.sendStatus(200);
    }
    if (baseCmd === '/setup') {
      const chatId = message.chat.id;
      const userId = message.from.id;
      try {
        console.log(`[DEBUG] /setup command received for chat ${chatId} by user ${userId}`);
        await axios.post(`${TELEGRAM_API}/setChatPermissions`, { chat_id: chatId, permissions: { can_invite_users: false } });
        console.log(`[DEBUG] Revoked invite permissions in chat ${chatId}`);
        const exportRes = await axios.post(`${TELEGRAM_API}/exportChatInviteLink`, { chat_id: chatId });
        console.log(`[DEBUG] ExportChatInviteLink response: ${JSON.stringify(exportRes.data)}`);
        const setupMsg = 'Hey welcome to one1app one stop solution platform to manage and monetised your content at one place https://one1app.com/';
        await axios.post(`${TELEGRAM_API}/sendMessage`, { chat_id: chatId, text: setupMsg });
        console.log(`[DEBUG] Setup completion message sent to chat ${chatId}`);
        // mark group as monitored in database
        await prisma.telegram.update({ where: { chatId: String(chatId) }, data: { isGroupMonitored: true } });
        console.log(`[DEBUG] Marked chat ${chatId} as monitored`);
      } catch (err) {
        console.error('Error during setup:', err.response?.data || err.message);
      }
      return res.sendStatus(200);
    }
    if (baseCmd.startsWith('/myid')) {
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
      const details = `hey creators ${from.first_name}, setup your premium group click on the link fill all the necessary data\n\nLink :- https://one1app.com/app/create-telegram?chatid=${chat.id}`;
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
    console.log(`${new_chat_member.user.id} | ${chatMemberUpdate.chat.id} | ${invite_link.invite_link}`);
    // Find the user whose inviteLinks contains this link
    // Update User.chatId based on inviteLinks array
    const matchedUser = await prisma.user.findFirst({
      where: { inviteLinks: { has: invite_link.invite_link } }
    });
    if (matchedUser) {
      await prisma.user.update({
        where: { id: matchedUser.id },
        data: { chatId: new_chat_member.user.id.toString() }
      });
      console.log(`Updated User.chatId for user ${matchedUser.id}`);
    }
    // Revoke used invite link to enforce single-use
    try {
      await axios.post(`${TELEGRAM_API}/revokeChatInviteLink`, {
        chat_id: chatMemberUpdate.chat.id,
        invite_link: invite_link.invite_link
      });
      console.log(`Revoked invite link: ${invite_link.invite_link}`);
    } catch (err) {
      console.error(`Failed to revoke invite link ${invite_link.invite_link}:`, err.response?.data || err.message);
    }
  }

  res.sendStatus(200);
});

export default router;
