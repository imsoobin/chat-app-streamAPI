import { configureStore } from "@reduxjs/toolkit";
import actionSlice  from "./reducer";

export const store = configureStore({
  reducer: {
    actionEvt: actionSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
