import express, { Request, Response } from "express";
import ScheduleController from "../controller/scheduleController";

const ScheduleRouter = express.Router();

ScheduleRouter.get("/", (req: Request, res: Response) => {
  ScheduleController.get(req, res);
});

export default ScheduleRouter;
