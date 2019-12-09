import { login } from "../../store/actions/login";
import { signOut } from "../../store/actions/signOut";
import { store } from "../../store/index";
import { IApiUser } from "../../models/IApiUser";
import { AuthenticateResult } from "./AuthenticateResult";
import { OK, UNAUTHORIZED } from "../../utils/httpStatusCodes";
import { authorizedFetch } from "../../utils/authorizedFetch";
import { ValidateTokenResult } from "./ValidateTokenResult";
import { StorageService } from "../StorageService";
import { ActionResult } from "../../utils/ActionResult";

export class IdentityService {
    public async validateToken() {
        const response = await authorizedFetch("http://localhost:5000/identity/validateToken", {
            method: "POST"
        });
        if (response.status === OK) {
            return { isSuccess: true, isTokenValid: true } as ValidateTokenResult;
        } else if (response.status === UNAUTHORIZED) {
            return { isSuccess: true } as ValidateTokenResult;
        } else {
            return { isSuccess: false } as ValidateTokenResult;
        }
    }

    public async authenticate(email: string, password: string): Promise<AuthenticateResult> {
        const response = await fetch("http://localhost:5000/identity/authenticate", {
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
            store.dispatch(login());
            StorageService.set(StorageService.JWT_TOKEN, loginData.token);
            return { isSuccess: true } as AuthenticateResult;
        } else if (response.status === UNAUTHORIZED) {
            return { isSuccess: false, error: AuthenticateResult.WRONG_CREDENTIALS } as AuthenticateResult;
        } else {
            return { isSuccess: false, error: AuthenticateResult.SERVER_ERROR } as AuthenticateResult;
        }
    }

    public async signOut(): Promise<ActionResult> {
        const response = await authorizedFetch("http://localhost:5000/identity/signOut", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.status === OK) {
            store.dispatch(signOut());
            StorageService.set(StorageService.JWT_TOKEN, undefined);
            return { isSuccess: true } as ActionResult;
        } else {
            return { isSuccess: false } as ActionResult;
        }
    }
}