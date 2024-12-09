import { Types } from "mongoose";
import { ObjectId } from "mongodb";
import MinyanModel from "../models/minyan.model";
import { io } from "../socketio";
import {
  eDateType,
  EditedType,
  eMinyanType,
  MinyanType,
  NewMinyanType,
  SpecificDateType,
} from "../../lib/types/minyan.type";
import { isRoshHodesh } from "../helpers/time.helper";
import { ApiError } from "../../lib/utils/api-error.util";
import { convertMinyanDocument } from "../utils/convert-document.util";
import { CountType, IdType } from "../../lib/types/metadata.type";
import {
  getMongoConditionForActiveMinyansByDate,
  getQueryDateType,
  getRoshChodeshCond,
} from "../helpers/minyan.helper";
import ScheduleService from "./schedule.service";
import { HDate } from "@hebcal/core";
import { convertToHebrewDayAndMonth } from "../utils/convert-date.util";

const MinyanService = {
  get: async (): Promise<MinyanType[]> => {
    try {
      const minyans = await MinyanModel.find()
        .lean(true)
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId");

      return minyans.map(convertMinyanDocument);
    } catch (error) {
      console.error("Error fetching minyan list:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  getCalendar: async (date?: Date): Promise<MinyanType[]> => {
    try {
      if (!date || !(date instanceof Date)) {
        throw new ApiError(400, "Invalid date format");
      }
      const queryDateType = await getQueryDateType(date);
      const startOfDay = new Date(date).setHours(0, 0, 0, 0); // start of day;
      const endOfDay = new Date(date).setHours(23, 59, 59, 999); // end of day

      const hDate = new HDate(date);
      const hebrewDay = hDate.getDate();
      const hebrewMonth = hDate.getMonthName();

      const roshChodeshCond = await getRoshChodeshCond(
        queryDateType,
        eMinyanType.minyan,
        date
      );
      const minyans = await MinyanModel.find({
        $or: [
          { dateType: queryDateType },
          {
            dateType: eDateType.calendar,
            "specificDate.date": {
              $gte: startOfDay,
              $lt: endOfDay,
            },
          },
          {
            "specificDate.isRoutine": true,
            $expr: {
              $and: [
                { $eq: ["$specificDate.hebrewDayMonth", hebrewDay.toString()] },
                { $eq: ["$specificDate.hebrewMonth", hebrewMonth] },
              ],
            },
          },
          ...(Object.keys(roshChodeshCond).length > 0 ? [roshChodeshCond] : []),
        ],
      })
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId")
        .lean(true);
      return minyans.map(convertMinyanDocument);
    } catch (error) {
      console.error("Error fetching calendar minyan list:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  getByDateType: async (dateType?: eDateType): Promise<MinyanType[]> => {
    let queryDateType: string;

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
    try {
      if (dateType) queryDateType = dateType;
      else {
        const roshHodesh = await isRoshHodesh(today);
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
      const minyans = await MinyanModel.find({
        dateType: queryDateType,
      })
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId")
        .lean(true);
      return minyans.map(convertMinyanDocument);
    } catch (error) {
      console.error(`Error fetching minyan for date type ${dateType}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  getByDate: async (selectedDate: Date): Promise<MinyanType[]> => {
    const conditions = await getMongoConditionForActiveMinyansByDate(
      selectedDate,
      eMinyanType.minyan
    );
    const minyansDocs = await MinyanModel.find(conditions)
      .populate("roomId")
      .populate("startDate.messageId")
      .populate("endDate.messageId")
      .populate("blink.messageId")
      .lean(true);
    return minyansDocs.map(convertMinyanDocument);
  },

  getById: async (id?: string): Promise<MinyanType> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const minyan = await MinyanModel.findById(id)
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId");
      if (!minyan) {
        throw new ApiError(404, "Minyan not found");
      }
      return convertMinyanDocument(minyan);
    } catch (error) {
      console.error(`Error fetching minyan with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  getCountMinyanByCalendar: async (selectedDate: Date): Promise<CountType> => {
    try {
      const conditions = await getMongoConditionForActiveMinyansByDate(
        selectedDate,
        eMinyanType.minyan
      );
      const countMinyans = await MinyanModel.countDocuments(conditions);
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
      const countMinyans = await MinyanModel.countDocuments({
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
    startTime,
    endTime,
    dateType,
    blinkNum,
    specificDate,
  }: NewMinyanType): Promise<MinyanType> => {
    try {
      // Convert strings to Date objects and set seconds to 00
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      startDate.setSeconds(0, 0);
      endDate.setSeconds(0, 0);

      const convertedSpecificDate = specificDate
        ? convertToHebrewDayAndMonth(new Date(specificDate.date))
        : undefined;
      const newMinyan = {
        roomId: new ObjectId(roomId),
        startDate: { time: startDate },
        endDate: { time: endDate },
        ...(blinkNum ? { blink: { secondsNum: blinkNum } } : {}),
        dateType,
        specificDate: convertedSpecificDate,
      };
      const minyanRecord = await MinyanModel.create(newMinyan);

      const newMinyanDocument = await MinyanModel.findById(minyanRecord.id)
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId")
        .lean(true);

      const minyans = await ScheduleService.get();
      io.emit("minyanUpdated", minyans);

      return convertMinyanDocument(newMinyanDocument!);
    } catch (error) {
      console.error("Error creating minyan:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  postDuplicateMinyanByCategory: async (
    duplicateFromDateType: eDateType,
    currentDateType: eDateType,
    selectedDate?: Date,
    currentSelectedDate?: Date
  ): Promise<MinyanType[]> => {
    try {
      let cond: any = {
        dateType: duplicateFromDateType,
      };
      if (selectedDate && duplicateFromDateType === eDateType.calendar) {
        cond = {
          ...(await getMongoConditionForActiveMinyansByDate(
            new Date(selectedDate),
            eMinyanType.minyan
          )),
        };
      }
      const minyansToDuplicateFrom = await MinyanModel.find(cond);

      const duplicateMinyansToInsert = minyansToDuplicateFrom.map((minyan) => {
        return {
          roomId: minyan.roomId,
          startDate: minyan.startDate,
          endDate: minyan.endDate,
          blink: minyan.blink,
          dateType: currentDateType,
          specificDate: currentSelectedDate && { date: currentSelectedDate },
        };
      });

      const insertData = await MinyanModel.insertMany(duplicateMinyansToInsert);
      const ids = insertData.map((minyan) => minyan._id);
      const duplicateMinyansDocuments = await MinyanModel.find({
        _id: { $in: ids },
      })
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId")
        .lean(true);

      return duplicateMinyansDocuments.map(convertMinyanDocument);
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
      const minyan = await MinyanModel.findById(id);
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
      const minyan = await MinyanModel.findById(id);
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

      const minyan = await MinyanModel.findById(id);
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

  setSteadyFlagForActiveMinyans: async (roomId: string): Promise<void> => {
    try {
      const now = new Date();
      const conditions = await getMongoConditionForActiveMinyansByDate(
        now,
        eMinyanType.minyan
      );
      const timeCond = {
        "startDate.time": { $lte: now },
        "endDate.time": { $gte: now },
      };
      const queryConditions = {
        ...conditions,
        roomId: roomId,
        ...timeCond,
      };

      await MinyanModel.updateMany(queryConditions, {
        $set: { steadyFlag: true },
      });
    } catch (error) {
      console.error("Error setting steadyFlag for active minyans:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  put: async (
    field: string,
    internalField: string,
    value: any,
    id?: string
  ): Promise<EditedType> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }

      // Convert strings to Date objects and set seconds to 00
      if (
        field === "endDate" &&
        internalField === "time" &&
        typeof value === "string"
      ) {
        value = new Date(value);
        value.setSeconds(0, 0);
      }
      if (
        field === "startDate" &&
        internalField === "time" &&
        typeof value === "string"
      ) {
        value = new Date(value);
        value.setSeconds(0, 0);
      }

      const fieldForEdit = internalField ? `${field}.${internalField}` : field;
      const updatedMinyan = await MinyanModel.findByIdAndUpdate(
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

  delete: async (id?: string): Promise<IdType> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const deletedMinyan = await MinyanModel.findByIdAndDelete(id);
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

  deleteExpiredMinyan: async () => {
    try {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const result = await MinyanModel.deleteMany({
        "specificDate.isRoutine": false,
        "specificDate.date": { $lt: now },
      });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting expired minyan:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },
};

export default MinyanService;
