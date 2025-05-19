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

### POST /kick-user
Temporarily kicks a user from a group and then unbans them (reset membership).

**Request**

```json
{ "groupId": -1001234567890, "userId": 123456789 }
```

**Response**

```json
{ "success": true }
```

### POST /ban-user
Permanently bans a user from a group.

**Request**

```json
{ "groupId": -1001234567890, "userId": 123456789 }
```

**Response**

```json
{ "success": true }
```

### POST /channel/group-members
Returns the list of administrator user IDs in the specified group.

**Request**

```json
{ "groupId": -1001234567890 }
```

**Response**

```json
{ "userIds": [11111111, 22222222, 33333333] }
```

### POST /channel/user-id
Fetches a user's Telegram ID by username.

**Request**
```json
{ "username": "@someusername" }
```

**Response**
```json
{ "userId": 123456789 }
```

### POST /contact/get-user-id-by-contact
Sends a contact card into a chat and returns the embedded user ID.

**Request**
```json
{ "chatId": -1001234567890, "phoneNumber": "+919896543045", "firstName": "Lookup" }
```

**Response**
```json
{ "userId": 123456789 }
```

---

This server supports both webhooks and polling for local development (`NODE_ENV=development`). For questions or issues, please open an issue.