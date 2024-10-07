import express, { Request, Response } from "express";
import RoomStatusController from "../controllers/room.controller";

const RoomStatusRouter = express.Router();

RoomStatusRouter.get("/", (req: Request, res: Response) => {
  RoomStatusController.get(req, res);
});
RoomStatusRouter.get('/:id', (req: Request, res: Response) => {
    RoomStatusController.getById(req, res);
  });
  
  RoomStatusRouter.post('/', (req: Request, res: Response) => {
    RoomStatusController.post(req, res);
  });
  
  RoomStatusRouter.put('/:id', (req: Request, res: Response) => {
    RoomStatusController.put(req, res);
  });
  
  RoomStatusRouter.delete('/:id', (req: Request, res: Response) => {
    RoomStatusController.delete(req, res);
  });
  
export default RoomStatusRouter;
