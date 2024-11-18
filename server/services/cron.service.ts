import { CronJob } from 'cron';
import MinyanService from './minyan.service';

const CronService = {
  deleteExpiredMinyanOnceADay: () => {
    const job = new CronJob('0 0 * * *', async () => {
      try {
        await MinyanService.deleteExpiredMinyan();
        console.log('Expired minyans deleted successfully');
      } catch (error) {
        console.error('Error deleting expired minyans:', error);
      }
    });
    job.start();
  },

  startCronJobs: () => {
    CronService.deleteExpiredMinyanOnceADay();
    console.log('Cron jobs started');
  }
};

export default CronService;