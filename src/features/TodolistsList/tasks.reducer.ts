import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "api/todolists-api";
import {AppThunk} from "app/store";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {appActions} from "app/app.reducer";
import {todolistsActions} from "features/TodolistsList/todolists.reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {createAppAsyncThunk} from "../../utils/create-app-async-thunk";
import any = jasmine.any;

const initialState: TasksStateType = {};

const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = [];
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id];
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
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
                const tasks = state[action.payload];
                const index = tasks.findIndex((t) => t.id === action.payload.taskId);
                if (index !== -1) tasks.splice(index, 1);
            })


    },
});
    const fetchTasks = createAppAsyncThunk<{tasks: TaskType[], todolistId: string }, string>(
    'tasks/fetchTasks',
    async (todolistId: string, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.getTasks(todolistId)
            const tasks = res.data.items
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {tasks, todolistId}
        } catch (e) {
            handleServerNetworkError(e,dispatch)
            return rejectWithValue(null)
        }
    }
)

const addTask=createAppAsyncThunk<{ task:TaskType },{title: string, todolistId: string}>(
    `tasks/addTask`,
    async (arg, thunkAPI)=>{
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}));
             const  res = await todolistsAPI.createTask(arg.todolistId,arg.title)
                    if (res.data.resultCode === 0) {
                        const task = res.data.data.item;
                        dispatch(appActions.setAppStatus({status: "succeeded"}));
                        return {task};
                    } else {
                        handleServerAppError(res.data, dispatch);
                        return rejectWithValue(null)
                    }
        }catch (e) {
            handleServerNetworkError(e,dispatch)
            return rejectWithValue(null)
        }
    })

// thunks
const updateTask = createAppAsyncThunk<ArgUpdateType,ArgUpdateType>(`tasks/updateTask`,
    async (arg, thunkAPI)=>{
        const {dispatch,rejectWithValue,getState}=thunkAPI
        try {
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
        }catch (e) {
            handleServerNetworkError(e,dispatch)
            return rejectWithValue(null)
        }

}
)

const removeTask=createAppAsyncThunk<{taskId: string, todolistId: string},{taskId: string, todolistId: string}>(`tasks/remove`,
    async (arg, thunkAPI)=>{
        const {dispatch,rejectWithValue} = thunkAPI
        try {
             const res = todolistsAPI.deleteTask(arg.todolistId, arg.taskId)
            return arg
        }catch (e) {
            handleServerNetworkError(e,dispatch)
            return rejectWithValue(null)
        }
    })
export const removeTaskTC =
    (taskId: string, todolistId: string): AppThunk =>
        (dispatch) => {
            todolistsAPI.deleteTask(todolistId, taskId).then(() => {
                dispatch(tasksActions.removeTask({taskId, todolistId}));
            });
        };

// types
export type UpdateDomainTaskModelType = {
    title?: string;
    description?: string;
    status?: TaskStatuses;
    priority?: TaskPriorities;
    startDate?: string;
    deadline?: string;
};
export type TasksStateType = {
    [key: string]: Array<TaskType>;
};
export type ArgUpdateType={
    taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string
}
export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = {fetchTasks,addTask,updateTask}