import mongoose, {
  Schema,
  SchemaTypes,
} from "mongoose";
import { MinyanDocument } from "../types/minyan";

const MinyanSchema: Schema<MinyanDocument> = new Schema({
  roomId: { type: SchemaTypes.ObjectId, required: true, ref: "rooms" },
  startDate: {
    time: { type: Date, required: true },
    messageId: { type: SchemaTypes.ObjectId, ref: "messages" },
  },
  endDate: {
    time: { type: Date, required: true },
    messageId: { type: SchemaTypes.ObjectId, ref: "messages" },
  },
  blink: {
    secondsNum: { type: Number },
    messageId: { type: SchemaTypes.ObjectId, ref: "messages" },
  },
  steadyFlag: { type: Boolean, required: true },
  dateType: { type: String, required: true },
  spesificDate: {
    date: { type: Date, required: false },
    isRoutine: { type: Boolean, required: false },
  },
  inactiveDates: [{
    date: { type: Date, required: false },
    isRoutine: { type: Boolean, required: false },
  }],
});

const MinyanListModel = mongoose.model<MinyanDocument>("minyans", MinyanSchema);

export default MinyanListModel;
