-- ─────────────────────────────────────────────────────────────────────────────
-- WhatsApp AI Dashboard — Supabase Schema
-- Run this in your Supabase SQL editor to set up the required tables.
-- ─────────────────────────────────────────────────────────────────────────────

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
  id            BIGSERIAL PRIMARY KEY,
  chat_id       TEXT UNIQUE NOT NULL,
  name          TEXT,
  phone         TEXT,
  last_message  TEXT,
  last_timestamp TIMESTAMPTZ DEFAULT NOW(),
  unread_count  INTEGER DEFAULT 0,
  mode          TEXT DEFAULT 'ai' CHECK (mode IN ('ai', 'manual')),
  online        BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id         BIGSERIAL PRIMARY KEY,
  chat_id    TEXT NOT NULL REFERENCES chats(chat_id) ON DELETE CASCADE,
  sender     TEXT NOT NULL CHECK (sender IN ('user', 'ai', 'human', 'assistant')),
  message    TEXT NOT NULL,
  timestamp  TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast message lookups by chat
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_chats_last_timestamp ON chats(last_timestamp DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security (RLS) — disable for service role key usage
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
