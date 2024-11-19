import mongoose, { Schema, SchemaTypes } from "mongoose";
import { LuachMinyanDocument } from "../types/luach-minyan.type";
import { eDateType } from "../../lib/types/minyan.type";
import { blinkAlertSchema, specificDateSchema } from "./minyan.model";
import {
  eJewishTimeOfDay,
  eRelativeTime,
} from "../../lib/types/luach-minyan.type";

const timeOfDaySchema: Schema = new Schema(
  {
    value: {
      type: String,
      enum: Object.values(eJewishTimeOfDay),
      required: true,
    },
    messageId: { type: SchemaTypes.ObjectId, ref: "messages" },
  },
  { _id: false }
);

const durationSchema: Schema = new Schema(
  {
    value: { type: Number, required: true },
    messageId: { type: SchemaTypes.ObjectId, ref: "messages" },
  },
  { _id: false }
);

const LuachMinyanSchema: Schema<LuachMinyanDocument> = new Schema({
  roomId: { type: SchemaTypes.ObjectId, required: true, ref: "rooms" },
  dateType: { type: String, enum: Object.values(eDateType), required: true },
  timeOfDay: { type: timeOfDaySchema, required: true },
  relativeTime: {
    type: String,
    enum: Object.values(eRelativeTime),
    required: true,
  },
  duration: { type: durationSchema, required: true },
  blink: { type: blinkAlertSchema },
  specificDate: { type: specificDateSchema },
  inactiveDates: { type: [specificDateSchema], default: [] },
  steadyFlag: { type: Boolean },
});

const LuachMinyanModel = mongoose.model<LuachMinyanDocument>(
  "luach_minyans",
  LuachMinyanSchema
);

export default LuachMinyanModel;
