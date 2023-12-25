import {Dispatch} from "redux";
import {appActions} from "app/app.reducer";
import {BaseResponseType} from "common/types";

/**
 * Обрабатывает ошибки серверного приложения и устанавливает соответствующий статус и сообщение об ошибке в состоянии приложения.
 * @param {BaseResponseType<D>} data - объект, содержащий данные ответа сервера, включая код, сообщения и поля.
 * @param {Dispatch} dispatch - функция, позволяющая отправлять действия в хранилище Redux.
 * @param {boolean} [showError=true] - флаг, указывающий, нужно ли показывать сообщение об ошибке пользователю.
 * @returns {void} - функция не возвращает ничего.
 */
export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch,showError: boolean = true): void => {
    if(showError){
        dispatch(appActions.setAppError(data.messages.length?{error:data.messages[0]}:{error:'Some error occurred'}))
    }
    dispatch(appActions.setAppStatus({ status: "failed" }));
}; 

