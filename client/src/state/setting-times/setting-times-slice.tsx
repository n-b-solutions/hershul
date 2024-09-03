import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import type { LineItemTable } from '@/types/minyanim';

export interface Istate {
  settingTimesItem: LineItemTable[];
}
const initialState: Istate = {
  settingTimesItem: [
    {
      id: '0',
      blink: '3',
      startTime: dayjs(new Date()).format('hh:mm'),
      endTime: dayjs(new Date()).format('hh:mm'),
      room: 1,
    },
    {
      id: '1',
      blink: '',
      startTime: dayjs(new Date()).format('hh:mm'),
      endTime: dayjs(new Date()).format('hh:mm'),
      room: 0,
    },
    {
      id: '2',
      blink: '',
      startTime: dayjs(new Date()).format('hh:mm'),
      endTime: dayjs(new Date()).format('hh:mm'),
      room: 5,
    },
    {
      id: '3',
      blink: '5',
      startTime: dayjs(new Date()).format('hh:mm'),
      endTime: dayjs(new Date()).format('hh:mm'),
      room: 65,
    },
    {
      id: '4',
      blink: '',
      startTime: dayjs(new Date()).format('hh:mm'),
      endTime: dayjs(new Date()).format('hh:mm'),
      room: 4,
    },
    {
      id: '5',
      blink: '',
      startTime: dayjs(new Date()).format('hh:mm'),
      endTime: dayjs(new Date()).format('hh:mm'),
      room: 6,
    },
    { id: '6', blink: '', startTime: '', endTime: '', room: null },
  ],
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
      const newUpdate = { ...update, [action.payload.column]: action.payload.value };
      [...state.settingTimesItem, (state.settingTimesItem[action.payload.index] = newUpdate)];
    },
  },
});

export const { addSettingTimes, updateSettingTimesValue } = settingTimesSlice.actions;

export default settingTimesSlice.reducer;
