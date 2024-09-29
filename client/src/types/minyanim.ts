import { eDateType } from '../../../bin/types/minyan.type';
import { MessageRoom, MessageTab } from './message';
import { Room } from './room';

export type tFieldMinyanTable = 'blink' | 'startDate' | 'endDate' | 'room';
export interface TypeOfDate {
  value: eDateType;
  label: string;
}

export interface LineItemTable {
  id: string;
  blink?: BlinkAlertTypeName;
  startDate: AlertTypeName;
  endDate: AlertTypeName;
  room: Room;
  isEdited?: boolean;
}

export interface GetNewMinyan {
  announcement: boolean;
  startDate: AlertType;
  endDate: AlertType;
  roomId: string;
  dateType: string;
  steadyFlag: boolean;
  blink?: BlinkAlertType;
  id: string;
}

export interface NewMinyan {
  startDate: Date;
  endDate: Date;
  roomId: string;
  dateType: string;
  steadyFlag: boolean;
  blink?: number;
}

export interface NewMinyan1 {
  startDate: Date;
  endDate: Date;
  room: string;
  blink?: number;
}
export interface AlertType {
  time: Date;
  message?: MessageRoom;
}

export interface AlertTypeName {
  time: Date;
  message?: MessageTab;
}
export interface BlinkAlertType {
  secondsNum: number;
  message?: MessageRoom;
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

export type typeForEdit = string | Date | Room | number | boolean;
