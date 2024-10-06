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
  isEdited?: boolean;
}

export interface GetNewMinyan {
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

export type typeForEdit = string | Date | Room | number | boolean;
