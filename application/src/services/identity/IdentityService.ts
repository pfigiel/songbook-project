import { login } from "../../store/actions/login";
import { store } from "../../store/index";
import { IApiUser } from "../../models/IApiUser";
import { AuthenticateResult } from "./AuthenticateResult";
import { OK, Unauthorized } from "../../utils/httpStatusCodes";

export class IdentityService {
    public async authenticate(email: string, password: string) {
        const response = await fetch("https://localhost:44340/identity/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Email: email,
                Password: password
            })
        });
        if (response.status === OK) {
            const loginData = (await response.json()) as IApiUser;
            store.dispatch(login(loginData.token));
            return { isSuccess: true } as AuthenticateResult;
        } else if (response.status === Unauthorized) {
            return { isSuccess: false, error: AuthenticateResult.WRONG_CREDENTIALS } as AuthenticateResult;
        } else {
            return { isSuccess: false, error: AuthenticateResult.SERVER_ERROR } as AuthenticateResult;
        }
    }
}