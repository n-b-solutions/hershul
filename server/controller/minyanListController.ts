import { Request, Response } from "express";
import dayjs from "dayjs";
import MinyanListModel from "../models/minyanListModel";

const MinyanListController = {
  get: async (req: Request, res: Response): Promise<void> => {
    try {
      const minyanList = await MinyanListModel.find().populate("roomId");
      const fullMinyanList = minyanList.map((minyan) => {
        return {
          announcement: minyan.announcement,
          messages: minyan.messages,
          startDate: minyan.startDate,
          endDate: minyan.endDate,
          dateType: minyan.dateType,
          blink: minyan.blink,
          room: minyan.roomId,
        };
        return {
          announcement: minyan.announcement,
          messages: minyan.messages,
          startDate: minyan.startDate,
          endDate: minyan.endDate,
          dateType: minyan.dateType,
          blink: minyan.blink,
          room: minyan.roomId,
        };
      });
      res.status(200).json(fullMinyanList);
    } catch (error) {
      console.error("Error fetching minyan list:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const minyan = await MinyanListModel.findById(id).populate("roomId");
      if (!minyan) {
        res.status(404).send("Minyan not found");
        return;
      }
      res.status(200).json(minyan);
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
        // .sort({ startDate: 1 });
      const fullMinyanList = minyanList.map((minyan) => {
        return {
          announcement: minyan.announcement,
          messages: minyan.messages,
          startDate: dayjs(minyan.startDate).format("hh:mm"),
          endDate: dayjs(minyan.endDate).format("hh:mm"),
          dateType: minyan.dateType,
          blink: minyan.blink,
          room: minyan.roomId,
          id: minyan.id,
        };
      });
      if (!fullMinyanList)
        res.status(404).send(`Minyan of ${dateType} not found`);
      res.status(200).json(fullMinyanList);
    } catch (error) {
      console.error(`Error fetching minyan for ${dateType}:`, error);
      res.status(500).send("Internal Server Error");
    }
  },

  post: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        roomId,
        announcement,
        messages,
        startDate,
        endDate,
        dateType,
        blink,
        index,
        steadyFlag,
      } = req.body;
      const newMinyan = new MinyanListModel({
        roomId,
        announcement,
        messages,
        startDate: dayjs(startDate).toDate(),
        endDate: dayjs(endDate).toDate(),
        blink,
        dateType,
        steadyFlag,
      });
      await newMinyan.save();
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
      res.status(200).json({ message: "Minyan deleted", deletedMinyan });
    } catch (error) {
      console.error(`Error deleting minyan with ID ${id}:`, error);
      res.status(500).send("Internal Server Error");
    }
  },
};

export default MinyanListController;
