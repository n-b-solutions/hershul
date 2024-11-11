import { Router } from "express";
import RoomController from "../controllers/room.controller";

const router = Router();

router.get("/", RoomController.get);
router.get("/:id", RoomController.getById);
router.put("/:id", RoomController.update);

export default router;
