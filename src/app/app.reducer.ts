
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {AnyAction} from "redux";


const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};

export type AppInitialStateType = typeof initialState;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
  extraReducers:builder =>{
  builder.addMatcher(
      (action:AnyAction)=>{
        console.log(action.type)
        return action.type.endsWith('/pending')
      },
      (state, action)=>{
        state.status = 'loading'
      })
  }
});



export const appReducer = slice.reducer;
export const appActions = slice.actions;