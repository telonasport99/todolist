import { AppDispatch, AppRootStateType } from 'app/store';
import { handleServerNetworkError } from 'common/utils/handle-server-network-error';
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { appActions } from 'app/app.reducer';
import { BaseResponseType} from 'common/types';

/**
 * Обертывает асинхронную логику в try-catch блок и диспатчит соответствующие действия приложения
 * @param {BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>} thunkAPI - объект, содержащий свойства и методы для работы с thunk
 * @param {function} logic - функция, возвращающая промис с результатом асинхронной логики
 * @returns {Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>>} - промис, возвращающий либо данные типа T, либо значение, отклоненное с помощью thunkAPI.rejectWithValue
 */
export const thunkTryCatch = async <T>(
    thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | BaseResponseType>,
    logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
    const { dispatch, rejectWithValue } = thunkAPI;
    // диспатчим действие для установки статуса приложения на "loading"
    try {
        // возвращаем результат асинхронной логики
        return await logic();
    } catch (e) {
        // обрабатываем ошибку сети сервера и диспатчим соответствующие действия
        handleServerNetworkError(e, dispatch);
        // возвращаем значение, отклоненное с помощью thunkAPI.rejectWithValue
        return rejectWithValue(null);
    } finally {
        // диспатчим действие для установки статуса приложения на "idle"
        dispatch(appActions.setAppStatus({ status: "idle" }));
    }
};
