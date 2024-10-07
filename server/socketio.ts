import { Server as SocketioServer } from 'socket.io';
import { CronJob } from 'cron';

import ScheduleController from './controllers/schedule.controller';

let io: SocketioServer;

export const initSocketio = (server) => {
  io = new SocketioServer(server, {
    cors: {
      origin: process.env.VITE_SITE_URL,
      methods: ['GET', 'POST'],
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
