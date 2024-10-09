import { RoomType } from "./room.type";
import { MessageType } from "./message.type";

export enum eDateType {
  sunday = "sunday",
  monday = "monday",
  friday = "friday",
  saturday = "saturday",
  roshHodesh = "roshHodesh",
  calendar = "calendar",
}

export interface AlertType {
  time: Date;
  messageId?: string | MessageType;
}
export interface BlinkAlertType {
  secondsNum: number;
  messageId?: string | MessageType;
}
export interface MinyanType {
  id: string;
  roomId: string | RoomType;
  startDate: AlertType;
  endDate: AlertType;
  dateType: eDateType;
  blink?: BlinkAlertType;
  steadyFlag?: boolean;
}

export interface NewMinyanType {
  roomId: string;
  startTime: Date;
  endTime: Date;
  blinkNum?: number;
  dateType: eDateType;
}

export type EditMinyanValueType = string | Date | RoomType | number | boolean;