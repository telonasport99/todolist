import { Dispatch } from "redux";
import axios, { AxiosError } from "axios";
import { appActions } from "app/app.reducer";

/**
 * Обрабатывает ошибку сети сервера и диспатчит соответствующие действия
 * @param {unknown} e - объект ошибки, полученный от API
 * @param {Dispatch} dispatch - функция диспатча из Redux
 */
export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    // приводим ошибку к типу Error или AxiosError
    const err = e as Error | AxiosError<{ error: string }>;
    // проверяем, является ли ошибка экземпляром AxiosError
    if (axios.isAxiosError(err)) {
        // получаем сообщение об ошибке или используем значение по умолчанию
        const error = err.message ? err.message : "Some error occurred";
        // диспатчим действие для установки ошибки приложения
        dispatch(appActions.setAppError({ error }));
    } else {
        // диспатчим действие для установки нативной ошибки
        dispatch(appActions.setAppError({ error: `Native error ${err.message}` }));
    }
    // диспатчим действие для установки статуса приложения на "failed"
    dispatch(appActions.setAppStatus({ status: "failed" }));
};
