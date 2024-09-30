    import { configureStore } from '@reduxjs/toolkit';

    import messageRoomReducer from './message-room/message-room-slice';
    import settingTimesSliceReducer from './setting-times/setting-times-slice';
    import roomsReducer from './room/room-slice'; // Import your rooms reducer

    export const store = configureStore({
      reducer: {
        messageRoom: messageRoomReducer,
        settingTimes: settingTimesSliceReducer,
        rooms: roomsReducer, 
      },
    });

    export type RootState = ReturnType<typeof store.getState>;
    export type AppDispatch = typeof store.dispatch;


