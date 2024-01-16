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




  let tasksForTodolist = props.tasks;

  if (props.todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitle} />
        <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task
            key={t.id}
            task={t}
            todolistId={props.todolist.id}
          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons filter={props.todolist.filter} id={props.todolist.id}/>
      </div>
    </div>
  );
});
