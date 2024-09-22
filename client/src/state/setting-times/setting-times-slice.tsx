import { sortByTime } from '@/helpers/functions-times';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { LineItemTable } from '@/types/minyanim';
import { Room } from '@/types/room';

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
    addSettingTimes: (state: Istate, action: PayloadAction<{ newRow: LineItemTable }>) => {
      state.settingTimesItem.push(action.payload.newRow);
    },
    updateSettingTimesValue: (
      state,
      action: PayloadAction<{ index: number; value: string | Date | Room | number|boolean; field: string }>
    ) => {
      
      const update = state.settingTimesItem[action.payload.index] as LineItemTable;
      const newUpdate: LineItemTable = { ...update, [action.payload.field]: action.payload.value };
      [...state.settingTimesItem, (state.settingTimesItem[action.payload.index] = newUpdate)];
    },
    setSettingTimes: (state: Istate, action: PayloadAction<{ setting: LineItemTable[] }>) => {
      state.settingTimesItem = action.payload.setting;
    },
    deleteMinyan: (state: Istate, action: PayloadAction<{ minyanId: string }>) => {
      state.settingTimesItem = state.settingTimesItem.filter((m) => m.id !== action.payload.minyanId);
    },
    sortSettingTimesItem: (state: Istate) => {
      state.settingTimesItem = sortByTime(state.settingTimesItem);
    },
  },
});

export const { addSettingTimes, updateSettingTimesValue, setSettingTimes, deleteMinyan, sortSettingTimesItem } =
  settingTimesSlice.actions;

export default settingTimesSlice.reducer;
