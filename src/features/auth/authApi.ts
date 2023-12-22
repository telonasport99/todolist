import {instance} from "common/api/baseApi";
import {BaseResponseType} from "common/types";

export type LoginParamsType = {
    email: string;
    password: string;
    rememberMe: boolean;
    captcha?: string;
};
export const authAPI = {
    login(data: LoginParamsType) {
        return instance.post<BaseResponseType<{ userId?: number }>>("auth/login", data);
    },
    logout() {
        return instance.delete<BaseResponseType<{ userId?: number }>>("auth/login");
    },
    me() {
        return instance.get<BaseResponseType<{ id: number; email: string; login: string }>>("auth/me");
    },
};