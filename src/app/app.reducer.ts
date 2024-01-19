import {createSlice, isFulfilled, isPending, isRejected, PayloadAction} from "@reduxjs/toolkit";
import {AnyAction} from "redux";


const initialState = {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
};

export type AppInitialStateType = typeof initialState;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error;
        },
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status;
        },
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized;
        },
    },
    extraReducers: builder => {
        builder.addMatcher(
            isPending, (state) => {
                state.status = 'loading'
            })
            .addMatcher(
                isRejected,
                (state, action: AnyAction) => {
                    state.status = 'failed'
                    if (action.payload) {
                        if (action.type === "todo/addTodolist/rejected") return;
                        state.error = action.payload.messages[0]
                    } else {
                        state.error = action.error.message ? action.error.message : 'Some error occurred'
                    }
                }
            )
            .addMatcher(isFulfilled(),
                (state) => {
                    state.status = 'succeeded'
                })
    }
});


export const appReducer = slice.reducer;
export const appActions = slice.actions;