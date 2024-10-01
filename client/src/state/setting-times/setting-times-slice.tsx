import { sortByTime } from '@/helpers/functions-times';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { LineItemTable, typeForEdit } from '@/types/minyanim';

import { eDateType } from '../../../../bin/types/minyan.type';

export interface Istate {
  settingTimesItem: LineItemTable[];
  dateType: eDateType;
}
const initialState: Istate = {
  settingTimesItem: [],
  dateType: eDateType.SUNDAY,
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
      action: PayloadAction<{
        index: number;
        value: typeForEdit;
        field: keyof LineItemTable;
        internalField?: string;
      }>
    ) => {
      console.log(action.payload.value);
      
      const update = state.settingTimesItem[action.payload.index] as LineItemTable;
      const newUpdate: LineItemTable = {
        ...update,
        [action.payload.field]: action.payload.internalField
          ? { ...(update[action.payload.field] as {}), [action.payload.internalField]: action.payload.value }
          : action.payload.value,
      };
      console.log(newUpdate);
      
      [...state.settingTimesItem, (state.settingTimesItem[action.payload.index] = newUpdate)];
      console.log(state.settingTimesItem);
      
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
    setCurrentDateType: (state: Istate, action: PayloadAction<{ currentType: eDateType }>) => {
      state.dateType = action.payload.currentType;
    },
  },
});

export const {
  addSettingTimes,
  updateSettingTimesValue,
  setSettingTimes,
  deleteMinyan,
  sortSettingTimesItem,
  setCurrentDateType,
} = settingTimesSlice.actions;

export default settingTimesSlice.reducer;
