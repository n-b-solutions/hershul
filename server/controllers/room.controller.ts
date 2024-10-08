import { Request, Response } from "express";

import RoomService from "../services/room.service";

const RoomController = {
  get: async (req: Request, res: Response): Promise<void> => {
    const result = await RoomService.get();
    res.send(result);
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await RoomService.getById(id);
    res.send(result);
  },

  post: async (req: Request, res: Response): Promise<void> => {
    const result = await RoomService.post(req.body);
    res.send(result);
  },

  put: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { bulbStatus } = req.body;
    const result = await RoomService.put(bulbStatus, id);
    res.send(result);
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await RoomService.delete(id);
    res.send(result);
  },
};

export default RoomController;
