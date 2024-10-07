import { eDateType } from '../../../lib/types/minyan.type';
import { Message, MessageTab } from './message.type';
import { Room } from './room.type';

// TODO: Remove duplicate types & Rename types

export type tFieldMinyanTable = 'blink' | 'startDate' | 'endDate' | 'room';

export interface MinyanDetails {
  id: string;
  blink?: BlinkAlertTypeName;
  startDate: AlertTypeName;
  endDate: AlertTypeName;
  room: Room;
  isRoutine?: boolean;
  dateType: eDateType;
  specificDate?: SpecificDate;
  inactiveDates: SpecificDate[];
  isEdited?: boolean;
}
export interface SpecificDate {
  date: Date | string;
  isRoutine: boolean;
}
export interface MinyanApi {
  startDate: AlertType;
  endDate: AlertType;
  roomId: string;
  dateType: eDateType;
  steadyFlag: boolean;
  blink?: BlinkAlertType;
  id: string;
  specificDate?: SpecificDate;
  inactiveDates?: SpecificDate[];
}

export type NewMinyan = {
  startDate: Date;
  endDate: Date;
  roomId: string;
  dateType: eDateType;
  steadyFlag: boolean;
  blink?: number;
  specificDate?: SpecificDate;
  isRoutine?: boolean;
};

export interface NewMinyan1 {
  startDate: Date;
  endDate: Date;
  room: string;
  blink?: number;
}
export interface AlertType {
  time: Date;
  message?: Message;
}

export interface AlertTypeName {
  time: Date;
  message?: MessageTab;
}
export interface BlinkAlertType {
  secondsNum: number;
  message?: Message;
}

export interface BlinkAlertTypeName {
  secondsNum: number;
  message?: MessageTab;
}
export interface Minyan {
  roomName: string;
  messages?: string;
  startDate: Date;
  action: string;
}

export interface MinyanApi {
  room: Room;
  messages: string;
  startDate: AlertType;
  endDate: AlertType;
  blink?: BlinkAlertType;
}

export type typeForEdit =
  | string
  | Date
  | Room
  | number
  | boolean
  | SpecificDate[]
  | SpecificDate
  | BlinkAlertTypeName
  | AlertTypeName
  | undefined;
