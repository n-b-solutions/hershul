import { Request, Response, NextFunction } from "express";
import RoomService from "../services/room.service";

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

  create: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await RoomService.create(req.body);
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
      const { bulbStatus } = req.body;
      const result = await RoomService.updateBulbStatus(bulbStatus, id);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  delete: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      await RoomService.delete(id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
};

export default RoomController;
