import { Request, Response, NextFunction } from "express";
import RoomService from "../services/room.service";
import MinyanService from "../services/minyan.service";
import { eBulbStatus } from "../../lib/types/room.type";

const RoomController = {
  get: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await RoomService.get();
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  getById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await RoomService.getById(id);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  update: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { bulbStatus, bulbColor } = req.body;
      if (bulbStatus === eBulbStatus.off && id) {
        // If the bulb status is 'off' and an ID is provided, set the steady flag for active minyans in the specified room
        await MinyanService.setSteadyFlagForActiveMinyans(id);
      }
      if (bulbStatus === eBulbStatus.blink) {
        // If the bulb status is 'blink', update the bulb status to blink with the specified color in the specified room
        await RoomService.updateBulbStatusToBlink(bulbColor, id);
      } else {
        // For any other bulb status, update the bulb status with the specified status and color in the specified room
        await RoomService.updateBulbStatus(bulbStatus, bulbColor, id);
      }
      res.send();
    } catch (error) {
      next(error);
    }
  },
};

export default RoomController;
