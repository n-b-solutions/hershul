import { Request, Response } from "express";
import RoomStatusModel from "../models/roomStatusModel";
import MinyanListModel from "../models/minyanListModel";

const RoomStatusController = {
  get: async (req: Request, res: Response): Promise<void> => {
    try {
      const statusRooms = await RoomStatusModel.find();
      if (!statusRooms.length) {
        res.status(404).send("Rooms not found");
        return;
      }
      res.status(200).json(statusRooms);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const room = await RoomStatusModel.findById(id);

      if (!room) {
        res.status(404).send("Room not found");
        return;
      }
      res.status(200).json(room);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  },

  post: async (req: Request, res: Response): Promise<void> => {
    try {
      const newRoom = new RoomStatusModel(req.body);
      await newRoom.save();
      res.status(201).json(newRoom);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  },

  put: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const room = await RoomStatusModel.findById(id);
      const now = new Date();
      const minyans = await MinyanListModel.find({ room: room?.nameRoom });

      if (!room) {
        res.status(404).send("Room not found");
        return;
      }
      let activeMinyan = minyans.find(
        (minyan) => now >= minyan.startDate.time && now <= minyan.endDate.time
      );
      console.log(activeMinyan);

      if (activeMinyan) {
        activeMinyan.steadyFlag = true;
        await activeMinyan.save();
      }
      room.status = status;
      await room.save();

      res.status(200).json(room);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedRoom = await RoomStatusModel.findByIdAndDelete(id);

      if (!deletedRoom) {
        res.status(404).send("Room not found");
        return;
      }
      res.status(200).send("Resource deleted");
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  },
};

export default RoomStatusController;
