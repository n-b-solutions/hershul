import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_LOCAL_SERVER;

export const socket = io(URL, {
    autoConnect: true,
    transports: ['websocket'],
  });

