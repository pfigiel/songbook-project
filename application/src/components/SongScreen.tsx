import React from "react";
import { FormattedMessage } from "react-intl";
import { appContext } from "../utils/AppContext";
import { config } from "../utils/config";
import { ISong } from "../models/ISong";

interface IProps {
  location: {
    state: {
      songs: Array<ISong>;
      startSongIndex: number;
    };
  };
}

interface IState {
  activeSongIndex: number;
  activeSongParsedText: any;
}
//              0    1     2    3     4    5     6     7    8    9   10    11   12    13   14    15   16    17    18   19   20    21    22   23
const notes = ["C", "c", "C#", "c#", "D", "d", "D#", "d#", "E", "e", "F", "f", "F#", "f#", "G", "g", "G#", "g#", "A", "a", "B", "b", "H", "h"];

export class SongScreen extends React.Component<IProps, IState> {
  transposition: number = 0;

  constructor(props: IProps) {
    super(props);
    this.state = {
      activeSongIndex: props.location.state.startSongIndex,
      activeSongParsedText: this.parseSongText(
        props.location.state.songs[props.location.state.startSongIndex].text
      )
    };

    this.switchToPrevSong = this.switchToPrevSong.bind(this);
    this.switchToNextSong = this.switchToNextSong.bind(this);
  }

  componentDidMount() {
    this.setState({
      activeSongIndex: this.props.location.state.startSongIndex
    });
  }

  switchToNextSong() {
    const parsedText = this.parseSongText(
      this.props.location.state.songs[
        this.state.activeSongIndex + 1
      ].text
    );
    this.setState({
      activeSongIndex: this.state.activeSongIndex + 1,
      activeSongParsedText: parsedText
    });
  }

  switchToPrevSong() {
    const parsedText = this.parseSongText(
      this.props.location.state.songs[
        this.state.activeSongIndex - 1
      ].text
    );
    this.setState({
      activeSongIndex: this.state.activeSongIndex - 1,
      activeSongParsedText: parsedText
    });
  }

  parseSongText(rawText: string) {
    const textLines = rawText.split("\n").map(line => line.trim());
    console.log(textLines);
    const textLinesHtml = new Array<any>();

    for (const textLine of textLines) {
      const lineTextChunks = new Array<string>();
      let lineChords = new Array<string>();
      textLine
        .split(/{|}/)
        .map((element, index) => index % 2 === 0 ? lineTextChunks.push(element) : lineChords.push(element));
      lineChords = lineChords.map(lc => this.translateChord(lc))
      const textLineHtml = new Array<any>();
      for (let i = 0; i < lineTextChunks.length + lineChords.length; i++) {
        i % 2 !== 0 ? textLineHtml.push(
          <span className="chord">{ lineChords[Math.floor(i / 2)] }</span>
        ) : textLineHtml.push(
          <span>{ lineTextChunks[i / 2] }</span>
        )
      }
      textLinesHtml.push(
        <p className="textLine">
          {textLineHtml}
        </p>
      );
    }

    return (
      <div>
        { textLinesHtml }
      </div>
    );
  }

  translateChord(chord: string): string {
    for (let i = 0; i < notes.length; i++) {
        chord = chord.replace(`$${i}$`, notes[(i + 2 * this.transposition) % 24])
    }

    return chord;
  }

  onTransposeUp = () => {
    this.transposition = this.transposition + 1 % 24;
    this.setState({ activeSongParsedText: this.parseSongText(this.props.location.state.songs[this.props.location.state.startSongIndex].text)});
  }

  onTransposeDown = () => {
    this.transposition = this.transposition > 0 ? this.transposition - 1 : 23;
    this.setState({ activeSongParsedText: this.parseSongText(this.props.location.state.songs[this.props.location.state.startSongIndex].text)});
  }

  render() {
    return (
      <div id="songScreenWrapper">
        <button onClick={this.onTransposeUp}>Transpose up</button>
        <button onClick={this.onTransposeDown}>Transpose down</button>
        <h1 id="songTitleHeader">
          {this.props.location.state.songs[this.state.activeSongIndex].title}
        </h1>
        <p id="songText">
          {this.state.activeSongParsedText}
        </p>
        <div id="songScreenNavButtonsWrapper">
          <button
            disabled={
              this.props.location.state.songs[
                this.state.activeSongIndex - 1
              ] === undefined
            }
            onClick={this.switchToPrevSong}
          >
            <FormattedMessage
              id="songScreen.previous"
              defaultMessage="Previous"
            />
          </button>
          <button
            onClick={() =>
              appContext.history.push(config.clientRoutes.dashboard)
            }
          >
            <FormattedMessage
              id="common.goToDashboard"
              defaultMessage="Go to Dashboard"
            />
          </button>
          <button
            disabled={
              this.props.location.state.songs[
                this.state.activeSongIndex + 1
              ] === undefined
            }
            onClick={this.switchToNextSong}
          >
            <FormattedMessage id="songScreen.next" defaultMessage="Next" />
          </button>
        </div>
      </div>
    );
  }
}
