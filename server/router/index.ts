import { Router } from "express";

import MinyanListRouter from "./minyanListRouter";
import RoomStatusRouter from "./roomStatusRouter";
import MessageRoomRouter from "./messageRoomRouter";
import ScheduleRouter from "./schedule.router";

export const router = Router();

const defaultRoutes = [
  { path: "/minyan", route: MinyanListRouter },
  { path: "/roomStatus", route: RoomStatusRouter },
  { path: "/message", route: MessageRoomRouter },
  { path: "/schedule", route: ScheduleRouter },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
