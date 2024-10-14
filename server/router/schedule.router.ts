import express, { Request, Response } from "express";
import ScheduleController from "../controllers/schedule.controller";

const ScheduleRouter = express.Router();

ScheduleRouter.get("/", (req: Request, res: Response) => {
  ScheduleController.get(req, res);
});

export default ScheduleRouter;
