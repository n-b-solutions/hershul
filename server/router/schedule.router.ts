import { Router } from "express";
import ScheduleController from "../controllers/schedule.controller";

const router = Router();

router.get("/", ScheduleController.get);

export default router;
