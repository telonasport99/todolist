import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, AppRootStateType} from "app/store";
import {BaseResponseType} from "common/types";

/**
 * Создает асинхронный thunk с помощью функции createAsyncThunk из библиотеки Redux Toolkit
 * @param {string} type - строка, определяющая тип действия
 * @param {function} payloadCreator - функция, возвращающая промис с результатом асинхронной логики
 * @param {object} options - объект с типами state, dispatch и rejectValue для thunkAPI
 * @returns {function} thunk action creator, который запускает промис-коллбэк и диспатчит действия в зависимости от результата
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppDispatch
    rejectValue: null | BaseResponseType
}>()
