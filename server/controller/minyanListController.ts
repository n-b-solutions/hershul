import { Request, Response } from "express";
import dayjs from "dayjs";
import MinyanListModel from "../models/minyanListModel";
import { io } from "../socketio";
import mongoose from "mongoose";
import { getQueryDateType, isRoshChodesh } from "../helper/function-minyans";

const MinyanListController = {
  // Get all minyanim
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
        inactiveDates: minyan.inactiveDates, // Include inactiveDates here
      }));

      res.status(200).json(fullMinyanList);
    } catch (error) {
      console.error("Error fetching minyan list:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  getById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).send("Invalid ID format");
      return;
    }
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
        inactiveDates: minyan.inactiveDates, // Include inactiveDates here
      };

      res.status(200).json(fullMinyan);
    } catch (error) {
      console.error(`Error fetching minyan with ID ${id}:`, error);
      res.status(500).send("Internal Server Error");
    }
  },
  getCalendar: async (req: Request, res: Response): Promise<void> => {
    const { date } = req.body;

    try {
      const queryDateType = await getQueryDateType();

      const minyanListByDate = await MinyanListModel.find({
        dateType: "calendar",
        "specificDate.date": date,
      })
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId");
      const minyanListByQueryDateType = await MinyanListModel.find({
        dateType: queryDateType,
      })
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId");
      const combinedMinyanList = [
        ...minyanListByDate,
        ...minyanListByQueryDateType,
      ];

      const fullMinyanList = combinedMinyanList.map((minyan) => ({
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
        id: minyan.id,
        spesificDate: minyan.spesificDate
          ? {
              date: minyan.spesificDate.date,
              isRoutine: minyan.spesificDate.isRoutine,
            }
          : null,
        inactiveDates: minyan.inactiveDates, // Include inactiveDates here
      }));

      res.status(200).json(fullMinyanList);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving data", error });
    }
  },
  getByDateType: async (req: Request, res: Response): Promise<void> => {
    let queryDateType: string;
    try {
      if (req.query.dateType) queryDateType = req.query.dateType.toString();
      else queryDateType = await getQueryDateType();

      const minyanList = await MinyanListModel.find({
        dateType: queryDateType,
      })
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId");
      const filteredMinyanList = minyanList.map((minyan) => ({
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
        id: minyan.id,
        spesificDate: minyan.spesificDate
          ? {
              date: minyan.spesificDate.date,
              isRoutine: minyan.spesificDate.isRoutine,
            }
          : null,
        inactiveDates: minyan.inactiveDates, // Include inactiveDates here
      }));

      res.status(200).json(filteredMinyanList);
    } catch (error) {
      console.error(`Error fetching minyan for :`, error);
      res.status(500).send("Internal Server Error");
    }
  },

  post: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        roomId,
        startDate,
        endDate,
        dateType,
        blink,
        steadyFlag,
        spesificDate,
        inactiveDates,
      } = req.body;

      const newMinyan = new MinyanListModel({
        roomId,
        startDate: { time: startDate, message: null },
        endDate: { time: endDate, message: null },
        blink: { secondsNum: blink, message: null },
        dateType,
        steadyFlag,
        spesificDate,
        inactiveDates,
      });
      await newMinyan.save();

      io.emit("minyanUpdated", await MinyanListModel.find());

      res.status(201).json(newMinyan);
    } catch (error) {
      console.error("Error creating minyan:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  addInactiveDates: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { data } = req.body;
    try {
      // שליפת המניין לפי ID
      const minyan = await MinyanListModel.findById(id);
      if (!minyan) {
        res.status(404).send("Minyan not found");
        return;
      }

      // וידוא שהמערך קיים, ואם לא, יצירה שלו
      if (!minyan.inactiveDates) {
        minyan.inactiveDates = [];
      }

      // הוספת האובייקט החדש למערך inactiveDates
      minyan.inactiveDates.push(data);

      // שמירת הדוקומנט המעודכן
      await minyan.save();

      res.status(200).json(minyan.inactiveDates);
    } catch (error) {
      console.error("Error adding inactive date:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  removeInactiveDates: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { data } = req.body;

    try {
      const minyan = await MinyanListModel.findById(id);
      if (!minyan) {
        res.status(404).send("Minyan not found");
        return;
      }

      if (!minyan.inactiveDates) {
        res.status(400).send("No inactive dates found");
        return;
      }

      minyan.inactiveDates = minyan.inactiveDates.filter(
        (inactiveDate) =>
          !(
            inactiveDate.date.getTime() === new Date(data.date).getTime() &&
            inactiveDate.isRoutine === data.isRoutine
          )
      );

      await minyan.save();

      res.status(200).json(minyan.inactiveDates);
    } catch (error) {
      console.error("Error removing inactive date:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  updateInactiveDate: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { data } = req.body;

    try {
      const minyan = await MinyanListModel.findById(id);
      if (!minyan) {
        res.status(404).send("Minyan not found");
        return;
      }

      if (!minyan.inactiveDates) {
        res.status(400).send("No inactive dates found");
        return;
      }

      const targetDate = new Date(data.date).getTime();
      const inactiveDate = minyan.inactiveDates.find(
        (item) => new Date(item.date).getTime() === targetDate
      );

      if (!inactiveDate) {
        res.status(404).send("Inactive date not found");
        return;
      }

      inactiveDate.isRoutine = data.isRoutine;

      await minyan.save();

      res.status(200).json(minyan.inactiveDates);
    } catch (error) {
      console.error("Error updating inactive date:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  put: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { field, value, internalField } = req.body;
    const fieldForEdit = internalField ? `${field}.${internalField}` : field;
    try {
      const updatedMinyan = await MinyanListModel.findByIdAndUpdate(
        id,
        { [fieldForEdit]: value },
        { new: true, runValidators: true }
      ).populate(`${field}.${internalField}`);
      if (!updatedMinyan) {
        res.status(404).send("Minyan not found");
        return;
      }

      io.emit("minyanUpdated", await MinyanListModel.find());
      res
        .status(200)
        .json(
          internalField
            ? updatedMinyan?.[field]?.[internalField]
            : updatedMinyan?.[field]
        );
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
