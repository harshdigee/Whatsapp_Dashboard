# WhatsApp AI Dashboard Backend

Production-ready Node.js backend for managing WhatsApp conversations with AI automation.

## 🚀 Features

- **Real-time messaging** via Socket.io
- **Supabase PostgreSQL** database integration
- **n8n webhook** integration for message forwarding
- **AI/Manual mode** toggle per chat
- **RESTful API** for frontend integration
- **Production-ready** error handling and logging

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account
- n8n instance (optional)

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set up Supabase Database
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy and run the contents of `supabase_schema.sql`

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=5000
FRONTEND_URL=http://localhost:5173
N8N_WEBHOOK_URL=http://localhost:5678/webhook/send-message
```

### 4. Start Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server will be available at `http://localhost:5000`

## 📡 API Endpoints

### Messages
- `POST /api/messages` - Receive message from n8n
- `GET /api/messages/:chatId` - Get all messages for a chat

### Chats  
- `GET /api/chats` - Get all chats (sorted by latest)
- `POST /api/chats/:chatId/read` - Mark chat as read (reset unread count)

### Mode Management
- `POST /api/mode` - Toggle AI/manual mode for a chat

### Manual Messaging
- `POST /api/send-message` - Send manual message (human agent)

### Health Check
- `GET /health` - Server health status

## 🔌 Socket.io Events

### Emitted by Server
- `new_message` - New message received
- `chat_updated` - Chat metadata updated

## 📊 Database Schema

### `chats` table
```sql
- chat_id (TEXT, unique)
- name (TEXT, nullable)  
- phone (TEXT, nullable)
- last_message (TEXT)
- last_timestamp (TIMESTAMPTZ)
- unread_count (INTEGER, default 0)
- mode (TEXT, 'ai' or 'manual', default 'ai')
- online (BOOLEAN, default false)
```

### `messages` table  
```sql
- chat_id (TEXT, references chats.chat_id)
- sender (TEXT, 'user', 'ai', or 'human')
- message (TEXT)
- timestamp (TIMESTAMPTZ)
```

## 🔗 n8n Integration

The backend forwards manual messages to n8n via webhook:

**Endpoint:** `POST http://localhost:5678/webhook/send-message`

**Payload:**
```json
{
  "chatId": "chat-123",
  "message": "Hello from human agent"
}
```

## 🧪 Testing

### Create a test message
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "test-chat-1",
    "sender": "user", 
    "message": "Hello, I need help",
    "timestamp": "2024-01-15T10:30:00Z"
  }'
```

### Get all chats
```bash
curl http://localhost:5000/api/chats
```

### Send manual message
```bash
curl -X POST http://localhost:5000/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "test-chat-1",
    "message": "How can I help you?"
  }'
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Supabase      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   n8n Webhook   │
                       │   (Optional)    │
                       └─────────────────┘
```

## 🔧 Development

- **Logs:** All operations include detailed console logging
- **Error Handling:** Comprehensive error responses with details
- **CORS:** Configured for frontend development
- **Hot Reload:** Use `npm run dev` for development

## 📝 License

MIT License - see LICENSE file for details