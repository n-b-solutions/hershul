import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

import type { LineItemTable } from '@/types/minyanim';

export interface Istate {
  settingTimesItem: LineItemTable[];
}
const initialState: Istate = {
  settingTimesItem: [],
};

const settingTimesSlice = createSlice({
  name: 'settingTimes',
  initialState,
  reducers: {
    addSettingTimes: (state: Istate, action: PayloadAction<{ index: number; newRow: LineItemTable }>) => {
      const updatedSettingTimesItem = [...state.settingTimesItem];
      updatedSettingTimesItem.splice(action?.payload?.index, 0, action.payload.newRow);
      state.settingTimesItem = [...updatedSettingTimesItem];
    },
    updateSettingTimesValue: (
      state,
      action: PayloadAction<{ index: number; value: string; column: keyof LineItemTable }>
    ) => {
      const update = state.settingTimesItem[action.payload.index] as LineItemTable;
      console.log(typeof action.payload.value);
      const newUpdate: LineItemTable = { ...update, [action.payload.column]: action.payload.value };
      [...state.settingTimesItem, (state.settingTimesItem[action.payload.index] = newUpdate)];
    },
    setSettingTimes: (state: Istate, action: PayloadAction<{ setting: LineItemTable[] }>) => {
      state.settingTimesItem = action.payload.setting;
    },
  },
});

export const { addSettingTimes, updateSettingTimesValue, setSettingTimes } = settingTimesSlice.actions;

export default settingTimesSlice.reducer;
