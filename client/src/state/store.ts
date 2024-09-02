import { configureStore } from '@reduxjs/toolkit';
import messageRoomReducer from './messageRoom/messageRoomSlice';

export const store = configureStore({
  reducer: {
    messageRoom: messageRoomReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
