import express, { Request, Response } from 'express';
import cors from 'cors';
import MinyanListRouter from './router/minyanListRouter';
import RoomStatusRouter from './router/roomStatusRouter';
import MessageRoomRouter from './router/MessageRoomRouter';
import connectDB from './DB/mongoConnect';
import { CronJob } from 'cron';
import ScheduleController from './controller/scheduleController';

connectDB();
const app = express();
app.use(cors());

app.listen(4000, () => {
  console.log('Server is running on port 4000'); 
});
const job = new CronJob('* * * * *', () => {
  console.log('Running cron job to update rooms to on...');
  ScheduleController.updateRoomStatuses();
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
