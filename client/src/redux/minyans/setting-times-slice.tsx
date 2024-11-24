import { sortByTime } from '@/helpers/time.helper';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import { LuachMinyanRowType } from '@/types/luach-minyan.type';
import { MinyanRowType } from '@/types/minyans.type';

import { EditLuachMinyanValueType, LuachMinyanType } from '../../../../lib/types/luach-minyan.type';
import { eDateType, EditMinyanValueType, MinyanType } from '../../../../lib/types/minyan.type';

export interface Istate {
  settingTimesItem: MinyanRowType[];
  luachMinyanTimesItem: LuachMinyanRowType[];
  dateType: eDateType;
  currentDate?: string;
}

const initialState: Istate = {
  settingTimesItem: [],
  luachMinyanTimesItem: [],
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
    setLuachMinyanTimes: (state: Istate, action: PayloadAction<{ setting: LuachMinyanType[] }>) => {
      state.luachMinyanTimesItem = action.payload.setting;
    },
    addLuachMinyanTimes: (state: Istate, action: PayloadAction<{ newRow: LuachMinyanRowType }>) => {
      state.luachMinyanTimesItem.push(action.payload.newRow);
    },
    updateLuachMinyanTimesValue: (
      state,
      action: PayloadAction<{
        index: number;
        value: EditLuachMinyanValueType;
        field: keyof LuachMinyanRowType;
        internalField?: string;
      }>
    ) => {
      const update = state.luachMinyanTimesItem[action.payload.index];
      const newUpdate = {
        ...update,
        [action.payload.field]: action.payload.internalField
          ? { ...(update[action.payload.field] as {}), [action.payload.internalField]: action.payload.value }
          : action.payload.value,
      };
      [...state.luachMinyanTimesItem, (state.luachMinyanTimesItem[action.payload.index] = newUpdate)];
    },
    deleteLuachMinyan: (state: Istate, action: PayloadAction<{ minyanId: string }>) => {
      state.luachMinyanTimesItem = state.luachMinyanTimesItem.filter((m) => m.id !== action.payload.minyanId);
    },
    sortLuachMinyanTimesItem: (state: Istate) => {
      state.luachMinyanTimesItem = sortByTime(state.luachMinyanTimesItem);
    },
    setCurrentDateType: (state: Istate, action: PayloadAction<{ currentType: eDateType }>) => {
      state.dateType = action.payload.currentType;
    },
    setCurrentSelectedDate: (state: Istate, action: PayloadAction<{ currentDate: string }>) => {
      state.currentDate = action.payload.currentDate;
    },
  },
});

export const {
  addSettingTimes,
  updateSettingTimesValue,
  setSettingTimes,
  deleteMinyan,
  sortSettingTimesItem,
  setLuachMinyanTimes,
  addLuachMinyanTimes,
  updateLuachMinyanTimesValue,
  deleteLuachMinyan,
  sortLuachMinyanTimesItem,
  setCurrentDateType,
  setCurrentSelectedDate,
} = settingTimesSlice.actions;

export default settingTimesSlice.reducer;
