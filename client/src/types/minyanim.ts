import { Dayjs } from "dayjs";
import { Room } from "./room";

export interface TypeOfDate{
    value: string
    label: string
}

export interface LineItemTable {
    id?: string|null;
    blink: string |null;
    startDate: string|null;
    endDate: string |null;
    room:Room;
  }

  export interface TablePropForEdit {
    blink: { isInput: boolean;};
    startDate:{ isInput: boolean; };
    endDate: { isInput: boolean; };
    room: { isInput: boolean; };
  }
  