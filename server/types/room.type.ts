import { Types } from "mongoose";
import { RoomType } from "../../lib/types/room.type";

export interface RoomDocument extends Omit<RoomType, "id" | "bulbStatus" | "bulbColor"> {
  _id: Types.ObjectId;
  ipAddress: string;
}

export interface RoomServerType extends RoomType, Omit<RoomDocument, "_id"> {}

export const eBulbColorNum = {
  white: 1,
  red: 2,
  blue: 3,
  yellow: 4,
};

export const eBulbStatusNum = {
  off: 0,
  on: 1,
  blink: 2,
};
