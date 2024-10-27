import { NextFunction, Request, Response } from "express";

import ScheduleService from "../services/schedule.service";

const ScheduleController = {
  get: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await ScheduleService.get();
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  },
};
export default ScheduleController;
