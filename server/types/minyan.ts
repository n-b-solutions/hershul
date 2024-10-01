import mongoose, { Document, ObjectId } from "mongoose";

type DateTypes =
  | "sunday"
  | "monday"
  | "friday"
  | "saturday"
  | "roshHodesh"
  | "calendar";
interface AlertType {
  time: Date;
  messageId?: ObjectId;
}
interface BlinkAlertType {
  secondsNum: number;
  messageId?: ObjectId;
}
interface SpecificDate{
  date: Date;
  isRoutine: boolean;
}
export interface MinyanDocument extends Document {
  roomId: ObjectId;
  startDate: AlertType;
  endDate: AlertType;
  dateType: DateTypes;
  blink?: BlinkAlertType;
  steadyFlag: Boolean;
  specificDate?:SpecificDate;
    inactiveDates?:SpecificDate[];
}
