import { Server as SocketioServer } from "socket.io";
import { CronJob } from "cron";

import ScheduleService from "./services/schedule.service";

let io: SocketioServer;

export const initSocketio = (server) => {
  io = new SocketioServer(server, {
    cors: {
      origin: process.env.VITE_SITE_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected" + socket.id);
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // TODO: Remove this cron job form here and move it to a separate file
  const job = new CronJob("* * * * * *", async () => {
    console.log("Running cron job to update rooms...");
    await ScheduleService.updateRoomStatuses();
    await ScheduleService.logBeforeShkiah();
  });

  job.start();

  return io;
};

export { io };
