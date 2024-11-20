import { CronJob } from "cron";
import MinyanService from "./minyan.service";

const CronService = {
  deleteExpiredMinyanOnceADay: () => {
    const job = new CronJob("0 0 * * *", async () => {
      console.log("Cron job started for deleting expired minyans");
      try {
        const deletedMinyan = await MinyanService.deleteExpiredMinyan();
        if (deletedMinyan) {
          console.log("Expired minyan deleted successfully");
        } else {
          console.log("No minyan to delete");
        }
      } catch (error) {
        console.error("Error deleting expired minyans:", error);
      }
    });
    job.start();
  },

  startCronJobs: () => {
    CronService.deleteExpiredMinyanOnceADay();
    console.log("Cron jobs started");
  },
};

export default CronService;
