import express, { Request, Response } from 'express';
import MessageRoomController from '../controller/messageRoomController';

const MessageRoomRouter = express.Router();

MessageRoomRouter.get('/', async (req: Request, res: Response) => {
  MessageRoomController.get(req, res);
});

MessageRoomRouter.get('/:id', (req: Request, res: Response) => {
  MessageRoomController.getById(req, res);
});

MessageRoomRouter.post('/', (req: Request, res: Response) => {
  MessageRoomController.post(req, res);
});

MessageRoomRouter.put('/:id', (req: Request, res: Response) => {
  MessageRoomController.put(req, res);
});

MessageRoomRouter.delete('/:id', (req: Request, res: Response) => {
  MessageRoomController.delete(req, res);
});

export default MessageRoomRouter;
