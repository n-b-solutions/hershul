import mongoose, { Schema, SchemaTypes } from "mongoose";

import {
  AlertTypeDocument,
  BlinkAlertTypeDocument,
  MinyanDocument,
} from "../types/minyan.type";
import { SpecificDateType } from "../../lib/types/minyan.type";

const alertSchema: Schema<AlertTypeDocument> = new Schema(
  {
    time: { type: Date, required: true },
    messageId: { type: SchemaTypes.ObjectId, ref: "messages" },
  },
  { _id: false }
);

export const blinkAlertSchema: Schema<BlinkAlertTypeDocument> = new Schema(
  {
    secondsNum: { type: Number },
    messageId: { type: SchemaTypes.ObjectId, ref: "messages" },
  },
  { _id: false }
);

export const specificDateSchema: Schema<SpecificDateType> = new Schema(
  {
    date: { type: SchemaTypes.Date },
    isRoutine: { type: SchemaTypes.Boolean, default: false },
  },
  { _id: false }
);

const MinyanSchema: Schema<MinyanDocument> = new Schema({
  roomId: { type: SchemaTypes.ObjectId, required: true, ref: "rooms" },
  startDate: { type: alertSchema, required: true },
  endDate: { type: alertSchema, required: true },
  blink: { type: blinkAlertSchema },
  steadyFlag: { type: Boolean },
  dateType: { type: String, required: true },
  specificDate: { type: specificDateSchema },
  inactiveDates: { type: [specificDateSchema], default: [] },
});

const MinyanModel = mongoose.model<MinyanDocument>("minyans", MinyanSchema);

export default MinyanModel;
