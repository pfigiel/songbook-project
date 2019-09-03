import { StorageService } from "../services/StorageService";

export const authorizedFetch = async (url: string, options: any): Promise<Response> => {
    options.headers = { ...options.headers, Authorization: `Bearer ${StorageService.get(StorageService.JWT_TOKEN)}` }
    return await fetch(url, options)
}