import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { esBuildTools } from "./esBuildTools";

export const store = configureStore({
  reducer: {
    [esBuildTools.name]: esBuildTools.reducer
  },
  middleware: (middleware) => middleware()
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector = () => useSelector((state: RootState) => state);
export const useAppDispatch = () => useDispatch<AppDispatch>();
