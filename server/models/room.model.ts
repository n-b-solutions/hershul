import { Schema, SchemaTypes, model } from "mongoose";
import { RoomDocument } from "../types/room.type";

const RoomSchema = new Schema<RoomDocument>({
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  bulbStatus: {
    type: SchemaTypes.String,
    required: true,
  },
  ipAddress: {
    type: SchemaTypes.String,
    required: true,
  },
});

const RoomModel = model<RoomDocument>("rooms", RoomSchema);

export default RoomModel;
