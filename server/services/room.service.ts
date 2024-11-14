import { Types } from "mongoose";
import RoomModel from "../models/room.model";
import { ApiError } from "../../lib/utils/api-error.util";
import { eBulbStatus, eBulbColor, RoomType } from "../../lib/types/room.type";
import { convertRoomDocumentToServerType } from "../utils/convert-document.util";
import { convertRoomToClient } from "../utils/convert-room.util";
import ControlByWebService from "./control-by-web.service";
import { startPolling } from "./polling.service";
import { RoomServerType } from "../types/room.type";
import { io } from "../socketio"; // Import the socket instance

const pollingInterval = 1000; // Poll every second

const blinkDuration = 10; // seconds

const roomCache: { [id: string]: RoomServerType } = {};

const RoomService = {
  get: async (): Promise<RoomType[]> => {
    try {
      if (Object.keys(roomCache).length === 0) {
        const rooms = await RoomModel.find().lean(true);
        rooms.forEach((room) => {
          roomCache[room._id.toString()] =
            convertRoomDocumentToServerType(room);
          // Start polling for the room's ControlByWeb device
          if (room.ipAddress) {
            startPolling(room.ipAddress, pollingInterval);
          }
        });
      }
      return Object.values(roomCache).map(convertRoomToClient);
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
        roomCache[id] = convertRoomDocumentToServerType(room);
      }
      return convertRoomToClient(roomCache[id]);
    } catch (error) {
      console.error(`Error fetching room with ID ${id}:`, error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  updateBulbStatus: async (
    bulbStatus: eBulbStatus,
    bulbColor?: eBulbColor,
    id?: string
  ): Promise<RoomType> => {
    try {
      if (!id || !Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ID format");
      }

      if (!roomCache[id]) {
        const room = await RoomModel.findById(id).lean(true);
        if (!room) {
          throw new ApiError(404, "Room not found");
        }
        roomCache[id] = convertRoomDocumentToServerType(room);
      }

      // Check if the status or color has changed
      if (
        bulbStatus === eBulbStatus.blink ||
        roomCache[id].bulbStatus !== bulbStatus ||
        roomCache[id].bulbColor !== bulbColor
      ) {
        const ipAddress = roomCache[id]?.ipAddress;
        await ControlByWebService.updateUsingControlByWeb(
          ipAddress,
          bulbStatus,
          bulbColor
        );
      }

      return convertRoomToClient(roomCache[id]);
    } catch (error) {
      console.error(
        `Error updating room with ID ${id}:`,
        (error as Error)?.message
      );
      throw new ApiError(500, (error as Error).message);
    }
  },

  updateBulbStatusToBlink: async (
    bulbColor?: eBulbColor,
    id?: string
  ): Promise<void> => {
    try {
      await RoomService.updateBulbStatus(eBulbStatus.blink, bulbColor, id);

      const intervalId = setInterval(async () => {
        await RoomService.updateBulbStatus(eBulbStatus.blink, bulbColor, id);
      }, 2000);

      setTimeout(async () => {
        clearInterval(intervalId);
        await RoomService.updateBulbStatus(eBulbStatus.off, bulbColor, id);
      }, blinkDuration * 1000);
    } catch (error) {
      console.error("Error updating bulb status to blink:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },

  updateFromControlByWeb: async (
    ipAddress: string,
    bulbStatus: eBulbStatus,
    bulbColor = eBulbColor.white
  ): Promise<RoomType> => {
    try {
      let room = Object.values(roomCache).find(
        (room) => room.ipAddress === ipAddress
      );

      if (!room) {
        const roomDoc = await RoomModel.findOne({ ipAddress }).lean(true);
        if (!roomDoc) {
          throw new ApiError(404, "Room not found");
        }
        room = convertRoomDocumentToServerType(roomDoc);
        roomCache[room.id] = room;
      }
      const roomId = room.id;
      // Check if the status or color has changed
      if (
        roomCache[roomId]!.bulbStatus !== bulbStatus ||
        roomCache[roomId]!.bulbColor !== bulbColor
      ) {
        roomCache[roomId]!.bulbStatus = bulbStatus;
        roomCache[roomId]!.bulbColor = bulbColor;

        // Emit the update via socket
        io.emit("bulbStatusUpdated", {
          roomId,
          bulbStatus,
          bulbColor,
        });
      }

      return convertRoomToClient(roomCache[roomId]!);
    } catch (error) {
      console.error(
        `Error updating room from ControlByWeb with IP ${ipAddress}:`,
        error
      );
      throw new ApiError(500, (error as Error).message);
    }
  },

  updateAllRoomsToOffStatus: async (): Promise<void> => {
    try {
      const rooms = await RoomService.get();
      for (const room of rooms) {
        if (room.bulbStatus !== eBulbStatus.off) {
          await RoomService.updateBulbStatus(
            eBulbStatus.off,
            undefined,
            room.id
          );
        }
      }
      console.log("All room statuses have been set to 'off'!");
    } catch (error) {
      console.error("Error updating all rooms to 'off' status:", error);
      throw new ApiError(500, (error as Error).message);
    }
  },
};

export default RoomService;
