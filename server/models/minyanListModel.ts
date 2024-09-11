import mongoose, { Schema, Document, ObjectId, SchemaType, SchemaTypes } from "mongoose";

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
  roomId: ObjectId;
  messages?: string;
  announcement: boolean;
  startDate: Date;
  endDate: Date;
  dateType: DateTypes;
  blink?: string;
}

const MinyanSchema: Schema<MinyanDocument> = new Schema({
  roomId: { type: SchemaTypes.ObjectId, required: true ,ref:'rooms'},
  messages: { type: String, required: true },
  announcement: { type: Boolean, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  dateType: { type: String, required: true },
  blink: { type: String, required: false }
});

const MinyanListModel = mongoose.model<MinyanDocument>("minyans", MinyanSchema);

export default MinyanListModel;
