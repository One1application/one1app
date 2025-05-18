# Telegram Bot Server

This service exposes both Telegram slash‐command handlers (via webhook/polling) and HTTP endpoints for automating invite link generation and direct messaging users.

## Environment Variables

Ensure the following are set in your `.env`:

- `TELEGRAM_TOKEN`: your bot token
- `BOT_SERVER_URL`: public URL (e.g. ngrok HTTPS URL)
- other existing vars as needed

## Slash Commands

- `/getgroupid` – replies with the current chat's ID
- `/ping` – replies `pong`
- `/setup` – revokes invite permissions for regular members and confirms setup
- `/myid` – replies with your own Telegram user ID

## HTTP Routes

### POST /invite-link
Generates a one‐time (member_limit: 1) invite link for the specified chat.

**Request**

```json
POST /invite-link
Content-Type: application/json

{
  "chat_id": -1001234567890
}
```

**Response**

```json
{ "invite_link": "https://t.me/joinchat/..." }
```

### POST /notify
Sends a direct (private) message to a Telegram user.

**Request**

```json
POST /notify
Content-Type: application/json

{
  "chatId": 123456789,
  "text": "Hello, only you will see this message!"
}
```

**Response**

```json
{ "success": true }
```

---

This server supports both webhooks and polling for local development (`NODE_ENV=development`). For questions or issues, please open an issue.