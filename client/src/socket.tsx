import { io } from 'socket.io-client';

const { VITE_SERVER_BASE_URL, VITE_SOCKET_PORT } = import.meta.env;
export const socket = io(VITE_SERVER_BASE_URL + ':' + VITE_SOCKET_PORT, {
  autoConnect: true,
  transports: ['websocket'],
});
