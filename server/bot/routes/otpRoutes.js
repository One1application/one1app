import express from 'express';
import { mtprotoCall } from '../../src/config/mtproto.js';
import axios from 'axios';

const router = express.Router();
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;


router.post('/send', async (req, res) => {
  const { chatId, otp } = req.body;
  if (!chatId || !otp) {
    return res.status(400).json({ message: 'chatId and otp are required' });
  }
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: `Your OTP is: ${otp}`
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending OTP:', error.response?.data || error.message);
    return res.status(500).json({ message: 'Failed to send OTP', detail: error.response?.data || error.message });
  }
});

/**
 * POST /otp/send-mtproto
 * Body: { phoneNumber: string, otp: string }
 * Sends an OTP via MTProto as a user (no mutual bot-server required).
 */
router.post('/send-mtproto', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'phoneNumber and otp are required' });
  }
  try {
    // Import contact to get access_hash
    const { contacts } = await mtprotoCall('contacts.importContacts', {
      contacts: [{ phone_number: phoneNumber, first_name: 'OTP' }]
    });
    const user = contacts[0].user;
    // Send message via MTProto
    await mtprotoCall('messages.sendMessage', {
      peer: { _: 'inputPeerUser', user_id: user.id, access_hash: user.access_hash },
      message: `Your OTP is: ${otp}`
    });
    return res.status(200).json({ success: true, userId: user.id });
  } catch (error) {
    console.error('MTProto OTP error:', error);
    return res.status(500).json({ message: 'Failed to send OTP via MTProto', detail: error });
  }
});

export default router;
