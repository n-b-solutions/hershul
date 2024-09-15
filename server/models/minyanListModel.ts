import mongoose, {
  Schema,
  Document,
  ObjectId,
  SchemaType,
  SchemaTypes,
} from "mongoose";

type DateTypes =
  | "sunday"
  | "monday"
  | "friday"
  | "saturday"
  | "roshHodesh"
  | "taanit"
  | "yomTov"
  | "calendar";
interface AlertType {
  time: Date;
  messageId?: ObjectId;
}
interface BlinkAlertType {
  secondsNum: number;
  messageId?: ObjectId;
}
interface MinyanDocument extends Document {
  roomId: ObjectId;
  startDate: AlertType;
  endDate: AlertType;
  dateType: DateTypes;
  blink?: BlinkAlertType;
  steadyFlag: Boolean;
}

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
});

const MinyanListModel = mongoose.model<MinyanDocument>("minyans", MinyanSchema);

export default MinyanListModel;
