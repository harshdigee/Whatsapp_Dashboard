import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

export const fetchChats = () => api.get('/chats')

export const fetchMessages = (chatId) => api.get(`/messages/${chatId}`)

export const sendMessage = (chatId, message) => 
  api.post('/send-message', { chatId, message })

export default api

