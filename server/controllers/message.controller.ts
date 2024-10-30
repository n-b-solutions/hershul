import { Request, Response, NextFunction } from "express";
import MessageService from "../services/message.service";
import { ApiError } from "../../lib/utils/api-error.util";

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
      const messageData = req.body;
      const file = req.file;
      if (!file) {
        throw new ApiError(400, "Audio file is required");
      }
      const newMessage = await MessageService.create(messageData, file);
      res.status(201).json(newMessage);
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
