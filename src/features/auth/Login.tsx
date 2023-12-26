import React from "react";
import {FormikHelpers, useFormik} from "formik";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from "@mui/material";
import {selectIsLoggedIn} from "./auth.selectors";
import {authThunks} from "features/auth/auth.reducer";
import {BaseResponseType} from "common/types";
import {useActions} from "common/hooks/useActions";

type FormsValues={
    email: string
    password: string
    rememberMe: boolean
}
export const Login = () => {
    const {login}=useActions(authThunks)

    const isLoggedIn = useSelector(selectIsLoggedIn);

    const formik = useFormik({
        validate: (values) => {
            if (!values.email) {
                return {
                    email: "Email is required",
                };
            }
            if (!values.password) {
                return {
                    password: "Password is required",
                };
            }
        },
        initialValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
        onSubmit: (values,formikHelpers:FormikHelpers<FormsValues>) => {
            login(values)
                .unwrap()
                .catch((err:BaseResponseType) => {
                    err.fieldsErrors?.forEach((fieldError)=>{
                        formikHelpers.setFieldError(fieldError.field,fieldError.error)
                    })
            })
        },
    });

    if (isLoggedIn) {
        return <Navigate to={"/"}/>;
    }

    return (
        <Grid container justifyContent="center">
            <Grid item xs={4}>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel>
                            <p>
                                To log in get registered{" "}
                                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                                    here
                                </a>
                            </p>
                            <p>or use common test account credentials:</p>
                            <p> Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </FormLabel>
                        <FormGroup>
                            <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
                            {formik.errors.email ? <div style={{color:'red'}}>{formik.errors.email}</div> : null}
                            <TextField type="password" label="Password"
                                       margin="normal" {...formik.getFieldProps("password")} />
                            {formik.errors.password ? <div style={{color:'red'}}>{formik.errors.password}</div> : null}
                            <FormControlLabel
                                label={"Remember me"}
                                control={<Checkbox {...formik.getFieldProps("rememberMe")}
                                                   checked={formik.values.rememberMe}/>}
                            />
                            <Button type={"submit"} variant={"contained"} color={"primary"}>
                                Login
                            </Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    );
};
