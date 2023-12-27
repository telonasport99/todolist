import {appActions} from "app/app.reducer";
import { todolistsThunks} from "features/TodolistsList/todolists.reducer";
import { createSlice} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {handleServerAppError, handleServerNetworkError, thunkTryCatch} from "common/utils";
import {ResultCode, TaskType, todolistsAPI, UpdateTaskModelType} from "features/TodolistsList/todolistApi";
import {TaskPriorities, TaskStatuses} from "common/enum/enum";

const initialState: TasksStateType = {};

const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(todolistsThunks.addTodo.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = [];
            })
            .addCase(todolistsThunks.removeTodo.fulfilled, (state, action) => {
                delete state[action.payload.id];
            })
            .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = [];
                });
            })
            .addCase(clearTasksAndTodolists, () => {
                return {};
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                debugger
            })
            .addCase(addTask.fulfilled,(state,action)=>{
                const tasks = state[action.payload.task.todoListId];
                tasks.unshift(action.payload.task);
            })
            .addCase(updateTask.fulfilled,(state, action)=>{
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex((t) => t.id === action.payload.taskId);
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel};
                }
        })
            .addCase(removeTask.fulfilled,(state,action)=>{
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex((t) => t.id === action.payload.taskId);
                if (index !== -1) tasks.splice(index, 1);
            })


    },
});
    const fetchTasks = createAppAsyncThunk<{tasks: TaskType[], todolistId: string }, string>(
    'tasks/fetchTasks',
    async (todolistId: string, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
            return thunkTryCatch(thunkAPI,async ()=>{
                dispatch(appActions.setAppStatus({status: "loading"}))
                const res = await todolistsAPI.getTasks(todolistId)
                const tasks = res.data.items
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return {tasks, todolistId}
            })
        }
)

type AddTaskArgType = {
    title: string,
    todolistId: string
}
const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
    'tasks/addTask', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI, async () => {
            const res = await todolistsAPI.createTask(arg.todolistId,arg.title)
            if (res.data.resultCode === ResultCode.success) {
                const task = res.data.data.item
                return {task}
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }
        })
    }
)

// thunks
const updateTask = createAppAsyncThunk<ArgUpdateType,ArgUpdateType>(`tasks/updateTask`,
    async (arg, thunkAPI)=>{
        const {dispatch,rejectWithValue,getState}=thunkAPI
        return thunkTryCatch(thunkAPI,async ()=>{
            const state = getState();
            const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
            if (!task) {
                return rejectWithValue(null)
            }
            const apiModel: UpdateTaskModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: task.status,
                ...arg.domainModel,
            };
            const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
            if (res.data.resultCode === 0) {
                return arg
            } else {
                handleServerAppError(res.data, dispatch);
                return  rejectWithValue(null)
            }
        })
}
)

const removeTask=createAppAsyncThunk<{taskId: string, todolistId: string},{taskId: string, todolistId: string}>(`tasks/remove`,
    async (arg, thunkAPI)=>{
        const {dispatch,rejectWithValue} = thunkAPI
        return thunkTryCatch(thunkAPI,async ()=>{
            const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId)
            if (res.data.resultCode === ResultCode.success){
                return arg
            }else {
                handleServerAppError(res.data,dispatch)
                return rejectWithValue(null)
            }
        })
    })

// types
export type UpdateDomainTaskModelType = {
    title?: string;
    description?: string;
    status?: TaskStatuses;
    priority?: TaskPriorities;
    startDate?: string;
    deadline?: string;
};
export type TasksStateType =Record<string, TaskType[]>

export type ArgUpdateType={
    taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string
}
export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = {fetchTasks,addTask,updateTask,removeTask}