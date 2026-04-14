import axios from 'axios'
import { API_BASE_URL } from '../config/env'
import { getAuthHeaders } from '../lib/supabase'

const api = axios.create({
  baseURL: API_BASE_URL,
})

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

export default api
