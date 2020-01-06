import { CurrentLanguage } from "../utils/IntlProviderWrapper";
import { config } from "../utils/config";
import { ActionResult } from "../utils/ActionResult";
import { authorizedFetch } from "../utils/authorizedFetch";
import { OK } from "../utils/httpStatusCodes";

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

    public async addSong(title: string, originalTitle: string, artist: string, arrangement: string, language: string, text: string): Promise<ActionResult> {
        const response = await authorizedFetch(config.api.routes.addSong, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Title: title,
                OriginalTitle: originalTitle,
                Artist: artist,
                Arrangement: arrangement,
                Language:
                language,
                Text: text
            })
        });

        if (response.status === OK) {
            return { isSuccess: true } as ActionResult;
        } else {
            return { isSuccess: false } as ActionResult;
        }
    }

    public async modifySong(id: number, title: string, originalTitle: string, artist: string, arrangement: string, language: string, text: string): Promise<ActionResult> {
        const response = await authorizedFetch(`${config.api.routes.modifySong}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Title: title,
                OriginalTitle: originalTitle,
                Artist: artist,
                Arrangement: arrangement,
                Language:
                language,
                Text: text
            })
        });

        if (response.status === OK) {
            return { isSuccess: true } as ActionResult;
        } else {
            return { isSuccess: false } as ActionResult;
        }
    }

    public async deleteSong(id: number): Promise<ActionResult> {
        const response = await authorizedFetch(`${config.api.routes.deleteSong}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (response.status === OK) {
            return { isSuccess: true } as ActionResult;
        } else {
            return { isSuccess: false } as ActionResult;
        }
    }
}