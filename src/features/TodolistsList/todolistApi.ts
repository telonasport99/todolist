import {TaskPriorities, TaskStatuses} from "common/enum/enum";
import {instance} from "common/api/baseApi";
import {ResponseType} from "common/types/types";

export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>("todo-lists");
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", {title: title});
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`);
    },
    updateTodolist(id: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${id}`, {title: title});
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    createTask(todolistId: string, taskTitile: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, { title: taskTitile });
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    },
};
// types
export type TodolistType = {
    id: string;
    title: string;
    addedDate: string;
    order: number;
};
export type TaskType = {
    description: string;
    title: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
    id: string;
    todoListId: string;
    order: number;
    addedDate: string;
};
export type UpdateTaskModelType = {
    title: string;
    description: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
};
type GetTasksResponse = {
    error: string | null;
    totalCount: number;
    items: TaskType[];
};
export const ResultCode = {
    success: 0,
    error: 1,
    captcha: 10
} as const