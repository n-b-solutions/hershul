import { IncomingMessage, Server as HttpServer, ServerResponse } from 'http';
import { Server as SocketioServer } from 'socket.io';

import { CronJob } from 'cron';

import ScheduleController from './controller/scheduleController';

let io;

export const initSocketio = () => {
  io = new SocketioServer(process.env.VITE_SOCKET_PORT ? +process.env.VITE_SOCKET_PORT : 4001, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected' + socket.id);
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  const job = new CronJob('* * * * *', async () => {
    console.log('Running cron job to update rooms...');
    const updatedStatuses = await ScheduleController.updateRoomStatuses();

    await ScheduleController.logBeforeShkiah();
    io.emit('roomStatusUpdated', updatedStatuses);
  });

  job.start();

  return io;
};

export { io };
