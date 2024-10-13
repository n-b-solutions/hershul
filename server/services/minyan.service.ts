import { Types } from "mongoose";
import { ObjectId } from "mongodb";

import MinyanModel from "../models/minyan.model";
import { io } from "../socketio";
import {
  eDateType,
  EditedType,
  MinyanType,
  NewMinyanType,
  SpecificDateType,
} from "../../lib/types/minyan.type";
import { isRoshHodesh } from "../helpers/time.helper";
import { ApiError } from "../../lib/utils/api-error.util";
import { convertMinyanDocument } from "../utils/convert-document.util";
import { MinyanDocument } from "../types/minyan.type";
import { CountType, IdType } from "../../lib/types/metadata.type";
import { getQueryDateType } from "../helper/function-minyans";

const MinyanService = {
  get: async (): Promise<MinyanType[] | ApiError> => {
    try {
      const minyans = await MinyanModel.find()
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId");

      return minyans.map(convertMinyanDocument);
    } catch (error) {
      console.error("Error fetching minyan list:", error);
      return new ApiError(500, error);
    }
  },

  getCalendar: async (date?: Date): Promise<MinyanType[] | ApiError> => {
    try {
      if (!date || !(date instanceof Date)) {
        return new ApiError(400, "Invalid ID format");
      }
      const queryDateType = await getQueryDateType(date);
      const startOfDay = new Date(date).setHours(0, 0, 0, 0); // start of day;
      const endOfDay = new Date(date).setHours(23, 59, 59, 999); // end of day
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
        ],
      })
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId")
        .lean(true);
      return minyans.map(convertMinyanDocument);
    } catch (error) {
      return new ApiError(500, error);
    }
  },

  getByDateType: async (
    dateType?: eDateType
  ): Promise<MinyanType[] | ApiError> => {
    // TODO: use getQueryDateType function
    let queryDateType: string;

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
    try {
      if (dateType) queryDateType = dateType;
      else {
        // Check if today is Rosh Hodesh
        const roshHodesh = await isRoshHodesh();
        if (roshHodesh) {
          queryDateType = eDateType.roshHodesh;
        } else {
          // Determine default dateType based on the day of the week
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
            case 6: //Saturday
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
      console.error(`Error fetching minyan for :`, error);
      return new ApiError(500, error);
    }
  },

  getById: async (id?: string): Promise<MinyanType | ApiError> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        return new ApiError(400, "Invalid ID format");
      }
      const minyan = await MinyanModel.findById(id)
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId");
      if (!minyan) {
        return new ApiError(404, "Minyan not found");
      }
      return convertMinyanDocument(minyan);
    } catch (error) {
      console.error(`Error fetching minyan with ID ${id}:`, error);
      return new ApiError(500, error);
    }
  },

  getCountMinyanByCategory: async (
    dateType: eDateType
  ): Promise<CountType | ApiError> => {
    try {
      const countMinyans = await MinyanModel.countDocuments({
        dateType,
      });
      return { count: countMinyans ?? 0 };
    } catch (error) {
      console.error(`Error fetching minyan for :`, error);
      return new ApiError(500, error);
    }
  },

  post: async ({
    roomId,
    startTime,
    endTime,
    dateType,
    blinkNum,
    specificDate,
  }: NewMinyanType): Promise<MinyanType | ApiError> => {
    try {
      const newMinyan: Omit<MinyanDocument, "id"> = {
        roomId: new ObjectId(roomId),
        startDate: { time: startTime },
        endDate: { time: endTime },
        ...(blinkNum ? { blink: { secondsNum: blinkNum } } : {}),
        dateType,
        specificDate,
      };
      const minyanRecord = await MinyanModel.create(newMinyan);
      // TODO: fix to send the new minyan only
      io.emit("minyanUpdated", await MinyanModel.find());

      return convertMinyanDocument({ ...newMinyan, id: minyanRecord.id });
    } catch (error) {
      console.error("Error creating minyan:", error);
      return new ApiError(500, error);
    }
  },

  postDuplicateMinyanByCategory: async (
    duplicateFromDateType: eDateType,
    currentDateType: eDateType
  ): Promise<MinyanType[] | ApiError> => {
    try {
      const minyansToDuplicateFrom = await MinyanModel.find({
        dateType: duplicateFromDateType,
      });
      const duplicateMinyansToInsert = minyansToDuplicateFrom.map((minyan) => {
        return { ...minyan, dateType: currentDateType };
      });
      await MinyanModel.insertMany(duplicateMinyansToInsert);
      const duplicateMinyansDocuments = await MinyanModel.find({
        dateType: currentDateType,
      }).populate("roomId");
      return duplicateMinyansDocuments.map(convertMinyanDocument);
    } catch (error) {
      console.error("Error creating minyan:", error);
      return new ApiError(500, error);
    }
  },

  addInactiveDates: async (
    inactiveDate: SpecificDateType,
    id?: string
  ): Promise<SpecificDateType[] | ApiError> => {
    // TODO: refactor this method
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        return new ApiError(400, "Invalid ID format");
      }
      const minyan = await MinyanModel.findById(id);
      if (!minyan) {
        return new ApiError(404, "Minyan not found");
      }

      if (!minyan.inactiveDates) {
        minyan.inactiveDates = [];
      }

      minyan.inactiveDates.push(inactiveDate);

      await minyan.save();

      return minyan.inactiveDates;
    } catch (error) {
      console.error("Error adding inactive date:", error);
      return new ApiError(500, "Internal Server Error");
    }
  },

  removeInactiveDates: async (
    date: Date,
    id?: string
  ): Promise<SpecificDateType[] | ApiError> => {
    // TODO: refactor this method
    if (!id || !Types.ObjectId.isValid(id)) {
      return new ApiError(400, "Invalid ID format");
    }

    if (!date || !(date instanceof Date)) {
      return new ApiError(400, "Invalid date format");
    }

    try {
      const minyan = await MinyanModel.findById(id);
      if (!minyan) {
        return new ApiError(404, "Minyan not found");
      }

      if (!minyan.inactiveDates) {
        return new ApiError(400, "No inactive dates found");
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
      return new ApiError(500, "Internal Server Error");
    }
  },

  updateInactiveDate: async (
    date: Date,
    isRoutine: boolean,
    id?: string
  ): Promise<SpecificDateType[] | ApiError> => {
    // TODO: refactor this method
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        return new ApiError(400, "Invalid ID format");
      }

      const minyan = await MinyanModel.findById(id);
      if (!minyan) {
        return new ApiError(404, "Minyan not found");
      }

      if (!minyan.inactiveDates) {
        return new ApiError(400, "No inactive dates found");
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
        return new ApiError(404, "Inactive date not found");
      }

      inactiveDate.isRoutine = isRoutine;

      await minyan.save();

      return minyan.inactiveDates;
    } catch (error) {
      console.error("Error updating inactive date:", error);
      return new ApiError(500, "Internal Server Error");
    }
  },

  put: async (
    field: string,
    internalField: string,
    value: any,
    id?: string
  ): Promise<EditedType | ApiError> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        return new ApiError(400, "Invalid ID format");
      }
      const fieldForEdit = internalField ? `${field}.${internalField}` : field;
      const updatedMinyan = await MinyanModel.findByIdAndUpdate(
        id,
        { [fieldForEdit]: value },
        { new: true, runValidators: true }
      ).populate(internalField ? `${field}.${internalField}` : "");
      if (!updatedMinyan) {
        return new ApiError(404, "Minyan not found");
      }
      // TODO: fix to send the new minyan only
      io.emit("minyanUpdated", await MinyanModel.find());
      return {
        editedValue: internalField
          ? updatedMinyan?.[field]?.[internalField]
          : updatedMinyan?.[field],
      };
    } catch (error) {
      console.error(`Error updating minyan with ID ${id}:`, error);
      return new ApiError(500, error);
    }
  },

  delete: async (id?: string): Promise<IdType | ApiError> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        return new ApiError(400, "Invalid ID format");
      }
      const deletedMinyan = await MinyanModel.findByIdAndDelete(id);
      if (!deletedMinyan) {
        return new ApiError(404, "Minyan not found");
      }
      // TODO: fix to send the new minyan only
      io.emit("minyanUpdated", await MinyanModel.find());
      return { id: deletedMinyan._id?.toString() };
    } catch (error) {
      console.error(`Error deleting minyan with ID ${id}:`, error);
      return new ApiError(500, error);
    }
  },
};

export default MinyanService;
