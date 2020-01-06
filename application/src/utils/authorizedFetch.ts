import { StorageService } from "../services/StorageService";
import { UNAUTHORIZED, OK } from "./httpStatusCodes";
import { IdentityService } from "../services/identity/IdentityService";

export const authorizedFetch = async (url: string, options: any): Promise<Response> => {
    options.headers = { ...options.headers, Authorization: `Bearer ${StorageService.get(StorageService.JWT_TOKEN)}` };
    let result = await fetch(url, options);
    if (result.status === UNAUTHORIZED) {
        await new IdentityService().refreshToken();
        result = await fetch(url, options);
    }
    
    return result;
}