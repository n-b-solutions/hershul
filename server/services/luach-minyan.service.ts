import { Types } from "mongoose";
import LuachMinyanModel from "../models/luach-minyan.model";
import { io } from "../socketio";
import {
  EditedLuachType,
  LuachMinyanType,
  NewLuachMinyanType,
} from "../../lib/types/luach-minyan.type";
import { ApiError } from "../../lib/utils/api-error.util";
import { convertLuachMinyanDocument } from "../utils/convert-document.util";
import { CountType } from "../../lib/types/metadata.type";
import {
  getMongoConditionForActiveMinyansByDate,
  getQueryDateType,
} from "../helpers/minyan.helper";
import ScheduleService from "./schedule.service";
import { eDateType, SpecificDateType } from "../../lib/types/minyan.type";
import { isRoshHodesh } from "../helpers/time.helper";

const LuachMinyanService = {
  get: async (): Promise<LuachMinyanType[]> => {
    try {
      const minyans = await LuachMinyanModel.find()
        .lean(true)
        .populate("roomId")
        .populate("timeOfDay.messageId")
        .populate("duration.messageId")
        .populate("blink.messageId");
      return minyans.map(convertLuachMinyanDocument);
    } catch (error) {
      console.error("Error fetching minyan list:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  getCalendar: async (date?: Date): Promise<LuachMinyanType[]> => {
    try {
      if (!date || !(date instanceof Date)) {
        throw new ApiError(400, "Invalid date format");
      }
      const queryDateType = await getQueryDateType(date);
      const startOfDay = new Date(date).setHours(0, 0, 0, 0); // start of day;
      const endOfDay = new Date(date).setHours(23, 59, 59, 999); // end of day
      const minyans = await LuachMinyanModel.find({
        $or: [
          { dateType: queryDateType },
          {
            dateType: eDateType.calendar,
            "specificDate.date": {
              $gte: startOfDay,
              $lt: endOfDay,
            },
          },
        ],
      })
        .populate("roomId")
        .populate("timeOfDay.messageId")
        .populate("duration.messageId")
        .populate("blink.messageId")
        .lean(true);
      return minyans.map(convertLuachMinyanDocument);
    } catch (error) {
      console.error("Error fetching calendar minyan list:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  getByDateType: async (dateType?: eDateType): Promise<LuachMinyanType[]> => {
    let queryDateType: string;

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
    try {
      if (dateType) queryDateType = dateType;
      else {
        const roshHodesh = await isRoshHodesh();
        if (roshHodesh) {
          queryDateType = eDateType.roshHodesh;
        } else {
          switch (dayOfWeek) {
            case 0: // Sunday
            case 2: // Tuesday
            case 3: // Thursday
              queryDateType = eDateType.sunday;
              break;
            case 1: // Monday
            case 4: // Wednesday
              queryDateType = eDateType.monday;
              break;
            case 5: // Friday
              queryDateType = eDateType.friday;
              break;
            case 6: // Saturday
              queryDateType = eDateType.saturday;
              break;
            default:
              queryDateType = eDateType.calendar; // Fallback default value
          }
        }
      }
      const minyans = await LuachMinyanModel.find({
        dateType: queryDateType,
      })
        .populate("roomId")
        .populate("timeOfDay.messageId")
        .populate("duration.messageId")
        .populate("blink.messageId")
        .lean(true);
      return minyans.map(convertLuachMinyanDocument);
    } catch (error) {
      console.error(`Error fetching minyan for date type ${dateType}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  getById: async (id?: string): Promise<LuachMinyanType> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const minyan = await LuachMinyanModel.findById(id)
        .populate("roomId")
        .populate("timeOfDay.messageId")
        .populate("duration.messageId")
        .populate("blink.messageId");
      if (!minyan) {
        throw new ApiError(404, "Minyan not found");
      }
      return convertLuachMinyanDocument(minyan);
    } catch (error) {
      console.error(`Error fetching minyan with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  getCountMinyanByCalendar: async (selectedDate: Date): Promise<CountType> => {
    try {
      const conditions = await getMongoConditionForActiveMinyansByDate(
        selectedDate
      );
      const countMinyans = await LuachMinyanModel.countDocuments(conditions);
      return { count: countMinyans ?? 0 };
    } catch (error) {
      console.error(
        `Error fetching minyan count for date type ${selectedDate}:`,
        error
      );
      throw new ApiError(500, (error as Error).message);
    }
  },

  getCountMinyanByCategory: async (dateType: eDateType): Promise<CountType> => {
    try {
      const countMinyans = await LuachMinyanModel.countDocuments({
        dateType,
      });
      return { count: countMinyans ?? 0 };
    } catch (error) {
      console.error(
        `Error fetching minyan count for date type ${dateType}:`,
        error
      );
      throw new ApiError(500, (error as Error).message);
    }
  },

  post: async ({
    roomId,
    timeOfDay,
    relativeTime,
    duration,
    dateType,
    blinkNum,
    specificDate,
  }: NewLuachMinyanType): Promise<LuachMinyanType> => {
    try {
      const newMinyan = new LuachMinyanModel({
        roomId,
        timeOfDay: { value: timeOfDay },
        relativeTime,
        duration: { value: duration },
        dateType,
        blink: blinkNum ? { secondsNum: blinkNum } : undefined,
        specificDate,
      });
      const minyanRecord = await newMinyan.save();

      const newMinyanDocument = await LuachMinyanModel.findById(minyanRecord.id)
        .populate("roomId")
        .populate("timeOfDay.messageId")
        .populate("duration.messageId")
        .populate("blink.messageId")
        .lean(true);

      // const minyans = await ScheduleService.get();
      // io.emit("minyanUpdated", minyans);

      return convertLuachMinyanDocument(newMinyanDocument!);
    } catch (error) {
      console.error("Error creating new minyan:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  update: async (
    id: string,
    updateData: Partial<LuachMinyanType>
  ): Promise<LuachMinyanType> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const updatedMinyan = await LuachMinyanModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate("roomId")
        .populate("timeOfDay.messageId")
        .populate("duration.messageId")
        .populate("blink.messageId");
      if (!updatedMinyan) {
        throw new ApiError(404, "Minyan not found");
      }
      return convertLuachMinyanDocument(updatedMinyan);
    } catch (error) {
      console.error(`Error updating minyan with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  delete: async (id?: string): Promise<{ id: string }> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const deletedMinyan = await LuachMinyanModel.findByIdAndDelete(id);
      if (!deletedMinyan) {
        throw new ApiError(404, "Minyan not found");
      }
      const minyans = await ScheduleService.get();
      io.emit("minyanUpdated", minyans);
      return { id: deletedMinyan._id?.toString() };
    } catch (error) {
      console.error(`Error deleting minyan with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  postDuplicateMinyanByCategory: async (
    duplicateFromDateType: eDateType,
    currentDateType: eDateType,
    selectedDate?: Date,
    currentSelectedDate?: Date
  ): Promise<LuachMinyanType[]> => {
    try {
      let cond: any = {
        dateType: duplicateFromDateType,
      };
      if (selectedDate && duplicateFromDateType === eDateType.calendar) {
        cond = {
          ...(await getMongoConditionForActiveMinyansByDate(
            new Date(selectedDate)
          )),
        };
      }
      const minyansToDuplicateFrom = await LuachMinyanModel.find(cond);

      const duplicateMinyansToInsert = minyansToDuplicateFrom.map((minyan) => {
        return {
          roomId: minyan.roomId,
          timeOfDay: minyan.timeOfDay,
          relativeTime: minyan.relativeTime,
          duration: minyan.duration,
          blink: minyan.blink,
          dateType: currentDateType,
          specificDate: currentSelectedDate && { date: currentSelectedDate },
        };
      });

      const insertedMinyans = await LuachMinyanModel.insertMany(
        duplicateMinyansToInsert
      );
      return insertedMinyans.map(convertLuachMinyanDocument);
    } catch (error) {
      console.error("Error duplicating minyan:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  addInactiveDates: async (
    inactiveDate: SpecificDateType,
    id?: string
  ): Promise<SpecificDateType[]> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const minyan = await LuachMinyanModel.findById(id);
      if (!minyan) {
        throw new ApiError(404, "Minyan not found");
      }

      if (!minyan.inactiveDates) {
        minyan.inactiveDates = [];
      }

      minyan.inactiveDates.push(inactiveDate);

      await minyan.save();

      return minyan.inactiveDates;
    } catch (error) {
      console.error("Error adding inactive date:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  removeInactiveDates: async (
    date: Date,
    id?: string
  ): Promise<SpecificDateType[]> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }

      if (!date || !(new Date(date) instanceof Date)) {
        throw new ApiError(400, "Invalid date format");
      }
      const minyan = await LuachMinyanModel.findById(id);
      if (!minyan) {
        throw new ApiError(404, "Minyan not found");
      }

      if (!minyan.inactiveDates) {
        throw new ApiError(400, "No inactive dates found");
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      minyan.inactiveDates = minyan.inactiveDates.filter(
        (inactiveDate) =>
          !(
            new Date(inactiveDate.date) >= startOfDay &&
            new Date(inactiveDate.date) <= endOfDay
          )
      );

      await minyan.save();

      return minyan.inactiveDates;
    } catch (error) {
      console.error("Error removing inactive date:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  updateInactiveDate: async (
    date: Date,
    isRoutine: boolean,
    id?: string
  ): Promise<SpecificDateType[]> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }

      const minyan = await LuachMinyanModel.findById(id);
      if (!minyan) {
        throw new ApiError(404, "Minyan not found");
      }

      if (!minyan.inactiveDates) {
        throw new ApiError(400, "No inactive dates found");
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const inactiveDate = minyan.inactiveDates.find(
        (item) =>
          new Date(item.date) >= startOfDay && new Date(item.date) <= endOfDay
      );

      if (!inactiveDate) {
        throw new ApiError(404, "Inactive date not found");
      }

      inactiveDate.isRoutine = isRoutine;

      await minyan.save();

      return minyan.inactiveDates;
    } catch (error) {
      console.error("Error updating inactive date:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  put: async (
    field: string,
    internalField: string,
    value: any,
    id?: string
  ): Promise<EditedLuachType> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const fieldForEdit = internalField ? `${field}.${internalField}` : field;
      const updatedMinyan = await LuachMinyanModel.findByIdAndUpdate(
        id,
        { [fieldForEdit]: value },
        { new: true, runValidators: true }
      ).populate(internalField ? `${field}.${internalField}` : "");
      if (!updatedMinyan) {
        throw new ApiError(404, "Minyan not found");
      }
      const minyans = await ScheduleService.get();
      io.emit("minyanUpdated", minyans);
      return {
        editedValue: internalField
          ? updatedMinyan?.[field]?.[internalField]
          : updatedMinyan?.[field],
      };
    } catch (error) {
      console.error(`Error updating minyan with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },
};

export default LuachMinyanService;
