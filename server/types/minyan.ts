import mongoose, {
    Document,
    ObjectId,

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
  interface SpesificDate{
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
    spesificDate?:SpesificDate;
    inactiveDates?:SpesificDate[];
  }
  export enum eDateType {
    SUNDAY = "sunday",
    MONDAY = "monday",
    FRIDAY = "friday",
    ROSH_HODESH = "roshHodesh",
    SATURDAY="satueday",
    DEFAULT = "default"

  }