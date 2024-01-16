import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {
    FilterValuesType,
    todolistsActions, todolistsThunks,
} from "features/TodolistsList/model/todolistSlice";
import {tasksThunks} from "features/TodolistsList/model/tasksSlice";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {Todolist} from "features/TodolistsList/ui/Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {TaskStatuses} from "common/enum/enum";
import {useActions} from "common/hooks/useActions";
import {useAppSelector} from "common/hooks/useAppSelector";

type PropsType = {
    demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useAppSelector(state => state.todolists);
    const tasks = useAppSelector(state => state.tasks);
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);

    const {
        fetchTodolists,
        addTodo,
    } = useActions({...todolistsThunks, ...todolistsActions})
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (demo || !isLoggedIn) {
            return; 
        }
        fetchTodolists();
    }, []);

    const addTodolistCB = useCallback(
        (title: string) => {
            addTodo({title});
        },
        [dispatch]
    );

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>;
    }

    return (
        <>
            <Grid container style={{padding: "20px"}}>
                <AddItemForm addItem={addTodolistCB}/>
            </Grid>
            <Grid container spacing={3}>
                {todolists.map((tl) => {
                    let allTodolistTasks = tasks[tl.id];

                    return (
                        <Grid item key={tl.id}>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                    todolist={tl}
                                    tasks={allTodolistTasks}
                                    demo={demo}
                                />
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};