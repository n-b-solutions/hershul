import express, { Request, Response } from "express";
import cors from "cors";
import MinyanListRouter from "./router/minyanListRouter";
import RoomStatusRouter from "./router/roomStatusRouter";
import MessageRoomRouter from "./router/messageRoomRouter";
import connectDB from "./DB/mongoConnect";
import { CronJob } from "cron";
import ScheduleController from "./controller/scheduleController";
import { createServer } from "node:http";
import { Server } from "socket.io";

connectDB();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle the changeRoomStatus event
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

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/minyan", MinyanListRouter);
app.use("/roomStatus", RoomStatusRouter);
app.use("/message", MessageRoomRouter);

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
export const viteNodeApp = app;
