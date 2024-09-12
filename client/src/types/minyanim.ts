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
  