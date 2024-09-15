import { Dayjs } from 'dayjs';

import { Room } from './room';

export interface TypeOfDate {
  value: string;
  label: string;
}

export interface LineItemTable {
  id: string;
  blink?: number;
  startDate: Date;
  endDate: Date;
  room: Room;
}

export interface GetNewMinyan {
  messages: string;
  announcement: boolean;
  startDate: Date;
  endDate: Date;
  roomId: string;
  dateType: string;
  steadyFlag: boolean;
  blink?: number;
  id:string;
}

export interface NewMinyan {
  messages: string;
  announcement: boolean;
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
  messageId?: string;
}
export interface BlinkAlertType {
  secondsNum: number;
  messageId?: string;
}
