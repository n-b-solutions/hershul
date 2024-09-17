import { Router } from "express";

import MinyanListRouter from "./minyanListRouter";
import RoomStatusRouter from "./roomStatusRouter";
import MessageRoomRouter from "./messageRoomRouter";

export const router = Router();

const defaultRoutes = [
  { path: "/minyan", route: MinyanListRouter },
  { path: "/roomStatus", route: RoomStatusRouter },
  { path: "/message", route: MessageRoomRouter },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
