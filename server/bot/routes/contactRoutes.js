import express from 'express';
import axios from 'axios';

const router = express.Router();
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;

/**
 * POST /get-user-id-by-contact
 * Body: { chatId: number|string, phoneNumber: string, firstName?: string }
 * Sends a contact message to the specified chat, extracts the embedded user ID,
 * then deletes the message.
 */
router.post('/get-user-id-by-contact', async (req, res) => {
  const { chatId, phoneNumber, firstName } = req.body;
  if (!chatId || !phoneNumber) {
    return res.status(400).json({ message: 'chatId and phoneNumber are required' });
  }
  try {
    // Send contact message
    const sendResp = await axios.post(`${TELEGRAM_API}/sendContact`, {
      chat_id: chatId,
      phone_number: phoneNumber,
      first_name: firstName || 'Contact'
    });
    const msg = sendResp.data.result;
    const userId = msg.contact.user_id;
    // Clean up: delete the contact message
    await axios.post(`${TELEGRAM_API}/deleteMessage`, {
      chat_id: chatId,
      message_id: msg.message_id
    });
    return res.status(200).json({ userId });
  } catch (err) {
    console.error('sendContact error:', err.response?.data || err.message);
    return res.status(500).json({ message: 'Failed to resolve contact', detail: err.response?.data || err.message });
  }
});



export default router;
