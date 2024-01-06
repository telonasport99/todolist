import {appActions, RequestStatusType} from "app/app.reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {handleServerAppError, thunkTryCatch} from "common/utils";
import { todolistsAPI } from "../api/todolist/todolistApi";
import {ResultCode, TodolistType} from "features/TodolistsList/api/todolist/todolistsApi.type";

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id);
            if (todo) {
                todo.filter = action.payload.filter;
            }
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id);
            if (todo) {
                todo.entityStatus = action.payload.entityStatus;
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(clearTasksAndTodolists, () => {
            return [];
        })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map((tl) => ({...tl, filter: "all", entityStatus: "idle"}));
            })
            .addCase(removeTodo.fulfilled, (state, action) => {
                const index = state.findIndex((todo) => todo.id === action.payload.id);
                if (index !== -1) state.splice(index, 1);
            })
            .addCase(addTodo.fulfilled, (state, action) => {
                const newTodolist: TodolistDomainType = {
                    ...action.payload.todolist,
                    filter: "all",
                    entityStatus: "idle"
                };
                state.unshift(newTodolist);
            })
            .addCase(changeTodo.fulfilled, (state, action) => {
                const todo = state.find((todo) => todo.id === action.payload.id);
                if (todo) {
                    todo.title = action.payload.title;
                }
            })
    },
});

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(`todo/fetchTodo`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI,async ()=>{
            dispatch(appActions.setAppStatus({status: "loading"}));
            const res = await todolistsAPI.getTodolists()
            dispatch(appActions.setAppStatus({status: "succeeded"}));
            return {todolists: res.data}
        })
    })

const removeTodo = createAppAsyncThunk<{ id: string }, { id: string }>(`todo/removeTodo`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI,async ()=>{
            dispatch(appActions.setAppStatus({status: "loading"}));
            dispatch(todolistsActions.changeTodolistEntityStatus({id: arg.id, entityStatus: "loading"}));
            const res = await todolistsAPI.deleteTodolist(arg.id)
            if (res.data.resultCode === ResultCode.success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}));
                return arg
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        })
    })
const addTodo = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(`todo/addTodo`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI,async ()=>{
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.createTodolist(arg.title)
            if (res.data.resultCode===ResultCode.success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}));
                return {todolist: res.data.data.item}
            } else {
                handleServerAppError(res.data,dispatch)
                return rejectWithValue(null)
            }
        })


    })

const changeTodo = createAppAsyncThunk<{ id: string, title: string }, { id: string, title: string }>(`todo/changeTdo`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI,async ()=>{
            const res = await todolistsAPI.updateTodolist(arg.id, arg.title)
            return {id: arg.id, title: arg.title}
        })
    })
// thunks

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};
export const todolistSlice = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = {fetchTodolists, removeTodo, addTodo, changeTodo}
