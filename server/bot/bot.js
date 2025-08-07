import express from "express";
import axios from "axios";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import MTProto from "@mtproto/core";
import readline from "readline";
import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
import rootRouter from './routes/rootRoutes.js';
import webhookRouter from './routes/webhookRoutes.js';
import kickRouter from './routes/kickRoutes.js';
import healthRouter from './routes/healthRoutes.js';
import channelRouter from './routes/channelRoutes.js';
import notifyRouter from './routes/notifyRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import otpRouter from './routes/otpRoutes.js';
import ChannelUser from './channelUserMap.js';


dotenv.config();

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

const token = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${token}`;
const SERVER_URL = process.env.BOT_SERVER_URL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mtproto = new MTProto({
  api_id: process.env.API_ID,
  api_hash: process.env.API_HASH,
  storageOptions: {
    path: path.resolve(__dirname, "mtproto-session.json"),
  },
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const login = async () => {
  try {
    const phone_number = process.env.BOT_PHONE_NUMBER;

    let result = await mtproto.call("auth.sendCode", {
      phone_number,
      settings: { _: "codeSettings" },
    });

    if (result.error_message?.startsWith("PHONE_MIGRATE_")) {
      const newDc = parseInt(result.error_message.split("_").pop(), 10);
      console.log(`Switching to Data Center ${newDc}...`);
      mtproto.setDefaultDc(newDc);
      result = await mtproto.call("auth.sendCode", {
        phone_number,
        settings: { _: "codeSettings" },
      });
    }

    const phone_code = await askQuestion(
      "Enter the code you received on Telegram: "
    );

    const signInResult = await mtproto.call("auth.signIn", {
      phone_number,
      phone_code_hash: result.phone_code_hash,
      phone_code,
    });

    console.log("Login successful:", signInResult);
  } catch (error) {
    if (error.error_message?.startsWith("PHONE_MIGRATE_")) {
      const newDc = parseInt(error.error_message.split("_").pop(), 10);
      console.log(`Switching to Data Center ${newDc} and retrying login...`);
      mtproto.setDefaultDc(newDc);
      return login();
    }
    console.error("Login failed:", error);
  }
};

// Generate invite link with optional name for unique links per user
const createInviteLink = async (chatId, inviteName) => {
  try {
    const payload = {
      chat_id: chatId,
      expire_date: Math.floor(Date.now() / 1000) + 600,
      member_limit: 1
    };
    if (inviteName) payload.name = inviteName;
    const response = await axios.post(`${TELEGRAM_API}/createChatInviteLink`, payload);
    return response.data.result.invite_link;
  } catch (error) {
    console.error(
      "Error creating invite link:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const getChannelId = async (inviteLink) => {
  try {
    console.log("Started fetching Channel ID for invite link:", inviteLink);

    if (inviteLink.includes("+")) {
      // Private channel invite link (e.g., https://t.me/+abcdefg)
      const hash = inviteLink.split("+")[1];
      if (!hash) {
        throw new Error("Invalid private invite link format.");
      }

      const inviteResult = await mtproto.call("messages.checkChatInvite", {
        hash,
      });
      console.log(
        "CheckChatInvite result:",
        JSON.stringify(inviteResult, null, 2)
      );

      if (inviteResult._ === "chatInvite") {
        // Handle case where bot is not a member and only invite metadata is returned
        if (!inviteResult.title) {
          throw new Error("No title found in invite link response.");
        }

        // Join the channel to get the chat ID
        const importResult = await mtproto.call("messages.importChatInvite", {
          hash,
        });
        console.log(
          "ImportChatInvite result:",
          JSON.stringify(importResult, null, 2)
        );

        if (!importResult.chats || importResult.chats.length === 0) {
          throw new Error("Failed to retrieve chat information after joining.");
        }

        const chat = importResult.chats[0];
        const chatId = `-100${chat.id}`;
        const title = chat.title || inviteResult.title;

        // Optionally leave the channel if the bot doesn't need to stay
        // await mtproto.call("channels.leaveChannel", { channel: { _: "inputChannel", channel_id: chat.id, access_hash: chat.access_hash } });

        return {
          title,
          chatId,
        };
      } else if (inviteResult.chat) {
        // Case where chat information is directly available
        return {
          title: inviteResult.chat.title || "Unknown Channel",
          chatId: `-100${inviteResult.chat.id}`,
        };
      } else {
        throw new Error("Unexpected response format from checkChatInvite.");
      }
    } else {
      // Public channel or group (e.g., https://t.me/username)
      let urlObj;
      try {
        urlObj = new URL(
          inviteLink.startsWith("http")
            ? inviteLink
            : `https://t.me/${inviteLink}`
        );
      } catch {
        throw new Error("Invalid public invite link format.");
      }
      const username = urlObj.pathname.replace(/\//g, "").replace("@", "");

      if (!username) {
        throw new Error("Invalid public invite link format.");
      }

      const result = await mtproto.call("contacts.resolveUsername", {
        username,
      });
      console.log("ResolveUsername result:", JSON.stringify(result, null, 2));

      if (!result.chats || result.chats.length === 0) {
        throw new Error("No chats found for the provided username.");
      }

      return {
        title: result.chats[0].title || "Unknown Channel",
        chatId: `-100${result.chats[0].id}`,
      };
    }
  } catch (error) {
    console.error("Error fetching channel ID:", error?.error_message || error);
    throw new Error(`Failed to fetch channel ID: ${error.message}`);
  }
};

const setupWebhook = async () => {
  // Attempt to set webhook
  try {
    const webhookUrl = `${SERVER_URL}/webhook`;
    const response = await axios.post(`${TELEGRAM_API}/setWebhook`, {
      url: webhookUrl,
      allowed_updates: ["message", "my_chat_member", "chat_member"],
    });
    console.log("Webhook setup response:", response.data);
  } catch (error) {
    console.error(
      "Error setting up webhook:",
      error.response?.data || error.message
    );
  }
  // Register slash commands for preview in Telegram clients
  try {
    // Default scope (all chats)
    await axios.post(`${TELEGRAM_API}/setMyCommands`, {
      commands: [
        { command: "getgroupid", description: "Get the current group ID" },
        { command: "ping", description: "Ping the bot" },
        { command: "setup", description: "Revoke invite perms" },
        { command: "myid", description: "Get your Telegram user ID" },
      ],
    });
    // Group chats scope
    await axios.post(`${TELEGRAM_API}/setMyCommands`, {
      commands: [
        { command: "getgroupid", description: "Get the current group ID" },
        { command: "ping", description: "Ping the bot" },
        { command: "setup", description: "Revoke invite perms" },
        { command: "myid", description: "Get your Telegram user ID" },
      ],
      scope: { type: "all_group_chats" },
    });
    console.log("Registered bot commands.");
  } catch (error) {
    console.error(
      "Error registering bot commands:",
      error.response?.data || error.message
    );
  }
};

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
// Mount moved routes
app.use(rootRouter);
app.use(kickRouter);
app.use("/webhook", webhookRouter);
app.use("/health", healthRouter);
app.use("/channel", channelRouter);
// Notification endpoints for sending DMs
app.use("/notify", notifyRouter);
app.use("/contact", contactRouter);
app.use("/otp", otpRouter);
app.use("/notify", notifyRouter);

app.post("/verify-channel", async (req, res) => {
  try {
    const { inviteLink } = req.body;
    const response = await getChannelId(inviteLink);
    return res.status(200).json({
      channelDetails: response,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to verify channel.",
    });
  }
});

app.get("/generate-invite", async (req, res) => {
  try {
    const { channelId, boughtById } = req.query;
    console.log(channelId, boughtById);
    if (!channelId || !boughtById) {
      return res
        .status(400)
        .json({ message: "channelId and boughtById are required" });
    }

    const response = await createInviteLink(channelId);
    console.log("Set", response);

    ChannelUser.set(response, boughtById);

    res.status(200).json({
      success: true,
      payload: {
        inviteLink: response,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to fetch invite link.",
    });
  }
});

app.get("/users", (req, res) => {
  const providedKey = req.query.key;
  const expectedKey = process.env.ADMIN_KEY || "your-secret-key";
  providedKey === expectedKey
    ? res.json(channelUserData)
    : res.status(401).send("Unauthorized");
});

app.get("/health-check", async (req, res) => {
  res.json({
    message: "Bot Server Up",
  });
});

//routes to check if bot has admin permission
app.post("/check-admin-status", async (req, res) => {
  try {
    const { chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "chatId is required",
      });
    }

    const botInfo = await axios.get(`${TELEGRAM_API}/getMe`);


    const botId = botInfo.data.result.id;

    const chatMember = await axios.get(`${TELEGRAM_API}/getChatMember`, {
      params: {
        chat_id: chatId,
        user_id: botId,
      },
    });

    const isAdmin = chatMember.data.result.status === "administrator";

    res.json({
      success: true,
      isAdmin,
      botId,
      status: chatMember.data.result.status,
    });
  } catch (error) {
    console.error(
      "Error checking admin status:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "error checking admin status",
    });
  }
});

app.post("/invite-link", async (req, res) => {
  const { chat_id } = req.body;
  if (!chat_id) {
    return res.status(400).json({ message: "chat_id is required" });
  }
  try {
    const response = await axios.post(`${TELEGRAM_API}/createChatInviteLink`, {
      chat_id,
      member_limit: 1,
    });
    const link = response.data.result.invite_link;
    return res.status(200).json({ invite_link: link });
  } catch (err) {
    console.error("Invite link error:", err.response?.data || err.message);
    return res.status(500).json({ message: "Failed to create invite link" });
  }
});

const checkExpiredSubscriptions = async () => {
  try {
    console.log("Checking for expired Telegram subscriptions...");

    const expiredSubscriptions = await prisma.telegramSubscription.findMany({
      where: {
        createdAt: {
          lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        telegram: true,
        boughtBy: true,
      },
    });

    for (const sub of expiredSubscriptions) {
      console.log(
        `Removing user ${sub.boughtById} from channel ${sub.telegram.title}`
      );

      await axios.post(`${TELEGRAM_API}/kickChatMember`, {
        chat_id: sub.telegram.chatId,
        user_id: sub.telegramId,
      });
      await prisma.telegramSubscription.delete({
        where: { id: sub.id },
      });

      console.log(`User ${sub.boughtById} removed and subscription deleted.`);
    }
  } catch (error) {
    console.error("Error checking expired subscriptions:", error);
  }
};
cron.schedule("0 * * * *", async () => {
  console.log("Running hourly job to check expired subscriptions...");
  await checkExpiredSubscriptions();
});

const requiredEnv = [
  "TELEGRAM_TOKEN",
  "BOT_SERVER_URL",
  "API_ID",
  "API_HASH",
  "BOT_PHONE_NUMBER",
  "CLIENT_ORIGIN",
];
const PORT = process.env.PORT || 3000;
requiredEnv.forEach((name) => {
  if (!process.env[name]) {
    console.error(`Missing ENV var ${name}`);
    process.exit(1);
  }
});

// Polling fallback for local dev (no webhook)
import TelegramBotLib from "node-telegram-bot-api";
// Start polling if in non-production
if (process.env.NODE_ENV !== 'production') {
  const pollingBot = new TelegramBotLib(token, { polling: { allowed_updates: ['message', 'chat_member', 'my_chat_member'] } });

  pollingBot.onText(/\/ping$/, (msg) => {
    pollingBot.sendMessage(msg.chat.id, "pong");
  });
  pollingBot.onText(/\/getgroupid$/, (msg) => {
    pollingBot.sendMessage(msg.chat.id, `This group ID is: ${msg.chat.id}`);
  });
  pollingBot.onText(/\/start$/, async (msg) => {
    const chatId = msg.chat.id;
    const chatType = msg.chat.type;
    if (chatType !== "private") {
      // Group chat: prompt to register and setup
      await pollingBot.sendMessage(
        chatId,
        `Please register this group on https://example.com/form.html?chatid=${chatId} and run the /setup command`
      );
    } else {
      // Private chat: welcome user
      await pollingBot.sendMessage(
        chatId,
        "Hey, welcome to one1app bot! Please register an account on http://localhost:5173/app/create-telegram and add the bot."
      );
    }
  });
  pollingBot.onText(/\/myid(?:\s+@\w+)?/, async (msg) => {
    const parts = msg.text.split(" ").filter(Boolean);
    try {
      if (parts.length > 1) {
        const identifier = parts[1];
        const chatInfo = await axios.get(`${TELEGRAM_API}/getChat`, {
          params: { chat_id: identifier },
        });
        const targetId = chatInfo.data.result.id;
        await pollingBot.sendMessage(
          msg.chat.id,
          `User ID for ${identifier} is: ${targetId}`
        );
      } else {
        await pollingBot.sendMessage(
          msg.chat.id,
          `Your Telegram ID is: ${msg.from.id}`
        );
      }
    } catch (err) {
      console.error("Polling /myid error:", err.response?.data || err.message);
      await pollingBot.sendMessage(msg.chat.id, "Failed to fetch user ID.");
    }
  });
  pollingBot.on('message', async (msg) => {
    console.log(`[DEBUG] Polling message received in chat ${msg.chat.id} from ${msg.from.id}: ${msg.text}`);
    if (msg.new_chat_members && msg.new_chat_members.some(m => m.is_bot)) {
      const chat = msg.chat;
      const adminId = msg.from.id;
      const details = `hey ${msg.from.first_name}, setup your premium group click on the link fill all the necessary data
\nLink :- https://one1app.com/app/create-telegram?chatid=${chat.id}`;

      try {
        await pollingBot.sendMessage(adminId, details);
        console.log(
          `Sent polling service-message DM to user ${adminId} for group ${chat.id}`
        );
      } catch (err) {
        console.error(
          `Failed to send polling DM to ${adminId}:`,
          err.response?.data || err.message
        );
      }
    }
    if (msg.text) {
      const cmd = msg.text.split(' ')[0].split('@')[0];
      if (cmd === '/setup') {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        // Check bot admin privileges
        try {
          console.log(`[DEBUG] polling /setup received in chat ${chatId} by user ${userId}`);
          await axios.post(`${TELEGRAM_API}/setChatPermissions`, { chat_id: chatId, permissions: { can_invite_users: false } });
          console.log(`[DEBUG] Revoked invite permissions in chat ${chatId}`);
        } catch (err) {
          console.error('Error during polling setup admin check:', err.response?.data || err.message);
          const errMsg = 'Bot isn\'t admin. Please provide admin rights.';
          try {
            await pollingBot.sendMessage(chatId, errMsg);
          } catch (sendErr) {
            console.error('Failed sending admin-error to group, falling back to DM:', sendErr);
            try {
              await pollingBot.sendMessage(userId, errMsg);
            } catch (dmErr) {
              console.error('Failed sending admin-error DM:', dmErr.response?.data || dmErr.message);
            }
          }
          return;
        }
        // Perform setup actions
        try {
          const exportRes = await axios.post(`${TELEGRAM_API}/exportChatInviteLink`, { chat_id: chatId });
          console.log(`[DEBUG] ExportChatInviteLink response: ${JSON.stringify(exportRes.data)}`);
          const setupMsg = "Hey welcome to one1app one stop solution platform to manage and monetised your content at one place https://one1app.com/";
          await pollingBot.sendMessage(chatId, setupMsg);
          console.log(`[DEBUG] Setup completion message sent to chat ${chatId}`);
        } catch (err) {
          console.error('Error during polling /setup exec:', err.response?.data || err.message);
        }
        return;
      }
    }
  });
  pollingBot.on('chat_member', (update) => {
    // console.log('Polling chat_member payload:', JSON.stringify(update, null, 2));
    const { chat, invite_link, new_chat_member } = update;
    if (invite_link && new_chat_member.status === 'member') {
      console.log(`${new_chat_member.user.id} | ${chat.id} | ${invite_link.invite_link}`);
    }
  });
  console.log("Polling bot started.");
}

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // Skipping MTProto login in development to avoid blocking on invalid phone
    // await login();
    await setupWebhook();
    console.log("Webhook setup completed");
  });
}

export default app;
// Export helpers for routes
export { createInviteLink, getChannelId };
