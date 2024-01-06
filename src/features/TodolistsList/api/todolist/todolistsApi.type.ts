// types
export type TodolistType = {
    id: string;
    title: string;
    addedDate: string;
    order: number;
};
export const ResultCode = {
    success: 0,
    error: 1,
    captcha: 10
} as const