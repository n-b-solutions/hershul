import { configureStore } from "@reduxjs/toolkit";
import settingTimesSliceReducer from "./setting-times/setting-times-slice";


export const store = configureStore({
  reducer: {
    settingTimes: settingTimesSliceReducer,
  },
});
// export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;