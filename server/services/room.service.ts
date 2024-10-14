import { Types } from "mongoose";
import RoomModel from "../models/room.model";
import { ApiError } from "../../lib/utils/api-error.util";
import { RoomType } from "../../lib/types/room.type";

const RoomService = {
  get: async (): Promise<RoomType[]> => {
    try {
      const rooms = await RoomModel.find();
      return rooms;
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
      return room;
    } catch (error) {
      console.error(`Error fetching room with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  create: async (roomData: RoomType): Promise<RoomType> => {
    try {
      const newRoom = await RoomModel.create(roomData);
      return newRoom;
    } catch (error) {
      console.error("Error creating room:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  update: async (
    roomData: Partial<RoomType>,
    id?: string
  ): Promise<RoomType> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }
      const updatedRoom = await RoomModel.findByIdAndUpdate(id, roomData, {
        new: true,
      });
      if (!updatedRoom) {
        throw new ApiError(404, "Room not found");
      }
      return updatedRoom;
    } catch (error) {
      console.error(`Error updating room with ID ${id}:`, error);
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
