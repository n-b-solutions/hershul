import express, { Request, Response } from "express";
import RoomController from "../controllers/room.controller";

const RoomRouter = express.Router();

RoomRouter.get("/", (req: Request, res: Response) => {
  RoomController.get(req, res);
});
RoomRouter.get('/:id', (req: Request, res: Response) => {
    RoomController.getById(req, res);
  });
  
  RoomRouter.post('/', (req: Request, res: Response) => {
    RoomController.post(req, res);
  });
  
  RoomRouter.put('/:id', (req: Request, res: Response) => {
    RoomController.put(req, res);
  });
  
  RoomRouter.delete('/:id', (req: Request, res: Response) => {
    RoomController.delete(req, res);
  });
  
export default RoomRouter;
