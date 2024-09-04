import { Request, Response } from "express";
import dayjs from "dayjs";
import MinyanListModel from "../models/minyanListModel";

const MinyanListController = {
  get: async (req: Request, res: Response): Promise<void> => {
    try {
      const minyanList = await MinyanListModel.find();
      res.status(200).json(minyanList);
    } catch (error) {
      console.error("Error fetching minyan list:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const minyan = await MinyanListModel.findById(id);
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
      const minyanList = await MinyanListModel.find();
      const minyamListByfilter = res
        .status(200)
        .json(minyanList?.filter((minyan) => minyan.dateType === dateType));
      minyamListByfilter
        ? minyamListByfilter
        : res.status(400).send(`Minyan list for ${dateType} not found`);
    } catch (error) {
      console.error(`Error fetching minyan for ${dateType}:`, error);
      res.status(500).send("Internal Server Error");
    }
  },

  post: async (req: Request, res: Response): Promise<void> => {
    try {
      const { room, announcement, messages, startDate } = req.body;
      const newMinyan = new MinyanListModel({
        room,
        announcement,
        messages,
        startDate: dayjs(startDate).toDate(),
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
    try {
      const updatedMinyan = await MinyanListModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedMinyan) {
        res.status(404).send("Minyan not found");
        return;
      }
      res.status(200).json(updatedMinyan);
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
