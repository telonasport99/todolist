 export type BaseResponseType<D = {}> = {
    resultCode: number;
    messages: Array<string>;
    data: D;
};
export type FieldErrorType={
    error:string
    field:string
}
