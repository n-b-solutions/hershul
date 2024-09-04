export interface TypeOfDate{
    value: string
    label: string
}

export interface LineItemTable {
    id?: string|null;
    blink: string |null;
    startTime: string|null;
    endTime: string|null;
    room: number|null;
  }

  export interface TablePropForEdit {
    blink: { isInput: boolean;};
    startTime:{ isInput: boolean; };
    endTime: { isInput: boolean; };
    room: { isInput: boolean; };
  }
  