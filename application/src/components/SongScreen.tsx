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

export class SongScreen extends React.Component<IProps, IState> {
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
    const textLines = rawText.split("\\n").map(line => line.trim());
    const textLinesHtml = new Array<any>();
    for (const textLine of textLines) {
      const lineTextChunks = new Array<string>();
      const lineChords = new Array<string>();
      textLine.split(/{|}/).map((element, index) => index % 2 === 0 ? lineTextChunks.push(element) : lineChords.push(element));
      const textLineHtml = new Array<any>();
      for (let i = 0; i < lineTextChunks.length + lineChords.length; i++) {
        i % 2 !== 0 ? textLineHtml.push(
          <span className="chord">{ lineChords[Math.floor(i / 2)] }</span>
        ) : textLineHtml.push(
          <span>{ lineTextChunks[i / 2] }</span>
        )
      }
      textLinesHtml.push(
        <p>
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

  render() {
    return (
      <div id="songScreenWrapper">
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
