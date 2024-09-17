import { Request, Response } from "express";
import dayjs from "dayjs";
import MinyanListModel from "../models/minyanListModel";
import { io } from "../socketio";

const MinyanListController = {
  // Get all minyanim (לא צריך לשנות כאן)
  get: async (req: Request, res: Response): Promise<void> => {
    try {
      const minyanList = await MinyanListModel.find()
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId");

      const fullMinyanList = minyanList.map((minyan) => ({
        startDate: {
          time: minyan.startDate.time,
          message: minyan.startDate.messageId,
        },
        endDate: {
          time: minyan.endDate.time,
          message: minyan.endDate.messageId,
        },
        blink: minyan.blink
          ? {
              secondsNum: minyan.blink.secondsNum,
              message: minyan.blink.messageId,
            }
          : null,
        dateType: minyan.dateType,
        room: minyan.roomId,
        steadyFlag: minyan.steadyFlag,
      }));

      res.status(200).json(fullMinyanList);
    } catch (error) {
      console.error("Error fetching minyan list:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const minyan = await MinyanListModel.findById(id)
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId");

      if (!minyan) {
        res.status(404).send("Minyan not found");
        return;
      }

      const fullMinyan = {
        startDate: {
          time: minyan.startDate.time,
          message: minyan.startDate.messageId, // populated message details
        },
        endDate: {
          time: minyan.endDate.time,
          message: minyan.endDate.messageId, // populated message details
        },
        blink: minyan.blink
          ? {
              secondsNum: minyan.blink.secondsNum,
              message: minyan.blink.messageId, // populated message details
            }
          : null,
        dateType: minyan.dateType,
        room: minyan.roomId,
        steadyFlag: minyan.steadyFlag,
      };

      res.status(200).json(fullMinyan);
    } catch (error) {
      console.error(`Error fetching minyan with ID ${id}:`, error);
      res.status(500).send("Internal Server Error");
    }
  },

  getByTypeDate: async (req: Request, res: Response): Promise<void> => {
    const { dateType } = req.params;
    try {
      const minyanList = await MinyanListModel.find({
        dateType: dateType,
      })
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId");

      const filteredMinyanList = minyanList
        .map((minyan) => ({
          startDate: {
            time: minyan.startDate.time,
            message: minyan.startDate.messageId, // populated message details
          },
          endDate: {
            time: minyan.endDate.time,
            message: minyan.endDate.messageId, // populated message details
          },
          blink: minyan.blink
            ? {
                secondsNum: minyan.blink.secondsNum,
                message: minyan.blink.messageId, // populated message details
              }
            : null,
          dateType: minyan.dateType,
          room: minyan.roomId,
          id: minyan._id,
        }));

        res.status(200).json(filteredMinyanList);
  
    } catch (error) {
      console.error(`Error fetching minyan for ${dateType}:`, error);
      res.status(500).send("Internal Server Error");
    }
  },

  post: async (req: Request, res: Response): Promise<void> => {
    try {
      const { roomId, startDate, endDate, dateType, blink, steadyFlag } =
        req.body;
      const newMinyan = new MinyanListModel({
        roomId,
        startDate: { time: startDate, message: null },
        endDate: { time: endDate, message: null },
        blink: { secondsNum: blink, message: null },
        dateType,
        steadyFlag,
      });
      await newMinyan.save();

      io.emit("minyanUpdated", await MinyanListModel.find());

      res.status(201).json(newMinyan);
    } catch (error) {
      console.error("Error creating minyan:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  put: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { fieldForEdit, value } = req.body;
    try {
      const updatedMinyan = await MinyanListModel.findByIdAndUpdate(
        id,
        { [fieldForEdit]: value },
        { new: true, runValidators: true }
      );
      if (!updatedMinyan) {
        res.status(404).send("Minyan not found");
        return;
      }

      io.emit("minyanUpdated", await MinyanListModel.find());

      res.status(200).json(updatedMinyan[fieldForEdit]);
    } catch (error) {
      console.error(`Error updating minyan with ID ${id}:`, error);
      res.status(500).send("Internal Server Error");
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const deletedMinyan = await MinyanListModel.findByIdAndDelete(id);
      if (!deletedMinyan) {
        res.status(404).send("Minyan not found");
        return;
      }

      io.emit("minyanUpdated", await MinyanListModel.find());

      res.status(200).json({ message: "Minyan deleted", deletedMinyan });
    } catch (error) {
      console.error(`Error deleting minyan with ID ${id}:`, error);
      res.status(500).send("Internal Server Error");
    }
  },
};

export default MinyanListController;
