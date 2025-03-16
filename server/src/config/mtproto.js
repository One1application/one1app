import dotenv from 'dotenv';
import MTProto from '@mtproto/core';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// MTProto Instance
const mtproto = new MTProto({
  api_id: parseInt(process.env.TELEGRAM_API_ID, 10),
  api_hash: process.env.TELEGRAM_API_HASH,
  storageOptions: {
    path: path.resolve(__dirname, '../telegram_session.json'),
  },
});

// Wrapper Function to Call MTProto Methods
const mtprotoCall = async (method, params) => {
  try {
    const result = await mtproto.call(method, params);
    return result;
  } catch (error) {
    if (error.error_message && error.error_message.startsWith('PHONE_MIGRATE')) {
      const migratedDc = parseInt(error.error_message.split('_').pop(), 10);
      console.log(`Redirecting to data center ${migratedDc}.`);
      mtproto.setDefaultDc(migratedDc);
      return await mtproto.call(method, params);
    } else {
      console.error(`MTProto error on method ${method}:`, error);
      throw error;
    }
  }
};

export { mtproto, mtprotoCall };
