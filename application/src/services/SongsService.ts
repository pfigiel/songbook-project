import { CurrentLanguage } from "../utils/IntlProviderWrapper";
import { config } from "../utils/config";

export class SongsService {
    public async getAll() {
        const result = await fetch(config.api.routes.songs, {
            method: "GET",
            headers: {
                "Accept-Language": CurrentLanguage()
            }
        });
        return await result.json();
    }
}