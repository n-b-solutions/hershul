import { SchemaTypes, Types } from "mongoose";

import MinyanModel from "../models/minyan.model";
import { io } from "../socketio";
import {
  eDateType,
  MinyanType,
  NewMinyanType,
  EditMinyanValueType,
} from "../../lib/types/minyan.type";
import { isRoshHodesh } from "../helpers/time.helper";
import { ApiError } from "../../lib/utils/api-error.util";
import { convertMinyanDocument } from "../utils/convert-document.util";
import { MinyanDocument } from "../types/minyan.type";
import { CountType } from "../../lib/types/metadata.type";

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

  getByDateType: async (
    dateType?: eDateType
  ): Promise<MinyanType[] | ApiError> => {
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

  // TODO: change return type to object (cause bugs)
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
  }: NewMinyanType): Promise<MinyanType | ApiError> => {
    try {
      const newMinyan: Omit<MinyanDocument, "id"> = {
        roomId: new SchemaTypes.ObjectId(roomId),
        startDate: { time: startTime },
        endDate: { time: endTime },
        ...(blinkNum ? { blink: { secondsNum: blinkNum } } : {}),
        dateType,
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

  put: async (
    field: string,
    internalField: string,
    value: any,
    id?: string
  ): Promise<EditMinyanValueType | ApiError> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        return new ApiError(400, "Invalid ID format");
      }
      const fieldForEdit = internalField ? `${field}.${internalField}` : field;
      const updatedMinyan = await MinyanModel.findByIdAndUpdate(
        id,
        { [fieldForEdit]: value },
        { new: true, runValidators: true }
      ).populate(`${field}.${internalField}`);
      if (!updatedMinyan) {
        return new ApiError(404, "Minyan not found");
      }
      // TODO: fix to send the new minyan only
      io.emit("minyanUpdated", await MinyanModel.find());
      return internalField
        ? updatedMinyan?.[field]?.[internalField]
        : updatedMinyan?.[field];
    } catch (error) {
      console.error(`Error updating minyan with ID ${id}:`, error);
      return new ApiError(500, error);
    }
  },

  delete: async (id?: string): Promise<void | ApiError> => {
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
    } catch (error) {
      console.error(`Error deleting minyan with ID ${id}:`, error);
      return new ApiError(500, error);
    }
  },
};

export default MinyanService;
