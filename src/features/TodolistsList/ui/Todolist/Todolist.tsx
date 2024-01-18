import React, { useCallback, useEffect } from "react";
import { Task } from "features/TodolistsList/ui/Todolist/Task/Task";
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
  todolistsThunks
} from "features/TodolistsList/model/todolistSlice";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import {tasksThunks} from "features/TodolistsList/model/tasksSlice";
import {EditableSpan,AddItemForm} from "common/components";
import {TaskStatuses} from "common/enum/enum";
import {useActions} from "common/hooks/useActions";
import {TaskType} from "features/TodolistsList/api/tasks/taskApi.type";
import FilterTasksButtons from "features/TodolistsList/ui/Todolist/FilterTasksButtons/FilterTasksButtons";
import Tasks from "features/TodolistsList/ui/Todolist/Tasks/Tasks";
import TodolistTitle from "features/TodolistsList/ui/Todolist/TodolistTitle/TodolistTitle";

type Props = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
};

export const Todolist = React.memo(function ({ demo = false, ...props }: Props) {
  const {fetchTasks,addTask:addTaskThunk} = useActions(tasksThunks)

  useEffect(() => {
    if (demo) {
      return;
    }
    fetchTasks(props.todolist.id)
  }, []);

  const addTask = useCallback(
    (title: string) => {
     return  addTaskThunk({title,todolistId:props.todolist.id}).unwrap();
    },[props.todolist.id]
  )
  return (
    <div>
      <TodolistTitle todolist={props.todolist}/>
      <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === "loading"} />
      <Tasks todolist={props.todolist} tasks={props.tasks}/>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons filter={props.todolist.filter} id={props.todolist.id}/>
      </div>
    </div>
  );
});
