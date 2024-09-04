import mongoose, { Schema, Document } from "mongoose";

type DateTypes =
  | "sunday"
  | "monday"
  | "friday"
  | "saturday"
  | "roshHodesh"
  | "taanit"
  | "yomTov"
  | "calendar";
interface MinyanDocument extends Document {
  room: string;
  messages?: string;
  announcement: boolean;
  startDate: Date;
  endDate: Date;
  dateType: DateTypes;
  blink?: string;
}

const MinyanSchema: Schema<MinyanDocument> = new Schema({
  room: { type: String, required: true },
  messages: { type: String, required: true },
  announcement: { type: Boolean, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  dateType: { type: String, required: true },
  blink: { type: String, required: false }
});

const MinyanListModel = mongoose.model<MinyanDocument>("minyans", MinyanSchema);

export default MinyanListModel;
