import { RoomType } from "../../lib/types/room.type";
import { RoomServerType } from "../types/room.type";

export const convertRoomToClient = (roomServerType: RoomServerType): RoomType => {
  const { ipAddress: _ipAddress, ...rest } = roomServerType;
  return {
    ...rest,
  };
};
