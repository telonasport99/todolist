import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {
    FilterValuesType,
    todolistsActions, todolistsThunks,
} from "features/TodolistsList/todolists.reducer";
import {tasksThunks} from "features/TodolistsList/tasks.reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "common/components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectTasks} from "features/TodolistsList/tasks.selectors";
import {selectTodolists} from "features/TodolistsList/todolists.selectors";
import {TaskStatuses} from "common/enum/enum";
import {useActions} from "common/hooks/useActions";

type PropsType = {
    demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector(selectTodolists);
    const tasks = useSelector(selectTasks);
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const {
        fetchTodolists,
        addTodo,
        changeTodo,
        removeTodo,
        changeTodolistFilter
    } = useActions({...todolistsThunks, ...todolistsActions})
    const {addTask: addTaskThunk, removeTask: removeTaskThunk, updateTask: updateTaskThunk} = useActions(tasksThunks)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodolists();
    }, []);

    const removeTask = useCallback(function (id: string, todolistId: string) {
        removeTaskThunk({taskId: id, todolistId: todolistId});
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        addTaskThunk({title, todolistId});
    }, []);

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        updateTaskThunk({taskId: id, domainModel: {status}, todolistId});
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        updateTaskThunk({taskId: id, domainModel: {title: newTitle}, todolistId});
    }, []);

    const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
        changeTodolistFilter({id, filter});
    }, []);

    const removeTodolistCB = useCallback(function (id: string) {
        removeTodo({id});
    }, []);

    const changeTodolistTitleCB = useCallback(function (id: string, title: string) {
        changeTodo({title, id});
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
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    removeTodolist={removeTodolistCB}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitleCB}
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