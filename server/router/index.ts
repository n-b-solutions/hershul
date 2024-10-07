import { Router } from "express";

import MinyanListRouter from "./minyan.router";
import RoomStatusRouter from "./room.router";
import MessageRouter from "./message.router";

export const router = Router();

const defaultRoutes = [
  { path: "/minyan", route: MinyanListRouter },
  { path: "/roomStatus", route: RoomStatusRouter },
  { path: "/message", route: MessageRouter },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
