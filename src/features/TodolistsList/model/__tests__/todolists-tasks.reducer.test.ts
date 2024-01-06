import {
  TodolistDomainType,
  todolistsActions,
  todolistSlice,
  todolistsThunks
} from "features/TodolistsList/model/todolistSlice";
import { tasksSlice, TasksStateType } from "features/TodolistsList/model/tasksSlice";
import {TodolistType} from "features/TodolistsList/api/todolist/todolistsApi.type";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  let todolist: TodolistType = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  };

  const action = todolistsThunks.addTodo.fulfilled({ todolist: todolist },'requestId',{title:todolist.title});

  const endTasksState = tasksSlice(startTasksState, action);
  const endTodolistsState = todolistSlice(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
