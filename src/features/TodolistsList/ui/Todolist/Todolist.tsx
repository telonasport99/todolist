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

type Props = {
  todolist: TodolistDomainType;
  tasks: Array<TaskType>;
  demo?: boolean;
};

export const Todolist = React.memo(function ({ demo = false, ...props }: Props) {
  const {fetchTasks,addTask:addTaskThunk} = useActions(tasksThunks)
  const {
    changeTodo,
    removeTodo,
    changeTodolistFilter
  } = useActions({...todolistsThunks, ...todolistsActions})

  useEffect(() => {
    if (demo) {
      return;
    }
    fetchTasks(props.todolist.id)
  }, []);

  const addTask = useCallback(
    (title: string) => {
      addTaskThunk({title,todolistId:props.todolist.id});
    },[props.todolist.id]
  )
  const removeTodolist = () => {
    removeTodo({id:props.todolist.id});
  };

  const changeTodolistTitle = useCallback(
    (title: string) => {
     changeTodo({id:props.todolist.id, title});
    },
    [props.todolist.id]
  );
  return (
    <div>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitle} />
        <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === "loading"} />
      <Tasks todolist={props.todolist} tasks={props.tasks}/>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons filter={props.todolist.filter} id={props.todolist.id}/>
      </div>
    </div>
  );
});
