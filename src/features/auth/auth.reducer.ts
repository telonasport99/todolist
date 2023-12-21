import { handleServerAppError, handleServerNetworkError } from "common/utils";
import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app.reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import {authAPI, LoginParamsType} from "features/auth/authApi";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {ResultCode} from "features/TodolistsList/todolistApi";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
   extraReducers:builder => {
      builder.addCase(login.fulfilled,(state, action)=>{
          state.isLoggedIn = action.payload.isLoggedIn
      })
          .addCase(logout.fulfilled,(state, action)=>{
              state.isLoggedIn = action.payload.isLoggedIn
          })
          .addCase(initializeApp.fulfilled,(state,action)=>{
              state.isLoggedIn = action.payload.isLoggedIn
          })
   }
});

const login = createAppAsyncThunk  <{ isLoggedIn:boolean},LoginParamsType>(`auth/login`,
    async (arg, thunkAPI)=>{
        const {dispatch,rejectWithValue}=thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: "loading" }));
        const res = await authAPI.login(arg)
            if(res.data.resultCode===ResultCode.success){
                dispatch(appActions.setAppStatus({ status: "succeeded" }));
                return {isLoggedIn:true}
            }else {
                 handleServerAppError(res.data,dispatch)
                return rejectWithValue(null)
            }
        }catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null)
        }
})
const logout = createAppAsyncThunk <{isLoggedIn: false},undefined>(`auth/logout`,
    async (_    , thunkAPI)=>{
    const {dispatch,rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({ status: "loading" }));
            const res = await authAPI.logout()
                if(res.data.resultCode===ResultCode.success){
                    dispatch(appActions.setAppStatus({ status: "succeeded" }));
                    dispatch(clearTasksAndTodolists());
                    return {isLoggedIn: false}
                }else {
                    handleServerAppError(res.data,dispatch)
                   return  rejectWithValue(null)
                }
        }catch (e) {
            handleServerNetworkError(e,dispatch)
            return rejectWithValue(null)
        }
})

const initializeApp = createAppAsyncThunk<{ isLoggedIn: true },undefined>(`app/initialize`,
    async (_, thunkAPI)=>{
        const {dispatch,rejectWithValue}=thunkAPI
        try {
            const res = await authAPI.me()
            if (res.data.resultCode===ResultCode.success){
                return{isLoggedIn: true}
            }else {
                handleServerAppError(res.data,dispatch)
                return rejectWithValue(null)
            }
        }catch (e) {
            handleServerNetworkError(e,dispatch)
          return   rejectWithValue(null)
        }finally {
            dispatch(appActions.setAppInitialized({isInitialized:true}))
        }
    })
// thunks


export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = {login,logout,initializeApp}