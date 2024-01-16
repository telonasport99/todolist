import React, {useCallback} from 'react';
import {Button} from "@mui/material";
import {useActions} from "common/hooks/useActions";
import {FilterValuesType, todolistsActions, todolistsThunks} from "features/TodolistsList/model/todolistSlice";
type Props = {
    filter:FilterValuesType
    id:string
}
const FilterTasksButtons = ({filter,id}:Props) => {
    const {
        changeTodolistFilter
    } = useActions({...todolistsThunks, ...todolistsActions})

    const changeTodolistFilterHandler=(filter:FilterValuesType)=>{
        changeTodolistFilter({filter, id})
    }
    return (
        <>
            <Button
                variant={filter === "all" ? "outlined" : "text"}
                onClick={()=>changeTodolistFilterHandler('all')}
                color={"inherit"}
            >
                All
            </Button>
            <Button
                variant={filter === "active" ? "outlined" : "text"}
                onClick={()=>changeTodolistFilterHandler('active')}
                color={"primary"}
            >
                Active
            </Button>
            <Button
                variant={filter === "completed" ? "outlined" : "text"}
                onClick={()=>changeTodolistFilterHandler('completed')}
                color={"secondary"}
            >
                Completed
            </Button>

        </>
    );
};

export default FilterTasksButtons;