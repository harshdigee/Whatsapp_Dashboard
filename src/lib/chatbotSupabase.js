import { createClient } from '@supabase/supabase-js'

// Uses the service role key to bypass RLS on the chatbot project.
// This client is read-only (dashboard never writes) and the app is
// auth-gated, so service key exposure is acceptable here.
export const chatbotSupabase = createClient(
  import.meta.env.VITE_SUPABASE_CHATBOT_URL,
  import.meta.env.VITE_SUPABASE_CHATBOT_SERVICE_KEY
)
