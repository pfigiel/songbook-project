import React from "react";
import { FormattedMessage } from "react-intl";
import { appContext } from "../utils/AppContext";
import { config } from "../utils/config";
import { ISong } from "../models/ISong";
import { SongScreenSettingsMenu } from "./SongScreenSettingsMenu";

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
  activeSong: any;
  isMenuVisible: boolean;
  fontSize: number;
}

const notes = [
  "C",
  "c",
  "C#",
  "c#",
  "D",
  "d",
  "D#",
  "d#",
  "E",
  "e",
  "F",
  "f",
  "F#",
  "f#",
  "G",
  "g",
  "G#",
  "g#",
  "A",
  "a",
  "B",
  "b",
  "H",
  "h"
];
const DisplayModes = {
  CHORDS_OVER_TEXT: "CHORDS_OVER_TEXT",
  CHORDS_NEXT_TO_TEXT: "CHORDS_NEXT_TO_TEXT",
  NO_CHORDS: "NO_CHORDS"
};

export class SongScreen extends React.Component<IProps, IState> {
  transposition: number = 0;
  displayMode: string = DisplayModes.NO_CHORDS;

  constructor(props: IProps) {
    super(props);
    this.state = {
      activeSongIndex: props.location.state.startSongIndex,
      activeSong: this.parseSong(
        props.location.state.songs[props.location.state.startSongIndex].text
      ),
      isMenuVisible: false,
      fontSize: 20
    };

    this.switchToPrevSong = this.switchToPrevSong.bind(this);
    this.switchToNextSong = this.switchToNextSong.bind(this);
  }

  componentDidMount() {
    this.setState({
      activeSongIndex: this.props.location.state.startSongIndex
    });
    console.log(window.innerHeight);
  }

  switchToNextSong() {
    const parsedText = this.parseSong(
      this.props.location.state.songs[this.state.activeSongIndex + 1].text
    );
    this.setState({
      activeSongIndex: this.state.activeSongIndex + 1,
      activeSong: parsedText
    });
  }

  switchToPrevSong() {
    const parsedText = this.parseSong(
      this.props.location.state.songs[this.state.activeSongIndex - 1].text
    );
    this.setState({
      activeSongIndex: this.state.activeSongIndex - 1,
      activeSong: parsedText
    });
  }

  parseLine(textLine: string): [string[], string[]] {
    const lineTextChunks: string[] = new Array<string>();
    let lineChords: string[] = new Array<string>();
    textLine
      .split(/{|}/)
      .map((element, index) =>
        index % 2 === 0
          ? lineTextChunks.push(element)
          : lineChords.push(element)
      );
    lineChords = lineChords.map(lc => this.translateChord(lc));

    return [lineTextChunks, lineChords];
  }

  parseSongNoChords(textLines: string[]) {
    const textLinesHtml = new Array<any>();

    for (const textLine of textLines) {
      const parsedLine = this.parseLine(textLine);
      const textLineHtml = new Array<any>();

      for (let i = 0; i < parsedLine[0].length; i++) {
        textLineHtml.push(<span>{parsedLine[0][i]}</span>);
      }

      textLinesHtml.push(<p className="textLine">{textLineHtml}</p>);
    }

    return <div>{textLinesHtml}</div>;
  }

  parseSongChordsNextToText(textLines: string[]) {
    const textLinesHtml = new Array<any>();
    const chordLinesHtml = new Array<any>();

    for (const textLine of textLines) {
      const parsedLine = this.parseLine(textLine);
      const textLineHtml = new Array<any>();

      for (let i = 0; i < parsedLine[0].length; i++) {
        textLineHtml.push(<span>{parsedLine[0][i]}</span>);
      }

      const chordLineHtml = new Array<any>();
      for (let i = 0; i < parsedLine[1].length; i++) {
        chordLineHtml.push(<span className="chordNextToText">{parsedLine[1][i]}</span>);
      }

      textLinesHtml.push(<p className="textLine">{textLineHtml}</p>);

      chordLinesHtml.push(<p className="textLine">{chordLineHtml}</p>);
    }

    return (
      <div>
        <div style={{ display: "inline-block", marginRight: "10px" }}>{textLinesHtml}</div>
        <div style={{ display: "inline-block" }}>{chordLinesHtml}</div>
      </div>
    );
  }

  parseSongChordsOverText(textLines: string[]) {
    const textLinesHtml = new Array<any>();

    for (const textLine of textLines) {
      const parsedLine = this.parseLine(textLine);
      const textLineHtml = new Array<any>();

      for (let i = 0; i < parsedLine[0].length + parsedLine[1].length; i++) {
        i % 2 !== 0
          ? textLineHtml.push(
              <span className="chordOverText">{parsedLine[1][Math.floor(i / 2)]}</span>
            )
          : textLineHtml.push(<span>{parsedLine[0][i / 2]}</span>);
      }

      textLinesHtml.push(<p className="textLine chordsOverText">{textLineHtml}</p>);
    }

    return <div>{textLinesHtml}</div>;
  }

  parseSong(rawText: string) {
    const textLines = rawText.split("\n").map(line => line.trim());

    switch (this.displayMode) {
      case DisplayModes.CHORDS_NEXT_TO_TEXT:
        return this.parseSongChordsNextToText(textLines);
      case DisplayModes.CHORDS_OVER_TEXT:
        return this.parseSongChordsOverText(textLines);
      case DisplayModes.NO_CHORDS:
      default:
        return this.parseSongNoChords(textLines);
    }
  }

  translateChord(chord: string): string {
    for (let i = 0; i < notes.length; i++) {
      chord = chord.replace(`$${i}$`, notes[(i + 2 * this.transposition) % 24]);
    }

    return chord;
  }

  onTransposeUp = () => {
    this.transposition = this.transposition + (1 % 24);
    this.setState({
      activeSong: this.parseSong(
        this.props.location.state.songs[
          this.props.location.state.startSongIndex
        ].text
      )
    });
  };

  onTransposeDown = () => {
    this.transposition = this.transposition > 0 ? this.transposition - 1 : 23;
    this.setState({
      activeSong: this.parseSong(
        this.props.location.state.songs[
          this.props.location.state.startSongIndex
        ].text
      )
    });
  };

  onChordsOverTextDisplayModeClick = () => {
    this.displayMode = DisplayModes.CHORDS_OVER_TEXT;
    this.setState({ activeSong: this.parseSong(this.props.location.state.songs[this.props.location.state.startSongIndex].text) });
  }

  onChordsNextToTextDisplayModeClick = () => {
    this.displayMode = DisplayModes.CHORDS_NEXT_TO_TEXT;
    this.setState({ activeSong: this.parseSong(this.props.location.state.songs[this.props.location.state.startSongIndex].text) });
  }

  onNoChordsDisplayModeClick = () => {
    this.displayMode = DisplayModes.NO_CHORDS;
    this.setState({ activeSong: this.parseSong(this.props.location.state.songs[this.props.location.state.startSongIndex].text) });
  }

  render() {
    return (
      <div id="songScreenWrapper">
        <div id="menuWrapper">
          <button
            onClick={() => this.setState({ isMenuVisible: !this.state.isMenuVisible })}
            id="menuButton">
              <FormattedMessage id="songScreen.settings" defaultMessage="Settings" />
            </button>
          {this.state.isMenuVisible &&
            <SongScreenSettingsMenu
              onTransposeUp={this.onTransposeUp}
              onTransposeDown={this.onTransposeDown}
              onChordsOverTextDisplayModeClick={this.onChordsOverTextDisplayModeClick}
              onChordsNextToTextDisplayModeClick={this.onChordsNextToTextDisplayModeClick}
              onNoChordsDisplayModeClick={this.onNoChordsDisplayModeClick}
            />
          }
        </div>
        <h1 id="songTitleHeader">
          {this.props.location.state.songs[this.state.activeSongIndex].title}
        </h1>
        <p id="songText" style={{ fontSize: this.state.fontSize }}>{this.state.activeSong}</p>
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
