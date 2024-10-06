import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import messageRoomReducer from './message/messageSlice';
import settingTimesSliceReducer from './minyans/setting-times-slice';
import roomsReducer from './room/room-slice'; // Import your rooms reducer

export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    message: messageRoomReducer,
    minyans: settingTimesSliceReducer,
    room: roomsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

const { dispatch } = store;

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk<ReturnType = void> = ThunkAction<Promise<ReturnType> | ReturnType, RootState, unknown, AnyAction>;
export { dispatch, useAppDispatch, useAppSelector };
export default store;
