import { CurrentLanguage } from "../utils/IntlProviderWrapper";

export class SongsService {
    public async getAll() {
        const result = await fetch("https://localhost:44340/songs", {
            method: "GET",
            headers: {
                "Accept-Language": CurrentLanguage()
            }
        });
        return await result.json();
    }
}