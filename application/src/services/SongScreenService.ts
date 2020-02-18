export class SongScreenService {
    //                  0    1     2     3    4     5   6    7    8     9    10    11   12    13   14    15   16    17   18    19  20    21   22   23
    notes: string[] = ["C", "c", "C#", "c#", "D", "d", "D#", "d#", "E", "e", "F", "f", "F#", "f#", "G", "g", "G#", "g#", "A", "a", "B", "b", "H", "h"];
    
    translateChord(rawChord: string, transposition: number): string {
        let chord: string = rawChord;
        for (let i = 0; i < this.notes.length; i++) {
            chord = chord.replace(`$${i}$`, this.notes[(i + 2 * transposition) % 24]);
          }
      
          return chord;
    }
}