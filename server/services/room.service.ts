import RoomModel from "../models/room.model";
import MinyanListModel from "../models/minyanListModel";
import { eBulbStatus, RoomType } from "../../lib/types/room.type";
import { ApiError } from "../../lib/utils/api-error.util";
import { getActiveMinyans } from "../helpers/minyan.helper";
import { convertRoomDocument } from "../utils/convert-document.util";

const RoomService = {
  get: async (): Promise<RoomType[] | ApiError> => {
    try {
      const rooms = await RoomModel.find();
      if (!rooms.length) {
        return new ApiError(404, "Rooms not found");
      }
      return rooms;
    } catch (error) {
      return new ApiError(500, error);
    }
  },

  getById: async (id?: string): Promise<RoomType | ApiError> => {
    try {
      const room = await RoomModel.findById(id);
      if (!room) {
        return new ApiError(404, "Room not found");
      }
      return room;
    } catch (error) {
      return new ApiError(500, error);
    }
  },

  post: async (newRoom: RoomType): Promise<RoomType | ApiError> => {
    try {
      const newRoomRecord = await RoomModel.create(newRoom);
      return { ...newRoom, id: newRoomRecord.id };
    } catch (error) {
      return new ApiError(500, error);
    }
  },

  put: async (
    bulbStatus: eBulbStatus,
    id?: string
  ): Promise<RoomType | ApiError> => {
    try {
      if (!id) {
        return new ApiError(404, "Not Found");
      }
      const minyansInRoom = await MinyanListModel.find({ roomId: id });

      const activeMinyansInRoomIds = getActiveMinyans(minyansInRoom).map(
        (minyan) => minyan.id
      );
      await MinyanListModel.updateMany(
        { _id: { $in: activeMinyansInRoomIds } },
        { $set: { steadyFlag: true } }
      );
      const updatedRoom = await RoomModel.findByIdAndUpdate(id, {
        $set: { bulbStatus },
      });
      if (!updatedRoom) {
        return new ApiError(404, "Room not found");
      }
      return convertRoomDocument(updatedRoom);
    } catch (error) {
      console.error(error);
      return new ApiError(500, error);
    }
  },

  delete: async (id?: string): Promise<void | ApiError> => {
    try {
      if (!id) {
        return new ApiError(404, "Not Found");
      }
      const deletedRoom = await RoomModel.findByIdAndDelete(id);

      if (!deletedRoom) {
        return new ApiError(404, "Room not found");
      }
    } catch (error) {
      return new ApiError(500, error);
    }
  },
};

export default RoomService;
