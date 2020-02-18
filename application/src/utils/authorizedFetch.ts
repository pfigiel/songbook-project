import { StorageService } from "../services/StorageService";
import { UNAUTHORIZED, OK } from "./httpStatusCodes";
import { IdentityService } from "../services/identity/IdentityService";

export const authorizedFetch = async (url: string, options: any): Promise<Response> => {
    options.headers = { ...options.headers, Authorization: `Bearer ${StorageService.get(StorageService.JWT_TOKEN)}` };

    let result = await fetch(url, options);

    if (result.status === UNAUTHORIZED) {
        const identityService = new IdentityService();
        await identityService.refreshToken();
        console.log("Token refreshed");
        options.headers = { ...options.headers, Authorization: `Bearer ${StorageService.get(StorageService.JWT_TOKEN)}` };
        result = await fetch(url, options);
        console.log(result);
        if (result.status !== OK) {
            identityService.signOutClient();
        }
    }
    
    return result;
}