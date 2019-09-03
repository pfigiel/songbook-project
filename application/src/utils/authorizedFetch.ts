import { StorageService } from "../services/StorageService";

export const authorizedFetch = async (url: string, options: any): Promise<Response> => {
    options.headers = { ...options.headers, Authorization: `Bearer ${StorageService.get(StorageService.JWT_TOKEN)}` }
    console.log(options)
    return await fetch(url, options)
}