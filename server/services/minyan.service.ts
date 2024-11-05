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
import { getQueryDateType } from "../helpers/minyan.helper";

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
      const newMinyan: Omit<MinyanDocument, "id"> = {
        roomId: new ObjectId(roomId),
        startDate: { time: startTime },
        endDate: { time: endTime },
        ...(blinkNum ? { blink: { secondsNum: blinkNum } } : {}),
        dateType,
        specificDate,
      };
      const minyanRecord = await MinyanModel.create(newMinyan);

      const newMinyanDocument = await MinyanModel.findById(minyanRecord.id)
        .populate("roomId")
        .populate("startDate.messageId")
        .populate("endDate.messageId")
        .populate("blink.messageId")
        .lean(true);

      io.emit("minyanUpdated", await MinyanModel.find());

      return convertMinyanDocument(newMinyanDocument!);
    } catch (error) {
      console.error("Error creating minyan:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  postDuplicateMinyanByCategory: async (
    duplicateFromDateType: eDateType,
    currentDateType: eDateType
  ): Promise<MinyanType[]> => {
    try {
      const minyansToDuplicateFrom = await MinyanModel.find({
        dateType: duplicateFromDateType,
      });

      const duplicateMinyansToInsert = minyansToDuplicateFrom.map((minyan) => {
        return {
          roomId: minyan.roomId,
          startDate: minyan.startDate,
          endDate: minyan.endDate,
          blink: minyan.blink,
          dateType: currentDateType,
          specificDate: minyan.specificDate,
        };
      });

      await MinyanModel.insertMany(duplicateMinyansToInsert);

      const duplicateMinyansDocuments = await MinyanModel.find({
        dateType: currentDateType,
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
      const fieldForEdit = internalField ? `${field}.${internalField}` : field;
      const updatedMinyan = await MinyanModel.findByIdAndUpdate(
        id,
        { [fieldForEdit]: value },
        { new: true, runValidators: true }
      ).populate(internalField ? `${field}.${internalField}` : "");
      if (!updatedMinyan) {
        throw new ApiError(404, "Minyan not found");
      }
      io.emit("minyanUpdated", await MinyanModel.find());
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
      io.emit("minyanUpdated", await MinyanModel.find());
      return { id: deletedMinyan._id?.toString() };
    } catch (error) {
      console.error(`Error deleting minyan with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },
};

export default MinyanService;
