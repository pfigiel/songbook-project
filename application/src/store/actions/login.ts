import { Action } from "redux";
import { LOGIN } from "./actionTypes";
import { User } from "../../models/User";

export class LoginAction implements Action {
    public readonly type: string = LOGIN;
    public readonly user: User = {} as User;
}

export const login = (user: User): LoginAction => {
    return {
        type: LOGIN,
        user
    };
}