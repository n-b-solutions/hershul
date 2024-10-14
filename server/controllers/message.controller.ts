import { Request, Response, NextFunction } from "express";
import MessageService from "../services/message.service";

const MessageController = {
  get: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await MessageService.get();
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
      const result = await MessageService.getById(id);
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
      const result = await MessageService.create(req.body);
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
      const result = await MessageService.update(req.body, id);
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
      await MessageService.delete(id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
};

export default MessageController;
