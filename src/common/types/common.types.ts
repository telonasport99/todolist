 export type BaseResponseType<D = {}> = {
    resultCode: number;
    messages: Array<string>;
    data: D;
    fieldsErrors:FieldErrorType[]
};
export type FieldErrorType={
    error:string
    field:string
}
