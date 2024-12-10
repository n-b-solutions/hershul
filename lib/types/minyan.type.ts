import { RoomType } from "./room.type";
import { MessageType } from "./message.type";
import { HDate } from "@hebcal/core";

export enum eDateType {
  sunday = "sunday",
  monday = "monday",
  friday = "friday",
  saturday = "saturday",
  roshHodesh = "roshHodesh",
  calendar = "calendar",
}

export enum eMinyanType {
  minyan = 'minyan',
  luachMinyan = 'luach-minyan',
}

export interface AlertType {
  time: Date | string;
  message?: MessageType;
}
export interface BlinkAlertType {
  secondsNum: number;
  message?: MessageType;
}
export interface SpecificDateType {
  date: Date | string;
  isRoutine?: boolean;
  hebrewMonth?: string;
  hebrewDayMonth?: string;
}
export interface MinyanType {
  id: string;
  room: RoomType;
  startDate: AlertType;
  endDate: AlertType;
  dateType: eDateType;
  blink?: BlinkAlertType;
  specificDate?: SpecificDateType;
  inactiveDates?: SpecificDateType[];
  steadyFlag?: boolean;
}

export interface NewMinyanType {
  roomId: string;
  startTime: Date;
  endTime: Date;
  blinkNum?: number;
  dateType: eDateType;
  specificDate?: SpecificDateType;
}



export type EditMinyanValueType =
  | string
  | Date
  | RoomType
  | number
  | boolean
  | SpecificDateType[]
  | SpecificDateType
  | BlinkAlertType
  | AlertType
  | undefined;

export interface EditedType {
  editedValue: EditMinyanValueType;
}
