import {todolistsAPI, TodolistType} from "api/todolists-api";
import {appActions, RequestStatusType} from "app/app.reducer";
import {handleServerNetworkError} from "utils/error-utils";
import {AppThunk} from "app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {createAppAsyncThunk} from "utils/create-app-async-thunk";

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            const newTodolist: TodolistDomainType = {...action.payload.todolist, filter: "all", entityStatus: "idle"};
            state.unshift(newTodolist);
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id);
            if (todo) {
                todo.title = action.payload.title;
            }
        },
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
                return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
            })
            .addCase(removeTodo.fulfilled,(state,action)=>{
                const index = state.findIndex((todo) => todo.id === action.payload.id);
                if (index !== -1) state.splice(index, 1);
            })
    },
});

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(`todo/fetchTodo`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}));
            const res = await todolistsAPI.getTodolists()
            dispatch(appActions.setAppStatus({status: "succeeded"}));
            return {todolists: res.data}
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })

const removeTodo=createAppAsyncThunk<{id: string},{id: string}>(`todo/removeTodo`,
    async (arg, thunkAPI)=>{
                const {dispatch,rejectWithValue}=thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}));
            dispatch(todolistsActions.changeTodolistEntityStatus({id:arg.id, entityStatus: "loading"}));
            const res = await todolistsAPI.deleteTodolist(arg.id)
            dispatch(appActions.setAppStatus({status: "succeeded"}));
            return arg
        }catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
})
// thunks

export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}));
        todolistsAPI.createTodolist(title).then((res) => {
            dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}));
            dispatch(appActions.setAppStatus({status: "succeeded"}));
        });
    };
};
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(id, title).then((res) => {
            dispatch(todolistsActions.changeTodolistTitle({id, title}));
        });
    };
};

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};
export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = {fetchTodolists,removeTodo}
