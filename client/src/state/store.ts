import { configureStore } from '@reduxjs/toolkit';

import messageRoomReducer from './message-room/message-room-slice';
import settingTimesSliceReducer from './setting-times/setting-times-slice';

export const store = configureStore({
  reducer: {
    messageRoom: messageRoomReducer,
    settingTimes: settingTimesSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
