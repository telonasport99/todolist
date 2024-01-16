import React from 'react';
import {TodolistDomainType} from "features/TodolistsList/model/todolistSlice";
import {TaskType} from "features/TodolistsList/api/tasks/taskApi.type";
import {Task} from "features/TodolistsList/ui/Todolist/Task/Task";
import {TaskStatuses} from "common/enum/enum";
type Props = {
    todolist:TodolistDomainType
    tasks:TaskType[]
}
const Tasks = ({tasks,todolist}:Props) => {
    let tasksForTodolist = tasks;

    if (todolist.filter === "active") {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
    }
    if (todolist.filter === "completed") {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
    }
    return (
        <div>
            {tasksForTodolist.map((t) => (
                <Task
                    key={t.id}
                    task={t}
                    todolistId={todolist.id}
                />
            ))}
        </div>
    );
};

export default Tasks;