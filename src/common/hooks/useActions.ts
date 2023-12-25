import {AnyAction, bindActionCreators} from "redux";
import {useAppDispatch} from "common/hooks/useAppDispatch";

export const useActions = (actions:any)=>{
    const dispatch = useAppDispatch()
    return bindActionCreators(actions,dispatch)
}