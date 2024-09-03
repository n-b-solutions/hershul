import express, { Request, Response } from 'express';
import cors from 'cors';
import MinyanListRouter from './router/minyanListRouter';
import RoomStatusRouter from './router/roomStatusRouter';
import MessageRoomRouter from './router/MessageRoomRouter';
import connectDB from './DB/mongoConnect';
import { CronJob } from 'cron';
import ScheduleController from './controller/scheduleController';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

connectDB();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React app URL
    methods: ["GET", "POST"]
  }
});



app.use(cors());

server.listen(4000, () => {
  console.log('Server is running on port 4000'); 
});
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
const job = new CronJob('* * * * *', async () => {
  console.log('Running cron job to update rooms to on...');
  const updatedStatuses = await ScheduleController.updateRoomStatuses();
  console.log(updatedStatuses);
  
  io.emit('roomStatusUpdated', updatedStatuses);
});

// Start the cron job
job.start();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/minyan', MinyanListRouter);
app.use('/roomStatus', RoomStatusRouter);
app.use('/message', MessageRoomRouter);

export const viteNodeApp = app;
