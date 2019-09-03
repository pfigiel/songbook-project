import { Action } from "redux";
import { LOGIN } from "./actionTypes";

export class LoginAction implements Action {
    public readonly type: string = LOGIN;
}

export const login = (): LoginAction => {
    return { type: LOGIN }
}