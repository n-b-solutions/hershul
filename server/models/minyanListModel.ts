import mongoose, { Schema, SchemaTypes } from "mongoose";
import { MinyanDocument } from "../types/minyan";

const MinyanSchema: Schema<MinyanDocument> = new Schema({
  roomId: { type: SchemaTypes.ObjectId, required: true, ref: "rooms" },
  startDate: {
    type: {
      time: { type: Date, required: true },
      messageId: { type: SchemaTypes.ObjectId, ref: "messages" },
    },
  },
  endDate: {
    type: {
      time: { type: Date, required: true },
      messageId: { type: SchemaTypes.ObjectId, ref: "messages" },
    },
  },
  blink: {
    type: {
      secondsNum: { type: Number },
      messageId: { type: SchemaTypes.ObjectId, ref: "messages" },
    },
  },
  steadyFlag: { type: Boolean, required: true },
  dateType: { type: String, required: true },
  specificDate: {
    type: {
      date: { type: Date, required: false },
      isRoutine: { type: Boolean, required: false },
    },
  },
  inactiveDates: [
    {
      date: { type: Date, required: false },
      isRoutine: { type: Boolean, required: false },
    },
  ],
});

const MinyanListModel = mongoose.model<MinyanDocument>("minyans", MinyanSchema);

export default MinyanListModel;
