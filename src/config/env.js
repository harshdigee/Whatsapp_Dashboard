/**
 * Backend base URLs (deployed API on Railway).
 * Override in .env.local or Vercel: VITE_API_BASE_URL, VITE_SOCKET_URL
 * Local backend: VITE_API_BASE_URL=http://localhost:5001/api and VITE_SOCKET_URL=http://localhost:5001
 */
const RAILWAY_API = 'https://backendwhatsappn8n-production.up.railway.app/api'
const RAILWAY_ORIGIN = 'https://backendwhatsappn8n-production.up.railway.app'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || RAILWAY_API

export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || RAILWAY_ORIGIN
