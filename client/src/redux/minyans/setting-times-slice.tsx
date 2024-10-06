import { sortByTime } from '@/helpers/time.helper';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type {  MinyanDetails, typeForEdit } from '@/types/minyans.type';

import { eDateType } from '../../../../lib/types/minyan.type';

export interface Istate {
  settingTimesItem: MinyanDetails[];
  dateType: eDateType;
}
const initialState: Istate = {
  settingTimesItem: [],
  dateType: eDateType.sunday,
};

const settingTimesSlice = createSlice({
  name: 'settingTimes',
  initialState,
  reducers: {
    addSettingTimes: (state: Istate, action: PayloadAction<{ newRow: MinyanDetails }>) => {
      state.settingTimesItem.push(action.payload.newRow);
    },
    updateSettingTimesValue: (
      state,
      action: PayloadAction<{
        index: number;
        value: typeForEdit;
        field: keyof MinyanDetails;
        internalField?: string;
      }>
    ) => {
      const update = state.settingTimesItem[action.payload.index] as MinyanDetails;
      const newUpdate: MinyanDetails = {
        ...update,
        [action.payload.field]: action.payload.internalField
          ? { ...(update[action.payload.field] as {}), [action.payload.internalField]: action.payload.value }
          : action.payload.value,
      };
      [...state.settingTimesItem, (state.settingTimesItem[action.payload.index] = newUpdate)];
    },
    setSettingTimes: (state: Istate, action: PayloadAction<{ setting: MinyanDetails[] }>) => {
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
