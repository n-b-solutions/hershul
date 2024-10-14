import { sortByTime } from '@/helpers/time.helper';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { MinyanRowType } from '@/types/minyans.type';

import { eDateType, EditMinyanValueType, MinyanType } from '../../../../lib/types/minyan.type';

export interface Istate {
  settingTimesItem: MinyanRowType[];
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
    addSettingTimes: (state: Istate, action: PayloadAction<{ newRow: MinyanRowType }>) => {
      state.settingTimesItem.push(action.payload.newRow);
    },
    updateSettingTimesValue: (
      state,
      action: PayloadAction<{
        index: number;
        value: EditMinyanValueType;
        field: keyof MinyanRowType;
        internalField?: string;
      }>
    ) => {
      const update = state.settingTimesItem[action.payload.index];
      const newUpdate = {
        ...update,
        [action.payload.field]: action.payload.internalField
          ? { ...(update[action.payload.field] as {}), [action.payload.internalField]: action.payload.value }
          : action.payload.value,
      };
      [...state.settingTimesItem, (state.settingTimesItem[action.payload.index] = newUpdate)];
    },
    setSettingTimes: (state: Istate, action: PayloadAction<{ setting: MinyanRowType[] }>) => {
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
