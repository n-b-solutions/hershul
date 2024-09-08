import { Dayjs } from "dayjs";

export interface TypeOfDate{
    value: string
    label: string
}

export interface LineItemTable {
    id?: string|null;
    blink: string |null;
    startDate: string|null;
    endDate: string |null;
    room: number|null;
  }

  export interface TablePropForEdit {
    blink: { isInput: boolean;};
    startDate:{ isInput: boolean; };
    endDate: { isInput: boolean; };
    room: { isInput: boolean; };
  }
  