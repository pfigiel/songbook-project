import { Action } from "redux";
import { LOGIN } from "./actionTypes";

export class LoginAction implements Action {
    public readonly type: string = LOGIN;
    public jwtToken: string = "";
}

export const login = (jwtToken: string): LoginAction => {
    return { type: LOGIN, jwtToken }
}