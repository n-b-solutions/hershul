import { Router } from "express";

import MinyanRouter from "./minyan.router";
import LuachMinyanRouter from "./luach-minyan.router";
import RoomRouter from "./room.router";
import MessageRouter from "./message.router";
import ScheduleRouter from "./schedule.router";
import GeonameidRouter from "./geonameid.router";
import PlayaAudioRouter from "./play-audio.router";

export const router = Router();

const defaultRoutes = [
  { path: "/minyan", route: MinyanRouter },
  { path: "/luach-minyan", route: LuachMinyanRouter },
  { path: "/room", route: RoomRouter },
  { path: "/message", route: MessageRouter },
  { path: "/schedule", route: ScheduleRouter },
  { path: "/geonameid", route: GeonameidRouter },
  { path: "/play-audio", route: PlayaAudioRouter },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
