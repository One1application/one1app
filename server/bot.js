import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import MTProto from "@mtproto/core";
import readline from "readline";
import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const prisma = new PrismaClient();

const token = "7656770449:AAEKUv5Jlj4nRB1t9R-gsVI0sngBF9cGsYQ";
const TELEGRAM_API = `https://api.telegram.org/bot${token}`;
const SERVER_URL =
  "https://6c80-2409-4080-e01-be92-14e2-14b5-b873-30f7.ngrok-free.app";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ChannelUser = new Map();

const mtproto = new MTProto({
  api_id: "22445730",
  api_hash: "cd15770d044397228abebaef551073b0",
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
    const phone_number = "+919253436309";

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

const createInviteLink = async (chatId) => {
  try {
    const response = await axios.post(`${TELEGRAM_API}/createChatInviteLink`, {
      chat_id: chatId,
      expire_date: Math.floor(Date.now() / 1000) + 600,
      member_limit: 1,
    });
    return response.data.result.invite_link;
  } catch (error) {
    console.error(
      "Error creating invite link:",
      error.response?.data || error.message
    );
  }
};

const getChannelId = async (inviteLink) => {
  try {
    console.log("Started fetching Channel ID...");

    if (inviteLink.includes("+")) {
      const hash = inviteLink.split("+")[1];
      const result = await mtproto.call("messages.checkChatInvite", {
        hash,
      });
      return {
        title: result.chat.title,
        chatId: `-100${result.chat.id}`,
      };
    } else {
      const username = inviteLink.replace("https://t.me/", "").replace("/", "");

      if (!username) {
        throw new Error("Invalid invite link format.");
      }

      const result = await mtproto.call("contacts.resolveUsername", {
        username,
      });
      console.log("Public Channel ID:", result.chats[0].id);
      return result.chats[0].id;
    }
  } catch (error) {
    console.error("Error fetching channel ID:", error?.error_message || error);
    throw new Error("Failed to fetch channel Id.");
  }
};

const setupWebhook = async () => {
  try {
    const webhookUrl = `${SERVER_URL}/webhook`;
    const response = await axios.post(`${TELEGRAM_API}/setWebhook`, {
      url: webhookUrl,
      allowed_updates: ["chat_member", "my_chat_member"],
    });
    console.log("Webhook setup response:", response.data);
  } catch (error) {
    console.error("Error setting up webhook:", error.message);
  }
};

app.post("/webhook", async (req, res) => {
  const update = req.body;
  console.log("Received update:", JSON.stringify(update, null, 2));

  // Check if the update contains a member status change
  const chatMemberUpdate = update.chat_member || update.my_chat_member;

  if (!chatMemberUpdate) {
    console.log("No chat_member or my_chat_member field. Skipping.");
    return res.sendStatus(200);
  }

  const { new_chat_member, old_chat_member, invite_link, chat } =
    chatMemberUpdate;

  if (invite_link) {
    if (
      old_chat_member?.status !== "member" &&
      new_chat_member?.status === "member"
    ) {
      try {
        const userId = ChannelUser.get(invite_link.invite_link);
        console.log("User who joined:", userId);

        if (userId) {
          await prisma.telegramSubscription.update({
            where: {
              boughtById: userId,
            },
            data: {
              chatId: new_chat_member.user.id.toString(),
            },
          });

          console.log(`Updated subscription for user ${userId}`);
        }
      } catch (error) {
        console.error("Error processing chat_member update:", error);
      }
    }
  }

  res.sendStatus(200);
});

app.post("/kick", async (req, res) => {
  try {
    await axios.post(`${TELEGRAM_API}/kickChatMember`, {
      chat_id: "-1002340887899",
      user_id: "1143595297",
    });

    await axios.post(`${TELEGRAM_API}/unbanChatMember`, {
      chat_id: "-1002340887899",
      user_id: "1143595297",
      only_if_banned: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to verify channel.",
    });
  }
});

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

app.get("/generate-invitelink", async (req, res) => {
  try {
    const { channelId, boughtById } = req.query;
    console.log(channelId, boughtById);

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

const checkExpiredSubscriptions = async () => {
  try {
    console.log("Checking for expired Telegram subscriptions...");

    const expiredSubscriptions = await prisma.telegramSubscription.findMany({
      where: {
        createdAt: {
          lte: new Date(Date.now() - `24 * 60 * 60 * 1000`),
        },
      },
      include: {
        telegram: true,
        boughtBy: true,
      },
    });

    for (const sub of expiredSubscriptions) {
      console.log(
        `Removing user ${sub.boughtById} from channel ${sub.telegram.channelName}`
      );

      await axios.post(`${TELEGRAM_API}/kickChatMember`, {
        chat_id: sub.telegram.channelId,
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

(async () => {
  await login();
})();

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await setupWebhook();
  console.log("Webhook setup completed");
});

app.get("/", (req, res) => res.send("Telegram Bot Webhook Server is running!"));
