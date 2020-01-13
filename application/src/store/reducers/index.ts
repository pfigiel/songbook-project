import * as actionTypes from "../actions/actionTypes";
import { State } from "../models/State";
import { Action } from "redux";
import { LoginAction } from "../actions/login";

const initialState: State = new State();

const rootReducer = (state = initialState, action: Action): State => {
    switch (action.type) {
        case actionTypes.LOGIN:
            const loginAction = action as LoginAction;
            return {
                ...state,
                user: {
                    email: loginAction.email,
                    roles: loginAction.roles,
                    jwtToken: loginAction.jwtToken,
                    refreshToken: loginAction.refreshToken,
                    isLoggedIn: true }
            };
        case actionTypes.SIGN_OUT:
            return {
                ...state,
                user: {...state.user, isLoggedIn: false }
            }
        default:
            return state;
    }
};

export default rootReducer;
