import { Types } from "mongoose";
import RoomModel from "../models/room.model";
import { ApiError } from "../../lib/utils/api-error.util";
import { eBulbStatus, RoomType } from "../../lib/types/room.type";
import { convertRoomDocument } from "../utils/convert-document.util";
import ControlByWebService from "./control-by-web.service";
import { startPolling } from "./polling.service";
// import { io } from "../socketio";

const RoomService = {
  get: async (): Promise<RoomType[]> => {
    try {
      const rooms = await RoomModel.find().lean(true);
      // Start polling for the room's ControlByWeb device
      rooms.map(({ ipAddress }) => startPolling(ipAddress));
      return rooms.map(convertRoomDocument);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  getById: async (id?: string): Promise<RoomType> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const room = await RoomModel.findById(id);
      if (!room) {
        throw new ApiError(404, "Room not found");
      }
      return convertRoomDocument(room);
    } catch (error) {
      console.error(`Error fetching room with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  create: async (roomData: RoomType): Promise<RoomType> => {
    try {
      const newRoom = await RoomModel.create(roomData);
      return convertRoomDocument(newRoom);
    } catch (error) {
      console.error("Error creating room:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  updateBulbStatus: async (
    bulbStatus: eBulbStatus,
    id?: string
  ): Promise<RoomType> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const updatedRoom = await RoomModel.findByIdAndUpdate(
        id,
        { bulbStatus },
        {
          new: true,
        }
      ).lean(true);
      if (!updatedRoom) {
        throw new ApiError(404, "Room not found");
      }
      await ControlByWebService.updateUsingControlByWeb(
        updatedRoom.ipAddress,
        bulbStatus
      );
      return convertRoomDocument(updatedRoom);
    } catch (error) {
      console.error(`Error updating room with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  updateBulbStatusByIpAddress: async (
    bulbStatus: eBulbStatus,
    ipAddress: string
  ): Promise<RoomType> => {
    try {
      const updatedRoom = await RoomModel.findOneAndUpdate(
        { ipAddress },
        { bulbStatus },
        {
          new: true,
        }
      ).lean(true);
      if (!updatedRoom) {
        throw new ApiError(404, "Room not found");
      }
      // io.emit("bulbStatus", updatedRoom);
      return convertRoomDocument(updatedRoom);
    } catch (error) {
      console.error(`Error updating room with ipAddress ${ipAddress}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  delete: async (id?: string): Promise<void> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const deletedRoom = await RoomModel.findByIdAndDelete(id);
      if (!deletedRoom) {
        throw new ApiError(404, "Room not found");
      }
    } catch (error) {
      console.error(`Error deleting room with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },
};

export default RoomService;
