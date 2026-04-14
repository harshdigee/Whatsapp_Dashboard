import axios from 'axios'
import { API_BASE_URL } from '../config/env'
import { supabase } from '../lib/supabase'

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.access_token) throw new Error('Not authenticated')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
  }
}

function handleUnauthorized() {
  void supabase.auth.signOut().then(() => {
    window.location.href = '/'
  })
}

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      handleUnauthorized()
    }
    return Promise.reject(error)
  }
)

export async function fetchWithAuth(url, options = {}) {
  const headers = await getAuthHeaders()
  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  })
  if (res.status === 401) {
    handleUnauthorized()
    throw new Error('Unauthorized')
  }
  return res
}

export { getAuthHeaders }

export const fetchChats = async () => {
  const headers = await getAuthHeaders()
  return api.get('/chats', { headers })
}

export const fetchMessages = async (chatId) => {
  const headers = await getAuthHeaders()
  return api.get(`/messages/${chatId}`, { headers })
}

export const sendMessage = async (chatId, message) => {
  const headers = await getAuthHeaders()
  return api.post('/send-message', { chatId, message }, { headers })
}

/** POST /api/mode — dashboard → backend only (not n8n). */
export const setChatMode = async (chatId, mode) => {
  const headers = await getAuthHeaders()
  return api.post('/mode', { chatId, mode }, { headers })
}

export default api
