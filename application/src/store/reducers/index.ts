import * as actionTypes from "../actions/actionTypes";
import { State } from "../models/State";
import { Action } from "redux";
import { LoginAction } from "../actions/login";
import { User } from "../../models/User";

const initialState: State = new State();

const rootReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.LOGIN:
            const loginAction = action as LoginAction;
            return {
                ...state,
                isLoggedIn: true,
                user: loginAction.user
            };
        case actionTypes.SIGN_OUT:
            return {
                ...state,
                isLoggedIn: false,
                user: {} as User
            }
        default:
            return state;
    }
};

export default rootReducer;
