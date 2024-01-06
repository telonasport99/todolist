import {FormikHelpers, useFormik} from "formik";
import {BaseResponseType} from "common/types";
import {useActions} from "common/hooks/useActions";
import {authThunks} from "features/auth/auth.reducer";
import {LoginParamsType} from "features/auth/authApi";
import {useSelector} from "react-redux";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
type FormsValues={
    email: string
    password: string
    rememberMe: boolean
}
type FormikErrorType = Partial<Omit<LoginParamsType, 'captcha'>>
export const useLogin=()=>{
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const {login}=useActions(authThunks)
    const formik = useFormik({
        validate: (values) => {
            const errors:FormikErrorType={}

            if (!values.email) {
                errors.email =  "Email is required"
            }
            if (!values.password) {
                errors.password= "Password is required"
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
    return {formik,isLoggedIn}
}