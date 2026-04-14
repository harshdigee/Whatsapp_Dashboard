import { io } from 'socket.io-client'
import { SOCKET_URL } from '../config/env'
import { getAuthHeaders } from '../lib/supabase'

const socket = io(SOCKET_URL, {
  autoConnect: false,
})

/**
 * Refresh handshake auth before connect/reconnect so the server receives the current JWT.
 */
export async function prepareSocketAuth() {
  const headers = await getAuthHeaders()
  socket.auth = {
    authorization: headers.Authorization,
  }
}

export default socket
