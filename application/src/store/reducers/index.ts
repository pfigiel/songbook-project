import * as actionTypes from "../actions/actionTypes";
import { State } from "../models/State";
import { Action } from "redux";

const initialState: State = {
    isLoggedIn: false
};

const rootReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.LOGIN:
            return {
                ...state,
                isLoggedIn: true
            };
        case actionTypes.SIGN_OUT:
            return {
                ...state,
                isLoggedIn: false
            }
        default:
            return state;
    }
};

export default rootReducer;
