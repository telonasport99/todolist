import {handleServerAppError, thunkTryCatch} from "common/utils";
import {createSlice, isAnyOf} from "@reduxjs/toolkit";
import {appActions} from "app/app.reducer";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {authAPI, LoginParamsType} from "features/auth/authApi";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {ResultCode} from "features/TodolistsList/api/todolist/todolistsApi.type";

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addMatcher(isAnyOf(authThunks.login.fulfilled,authThunks.logout.fulfilled,authThunks.initializeApp.fulfilled)
                , (state, action) => {
                    state.isLoggedIn = action.payload.isLoggedIn
                })
    }
});

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(`auth/login`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const res = await authAPI.login(arg)
            if (res.data.resultCode === ResultCode.success) {
                return {isLoggedIn: true}
            } else {
                const isShowAppError = !res.data.fieldsErrors.length
                handleServerAppError(res.data, dispatch, isShowAppError);
                return rejectWithValue(res.data)
            }
        })
    })
const logout = createAppAsyncThunk<{ isLoggedIn: false }, undefined>(`auth/logout`,
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const res = await authAPI.logout()
            if (res.data.resultCode === ResultCode.success) {
                dispatch(clearTasksAndTodolists());
                return {isLoggedIn: false}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        })
    })


const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
    "app/initializeApp",
    async (_, { rejectWithValue, dispatch }) => {
        const res = await authAPI.me().finally(() => {
            dispatch(appActions.setAppInitialized({ isInitialized: true }));
        });
        if (res.data.resultCode === ResultCode.success) {
            return { isLoggedIn: true };
        } else {
            return rejectWithValue(res.data);
        }
    },
);
// thunks

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = {login, logout, initializeApp}