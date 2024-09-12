import { Dayjs } from 'dayjs';

import { Room } from './room';

export interface TypeOfDate {
  value: string;
  label: string;
}

export interface LineItemTable {
  id: string;
  blink?: number;
  startDate: string;
  endDate: string;
  room: Room;
}

export interface NewMinyan {
  messages: string;
  announcement: boolean;
  startDate: Date;
  endDate: Date;
  roomId: string;
  dateType:string;
  steadyFlag:boolean;
  blink?:number;
}

export interface NewMinyan1 {
  startDate: Date;
  endDate: Date;
  room: string;
  blink?:number;
}
