import { Action } from "redux";
import { LOGIN } from "./actionTypes";

export class LoginAction implements Action {
    public readonly type: string = LOGIN;
    public email: string = "";
    public roles: string[] = [];
    public jwtToken: string = "";
    public refreshToken: string = "";
}

export const login = (email: string, roles: string[], jwtToken: string, refreshToken: string): LoginAction => {
    return { type: LOGIN, email, roles, jwtToken, refreshToken };
}