import { Request, Response } from "express";

import MessageService from "../services/message.service";

const MessageRoomController = {
  // Get all messages
  get: async (req: Request, res: Response): Promise<void> => {
    const result = await MessageService.get();
    res.send(result);
  },
  // Get a specific message by its ID
  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await MessageService.getById(id);
    res.send(result);
  },
  // Upload an audio file and create a new message
  post: async (req: Request, res: Response): Promise<void> => {
    const {
      file,
      body: { name, selectedRoom },
    } = req;
    const result = await MessageService.post(selectedRoom, name, file);
    res.send(result);
  },
  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await MessageService.delete(id);
    res.send(result);
  },
};

export default MessageRoomController;
