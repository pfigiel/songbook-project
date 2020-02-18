export class ParsedSongSection {
    text: string;
    maxTextLineLength: number;
    maxChordLineLength: number;

    constructor(sectionText: string) {
        this.text = sectionText
        const textLines = sectionText.split("\n");
        this.maxTextLineLength = 0;
        this.maxChordLineLength = 0;
    }
}