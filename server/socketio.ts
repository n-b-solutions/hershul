import { IncomingMessage, Server as HttpServer, ServerResponse } from "http";
import { Server as SocketioServer } from "socket.io";

import { CronJob } from "cron";

import ScheduleController from "./controller/scheduleController";

let io;

export const initSocketio = (
  server: HttpServer<typeof IncomingMessage, typeof ServerResponse>
) => {
  io = new SocketioServer(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected " + socket.id);

    socket.on("changeRoomStatus", async ({ nameRoom, newStatus }) => {
      console.log(" socket.on");
      try {
        const updatedStatuses1 =
          await ScheduleController.setRoomSteadyFlagAndStatus(
            nameRoom,
            newStatus
          );
        io.emit("roomStatusUpdated", updatedStatuses1);
      } catch (error) {
        console.error("Error handling changeRoomStatus event:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  const job = new CronJob("* * * * *", async () => {
    console.log("Running cron job to update rooms...");
    const updatedStatuses = await ScheduleController.updateRoomStatuses();

    await ScheduleController.logBeforeShkiah();
    io.emit("roomStatusUpdated", updatedStatuses);
  });

  job.start();
  return io;
};

export { io };
