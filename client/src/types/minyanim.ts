import { Room } from './room';

export interface TypeOfDate {
  value: string;
  label: string;
}

export interface LineItemTable {
  inactiveDates: any;
  id: string;
  blink?: number;
  startDate: Date;
  endDate: Date;
  room: Room;
  isRoutine?:boolean;
  dateType: string;
  spesificDate?: { date: string; isRoutine: boolean }; // ודא שזה מוגדר
}
interface SpesificDate{
  date: Date;
  isRoutine: boolean;
}
export interface GetNewMinyan {
  messages: string;
  startDate: AlertType;
  endDate: AlertType;
  roomId: string;
  dateType: string;
  steadyFlag: boolean;
  blink?: BlinkAlertType;
  id: string;
  spesificDate?:SpesificDate;
  inactiveDates?:SpesificDate[];
}

// הגדרה חדשה ל-NewMinyan כולל spesificDate
export type NewMinyan = {
  startDate: Date;
  endDate: Date;
  roomId: string;
  dateType: string;
  steadyFlag: boolean;
  blink?: number;
  spesificDate?: {
    date: Date;
    isRoutine: boolean;
  };
};

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
