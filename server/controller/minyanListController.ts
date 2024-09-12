import { Request, Response } from "express";
import dayjs from "dayjs";
import MinyanListModel from "../models/minyanListModel";

const MinyanListController = {
  get: async (req: Request, res: Response): Promise<void> => {
    try {
      // Populate both roomId and messageId for startDate, endDate, and blink
      const minyanList = await MinyanListModel.find()
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId");

      const fullMinyanList = minyanList.map((minyan) => ({
        'startDate': {
          time: minyan.startDate.time,
          message: minyan.startDate.messageId, // populated message details
        },
        'endDate': {
          time: minyan.endDate.time,
          message: minyan.endDate.messageId, // populated message details
        },
        'blink': minyan.blink
          ? {
              secondsNum: minyan.blink.secondsNum,
              message: minyan.blink.messageId, // populated message details
            }
          : null,
        'dateType': minyan.dateType,
        'room': minyan.roomId,
        'steadyFlag': minyan.steadyFlag,
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
        'startDate': {
          time: minyan.startDate.time,
          message: minyan.startDate.messageId, // populated message details
        },
        'endDate': {
          time: minyan.endDate.time,
          message: minyan.endDate.messageId, // populated message details
        },
        'blink': minyan.blink
          ? {
              secondsNum: minyan.blink.secondsNum,
              message: minyan.blink.messageId, // populated message details
            }
          : null,
        'dateType': minyan.dateType,
        'room': minyan.roomId,
        'steadyFlag': minyan.steadyFlag,
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
        .filter((minyan) => minyan.dateType === dateType)
        .map((minyan) => ({
          'startDate': {
            time: minyan.startDate.time,
            message: minyan.startDate.messageId, // populated message details
          },
          'endDate': {
            time: minyan.endDate.time,
            message: minyan.endDate.messageId, // populated message details
          },
          'blink': minyan.blink
            ? {
                secondsNum: minyan.blink.secondsNum,
                message: minyan.blink.messageId, // populated message details
              }
            : null,
          'dateType': minyan.dateType,
          'room': minyan.roomId,
        }));

      if (filteredMinyanList.length > 0) {
        res.status(200).json(filteredMinyanList);
      } else {
        res.status(400).send(`Minyan list for ${dateType} not found`);
      }
    } catch (error) {
      console.error(`Error fetching minyan for ${dateType}:`, error);
      res.status(500).send("Internal Server Error");
    }
  },
  
  // Other methods (post, put, delete) remain unchanged
};

export default MinyanListController;
