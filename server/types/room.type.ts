import { Types } from "mongoose";

import { RoomType } from "../../lib/types/room.type";

export interface RoomDocument extends Omit<RoomType, "id"> {
  _id: Types.ObjectId;
}
