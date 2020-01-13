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
import { config } from "../../utils/config";

export class IdentityService {
    private isClientLoggedIn() {
        const jwtToken = StorageService.get(StorageService.JWT_TOKEN);
        const refreshToken = StorageService.get(StorageService.REFRESH_TOKEN);
        return jwtToken !== null || refreshToken !== null;
    }

    public async validateToken() {
        if (this.isClientLoggedIn()){
            const response = await authorizedFetch(config.api.routes.validateToken, {
                method: "POST"
            });

            if (response.status === OK) {
                const responseBody = (await response.json()) as IApiUser;
                store.dispatch(login(responseBody.email, responseBody.roles, StorageService.get(StorageService.JWT_TOKEN), StorageService.get(StorageService.REFRESH_TOKEN)));
                return { isSuccess: true } as ValidateTokenResult;
            }
        }
        
        return { isSuccess: false } as ValidateTokenResult;
    }

    public async refreshToken() {
        const refreshResponse = await fetch(config.api.routes.refreshToken, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                RefreshToken: StorageService.get(StorageService.REFRESH_TOKEN)
            })
        });
        if (refreshResponse.status === OK) {
            const refreshResponseBody = (await refreshResponse.json()) as IApiUser;

            store.dispatch(login(refreshResponseBody.email, refreshResponseBody.roles, refreshResponseBody.token, refreshResponseBody.refreshToken));

            StorageService.set(StorageService.JWT_TOKEN, refreshResponseBody.token);
            StorageService.set(StorageService.REFRESH_TOKEN, refreshResponseBody.refreshToken);
            StorageService.set(StorageService.EMAIL, refreshResponseBody.email);
            StorageService.set(StorageService.ROLES, refreshResponseBody.roles);
            
            return { isSuccess: true } as ValidateTokenResult;
        }
    }

    public async authenticate(email: string, password: string): Promise<AuthenticateResult> {
        const response = await fetch(config.api.routes.authenticate, {
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

            store.dispatch(login(loginData.email, loginData.roles, loginData.token, loginData.refreshToken));

            StorageService.set(StorageService.JWT_TOKEN, loginData.token);
            StorageService.set(StorageService.REFRESH_TOKEN, loginData.refreshToken);
            StorageService.set(StorageService.EMAIL, loginData.email);
            StorageService.set(StorageService.ROLES, loginData.roles);

            return { isSuccess: true } as AuthenticateResult;
        } else if (response.status === UNAUTHORIZED) {
            return { isSuccess: false, error: AuthenticateResult.WRONG_CREDENTIALS } as AuthenticateResult;
        } else {
            return { isSuccess: false, error: AuthenticateResult.SERVER_ERROR } as AuthenticateResult;
        }
    }

    public async signOut(): Promise<ActionResult> {
        const response = await authorizedFetch(config.api.routes.signOut, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ RefreshToken: StorageService.get(StorageService.REFRESH_TOKEN) })
        });

        this.signOutClient();
        
        return { isSuccess: response.status === OK } as ActionResult;
    }

    public async signOutClient() {
        store.dispatch(signOut());
        StorageService.remove(StorageService.JWT_TOKEN);
        StorageService.remove(StorageService.REFRESH_TOKEN);
        StorageService.remove(StorageService.EMAIL);
        StorageService.remove(StorageService.ROLES);
    }

    public async register(email: string, password: string): Promise<ActionResult> {
        const response = await fetch(config.api.routes.register, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Email: email, Password: password })
        });

        if (response.status === OK) {
            return { isSuccess: true } as ActionResult;
        } else {
            return { isSuccess: false } as ActionResult;
        }
    }
}