import { createClient } from '@supabase/supabase-js'

export const chatbotSupabase = createClient(
  import.meta.env.VITE_SUPABASE_CHATBOT_URL,
  import.meta.env.VITE_SUPABASE_CHATBOT_ANON_KEY
)
