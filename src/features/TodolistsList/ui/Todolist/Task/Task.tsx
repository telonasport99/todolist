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
};
export const Task = React.memo(({task,todolistId}: Props) => {
    const {addTask: addTaskThunk, removeTask: removeTaskThunk, updateTask: updateTaskThunk} = useActions(tasksThunks)
    const removeTaskHandler = () => {removeTaskThunk({taskId: task.id, todolistId: todolistId})}


  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
      const status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New
     updateTaskThunk({
        taskId:task.id,
        domainModel: {status},
        todolistId
        });
    };

  const changeTaskTitleHandler =useCallback( (title: string) => {
        updateTaskThunk({
            taskId:task.id,
            domainModel:{title},
            todolistId});
    },[todolistId,task.id])

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ""}>

      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={changeTaskStatusHandler} />

      <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
      <IconButton onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});
