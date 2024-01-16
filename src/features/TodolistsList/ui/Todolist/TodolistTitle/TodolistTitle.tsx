import React, {useCallback} from 'react';
import {EditableSpan} from "common/components";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {TodolistDomainType, todolistsActions, todolistsThunks} from "features/TodolistsList/model/todolistSlice";
import {useActions} from "common/hooks/useActions";

type Props = {
    todolist:TodolistDomainType
}
const TodolistTitle = ({todolist}:Props) => {
    const {
        changeTodo,
        removeTodo
    } = useActions({...todolistsThunks, ...todolistsActions})
    const removeTodolist = () => {
        removeTodo({id:todolist.id});
    };

    const changeTodolistTitle = useCallback(
        (title: string) => {
            changeTodo({id:todolist.id, title});
        },
        [todolist.id]
    );
    return (
        <h3>
            <EditableSpan value={todolist.title} onChange={changeTodolistTitle} />
            <IconButton onClick={removeTodolist} disabled={todolist.entityStatus === "loading"}>
                <Delete />
            </IconButton>
        </h3>
    );
};

export default TodolistTitle;