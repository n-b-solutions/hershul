import { Router } from "express";

import MinyanRouter from "./minyan.router";
import RoomRouter from "./room.router";
import MessageRouter from "./message.router";
import ScheduleRouter from "./schedule.router";
import GeonameidRouter from "./geonameid.router";

export const router = Router();

const defaultRoutes = [
  { path: "/minyan", route: MinyanRouter },
  { path: "/room", route: RoomRouter },
  { path: "/message", route: MessageRouter },
  { path: "/schedule", route: ScheduleRouter },
  { path: "/geonameid", route: GeonameidRouter },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
