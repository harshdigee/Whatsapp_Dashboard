import axios from 'axios'
import { API_BASE_URL } from '../config/env'

const api = axios.create({
  baseURL: API_BASE_URL,
})

export const fetchChats = () => api.get('/chats')

export const fetchMessages = (chatId) => api.get(`/messages/${chatId}`)

export const sendMessage = (chatId, message) => 
  api.post('/send-message', { chatId, message })

export default api

