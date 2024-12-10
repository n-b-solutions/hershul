import { CronJob } from "cron";
import MinyanService from "./minyan.service";
import { FileLogger } from "../utils/file-logger.util";

// Create an instance of FileLogger
const logger = new FileLogger({ prefix: "CronService", level: "ALL" });

const CronService = {
  deleteExpiredMinyanOnceADay: () => {
    const job = new CronJob("0 0 * * *", async () => {
      try {
        const deletedMinyan = await MinyanService.deleteExpiredMinyan();
        if (deletedMinyan) {
          logger.debug("Expired minyan deleted successfully");
        } 
      } catch (error) {
        logger.error("Error deleting expired minyans:", error);
      }
    });
    job.start();
  },

  startCronJobs: () => {
    CronService.deleteExpiredMinyanOnceADay();
  },
};

export default CronService;
