import { ParsedSongSection } from "./ParsedSongSection";

export class ParsedSong {
    sections: ParsedSongSection[];

    constructor(rawSong: string) {
        const songSections: string[] = rawSong.split(/[=]+/);

        this.sections = songSections.map(ss => new ParsedSongSection(ss));
    }
}