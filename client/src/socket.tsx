import { io } from 'socket.io-client';

const { VITE_SERVER_PROTOCOL, VITE_SERVER_DOMAIN, VITE_SERVER_PORT } = import.meta.env;
const SOCKET_URL = `${VITE_SERVER_PROTOCOL}://${VITE_SERVER_DOMAIN}${VITE_SERVER_PORT ? `:${VITE_SERVER_PORT}` : ''}`;

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket'],
});
