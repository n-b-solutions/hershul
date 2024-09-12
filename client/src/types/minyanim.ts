import { Dayjs } from "dayjs";
import { Room } from "./room";

export interface TypeOfDate{
    value: string
    label: string
}

export interface LineItemTable {
    id: string;
    blink: number ;
    startDate: string;
    endDate: string;
    room:Room;
  }
export interface AlertType {
    time: Date;
    messageId?: string;
  }
  export interface BlinkAlertType {
    secondsNum: number;
    messageId?: string;
  } 

  