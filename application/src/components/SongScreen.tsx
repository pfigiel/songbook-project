import React from "react";
import { FormattedMessage } from "react-intl";
import { appContext } from "../utils/AppContext";
import { config } from "../utils/config";
import { ISong } from "../models/ISong";
import { SongScreenSettingsMenu } from "./SongScreenSettingsMenu";
import { SongScreenService } from "../services/SongScreenService";

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
  textPaddingTop: number;
  lineHeight: number;
  songSectionsCount: number;
}

const DisplayModes = {
  CHORDS_OVER_TEXT: "CHORDS_OVER_TEXT",
  CHORDS_NEXT_TO_TEXT: "CHORDS_NEXT_TO_TEXT",
  NO_CHORDS: "NO_CHORDS"
};

export class SongScreen extends React.Component<IProps, IState> {
  service: SongScreenService = new SongScreenService();
  transposition: number = 0;
  displayMode: string = DisplayModes.NO_CHORDS;

  constructor(props: IProps) {
    super(props);
    this.state = {
      activeSong: <div></div>,
      activeSongIndex: props.location.state.startSongIndex,
      fontSize: 20,
      lineHeight: 30,
      textPaddingTop: 0,
      isMenuVisible: false,
      songSectionsCount: 1
    }

    this.switchToPrevSong = this.switchToPrevSong.bind(this);
    this.switchToNextSong = this.switchToNextSong.bind(this);
  }

  componentDidMount() {
    this.setState({
      activeSong: this.parseSong(
        this.props.location.state.songs[this.props.location.state.startSongIndex].text
      ),
    });
  }

  calculateTextSectionHeight(): number {
    return window.innerHeight - 20 - 30 - 40 - 40 - 25 - 20;
  }

  calculateTextSectionWidth(): number {
    return window.innerWidth - 20 - 20;
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
    lineChords = lineChords.length !== 0 ? lineChords.map(lc => this.service.translateChord(lc, this.transposition)) : [" "];

    return [lineTextChunks, lineChords];
  }

  parseSongNoChords = (textLines: string[]) => {
    const textLinesHtml = new Array<any>();

    for (const textLine of textLines) {
      const parsedLine = this.parseLine(textLine);
      const textLineHtml = new Array<any>();

      for (let i = 0; i < parsedLine[0].length; i++) {
        textLineHtml.push(<span>{parsedLine[0][i]}</span>);
      }

      textLinesHtml.push(<div className="textLine" style={{ lineHeight: `${this.state.lineHeight}px` }}>{textLineHtml}</div >);
    }

    return <div>{textLinesHtml}</div>;
  }

  parseSongChordsNextToText = (textLines: string[]) => {
    const textLinesHtml = new Array<any>();
    const chordLinesHtml = new Array<any>();

    for (const textLine of textLines.filter(tl => tl !== "")) {
      const parsedLine = this.parseLine(textLine);
      const textLineHtml = new Array<any>();

      for (let i = 0; i < parsedLine[0].length; i++) {
        textLineHtml.push(<span>{parsedLine[0][i]}</span>);
      }

      const chordLineHtml = new Array<any>();
      for (let i = 0; i < parsedLine[1].length; i++) {
        chordLineHtml.push(<span className="chordNextToText">{parsedLine[1][i]}</span>);
      }

      textLinesHtml.push(<p className="textLine" style={{ lineHeight: `${this.state.lineHeight}px` }}>{textLineHtml}</p>);

      chordLinesHtml.push(<p className="textLine" style={{ lineHeight: `${this.state.lineHeight}px` }}>{chordLineHtml}</p>);
    }

    return (
      <div>
        <div style={{ display: "inline-block", marginRight: "10px" }}>{textLinesHtml}</div>
        <div style={{ display: "inline-block" }}>{chordLinesHtml}</div>
      </div>
    );
  }

  parseSongChordsOverText = (textLines: string[]) => {
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

      textLinesHtml.push(<p className="textLine chordsOverText" style={{ lineHeight: `${this.state.lineHeight}px` }}>{textLineHtml}</p>);
    }

    return <div>{textLinesHtml}</div>;
  }

  parseSong = (rawText: string) => {
    const textLines = rawText.split("\n").map(line => line.trim());
    const parsedLines = textLines.map(tl => this.parseLine(tl));
    let fontSizePerHeight;
    let fontSizePerWidth;
    let fontSize;

    switch (this.displayMode) {
      case DisplayModes.CHORDS_NEXT_TO_TEXT:
        const maxLineLength = Math.max(...parsedLines.map(pl => pl[0].join("").length)) + Math.max(...parsedLines.map(pl => pl[1].join(" ").length));
        fontSizePerHeight = Math.floor(this.calculateTextSectionHeight() / textLines.length / 3 * 2);
        fontSizePerWidth = Math.floor(this.calculateTextSectionWidth() / maxLineLength / 0.5);
        fontSize = Math.min(fontSizePerWidth, fontSizePerHeight);

        this.setState({
          fontSize,
          lineHeight: fontSize * 1.5,
          textPaddingTop: (this.calculateTextSectionHeight() - fontSize * 1.5 * textLines.length) * 2 / 5
        });

        return this.parseSongChordsNextToText(textLines);
      case DisplayModes.CHORDS_OVER_TEXT:
        fontSizePerHeight = Math.floor(this.calculateTextSectionHeight() / parsedLines.length / 3);
        fontSizePerWidth = Math.floor(this.calculateTextSectionWidth() / Math.max(...parsedLines.map(pl => pl[0].join("").length)) / 0.5);
        fontSize = Math.min(fontSizePerWidth, fontSizePerHeight);

        this.setState({
          fontSize,
          lineHeight: fontSize * 3,
          textPaddingTop: (this.calculateTextSectionHeight() - fontSize * 3 * parsedLines.length) * 2 / 5
        });

        return this.parseSongChordsOverText(textLines);
      case DisplayModes.NO_CHORDS:
      default:
        fontSizePerHeight = Math.floor(this.calculateTextSectionHeight() / parsedLines.length / 3 * 2);
        fontSizePerWidth = Math.floor(this.calculateTextSectionWidth() / Math.max(...parsedLines.map(pl => pl[0].join("").length)) / 0.5);
        fontSize = Math.min(fontSizePerWidth, fontSizePerHeight);

        this.setState({
          fontSize,
          lineHeight: fontSize * 1.5,
          textPaddingTop: (this.calculateTextSectionHeight() - fontSize * 1.5 * parsedLines.length) * 2 / 5
        });

        return this.parseSongNoChords(textLines);
    }
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
        <div id="songText" style={{ fontSize: this.state.fontSize, paddingTop: this.state.textPaddingTop }}>{this.state.activeSong}</div>
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
