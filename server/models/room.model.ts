import { Schema, SchemaTypes, model } from "mongoose";
import { RoomType } from "../../lib/types/room.type";

const RoomSchema = new Schema<RoomType>({
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  bulbStatus: {
    type: SchemaTypes.String,
    required: true,
  },
});

const RoomModel = model<RoomType>("rooms", RoomSchema);

export default RoomModel;
