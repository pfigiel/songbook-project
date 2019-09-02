import { LoginAction } from "../actions/login";
import * as actionTypes from "../actions/actionTypes";
import { State } from "../models/State";
import { Action } from "redux";

const initialState: State = {
    isLoggedIn: false
};

const rootReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case actionTypes.LOGIN:
            console.log("LOGGIN IN");
            return {
                ...state,
                isLoggedIn: true
            };
        default:
            return state;
    }
};

export default rootReducer;
