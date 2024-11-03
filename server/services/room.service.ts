import { Types } from "mongoose";
import RoomModel from "../models/room.model";
import { ApiError } from "../../lib/utils/api-error.util";
import { eBulbStatus, RoomType } from "../../lib/types/room.type";
import { convertRoomDocument } from "../utils/convert-document.util";
import ControlByWebService from "./control-by-web.service";
import { startPolling } from "./polling.service";

const pollingInterval = 5000; // Poll every 5 seconds

const roomCache: { [id: string]: RoomType & { ipAddress: string } } = {};

const RoomService = {
  get: async (): Promise<RoomType[]> => {
    try {
      if (Object.keys(roomCache).length === 0) {
        const rooms = await RoomModel.find().lean(true);
        rooms.forEach((room) => {
          roomCache[room._id.toString()] = room;
          // Start polling for the room's ControlByWeb device
          if (room.ipAddress) {
            startPolling(room.ipAddress, pollingInterval);
          }
        });
      }
      return Object.values(roomCache).map(convertRoomDocument);
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
      if (!roomCache[id]) {
        const room = await RoomModel.findById(id).lean(true);
        if (!room) {
          throw new ApiError(404, "Room not found");
        }
        roomCache[id] = room;
      }
      return convertRoomDocument(roomCache[id]);
    } catch (error) {
      console.error(`Error fetching room with ID ${id}:`, error);
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
      const ipAddress = roomCache[id]?.ipAddress;
      await ControlByWebService.updateUsingControlByWeb(ipAddress, bulbStatus);
      roomCache[id].bulbStatus = bulbStatus;
      return convertRoomDocument(roomCache[id]);
    } catch (error) {
      console.error(`Error updating room with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },
};

export default RoomService;
