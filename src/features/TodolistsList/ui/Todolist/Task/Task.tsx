import React, { ChangeEvent, useCallback } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { EditableSpan } from "common/components";
import { Delete } from "@mui/icons-material";
import {TaskStatuses} from "common/enum/enum";
import {TaskType} from "features/TodolistsList/api/tasks/taskApi.type";
import {useActions} from "common/hooks/useActions";
import {tasksThunks} from "features/TodolistsList/model/tasksSlice";
import s from './Task.module.css'

type Props = {
  task: TaskType;
  todolistId: string;
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void;
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void;
};
export const Task = React.memo(({task,todolistId,changeTaskStatus,changeTaskTitle}: Props) => {
    const {addTask: addTaskThunk, removeTask: removeTaskThunk, updateTask: updateTaskThunk} = useActions(tasksThunks)
    const removeTaskHandler = () => {removeTaskThunk({taskId: task.id, todolistId: todolistId})}


  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
     changeTaskStatus(
        task.id,
        newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New,
        todolistId
      );
    },
    [task.id, todolistId]
  );

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      changeTaskTitle(task.id, newValue, todolistId);
    },
    [task.id, todolistId]
  );

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ""}>

      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={onChangeHandler} />

      <EditableSpan value={task.title} onChange={onTitleChangeHandler} />
      <IconButton onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});
