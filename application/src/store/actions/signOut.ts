import { Action } from "redux";
import { SIGN_OUT } from "./actionTypes";

export class SignOutAction implements Action {
    public readonly type: string = SIGN_OUT;
}

export const signOut = (): SignOutAction => {
    return { type: SIGN_OUT }
}